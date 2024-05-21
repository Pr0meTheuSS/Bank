package creditrepository

import (
	"gateway/internal/models"
	userrepository "gateway/internal/repositories/user_repository"
	"log"

	"time"

	"gorm.io/gorm"
)

type money uint64

// toPaymentType - вспомогательная функция для преобразования строки в PaymentType
// func toPaymentType(value string) PaymentType {
// 	switch value {
// 	case "Annuity":
// 		return Annuity
// 	case "Differentiated":
// 		return Differentiated
// 	default:
// 		return Annuity // Значение по умолчанию
// 	}
// }

type Credit struct {
	gorm.Model
	ID            uint `gorm:"primaryKey"`
	UserID        int
	User          userrepository.DBUser `gorm:"constraint:OnUpdate:SET NULL,OnDelete:CASCADE;"`
	ApplicationID uint

	Body       money // Основная сумма кредита
	Percents   money // Проценты по кредиту
	Fine       money // Штрафы
	Commission money // Комиссия

	IsActive bool // Статус кредита

	PaymentType    models.PaymentType // Тип платежей: аннуитетный или дифференцированный
	InterestRate   float64            // Процентная ставка
	LoanTermMonths uint               // Срок кредита в месяцах
	StartDate      time.Time          // Дата начала кредита
	EndDate        time.Time          // Дата окончания кредита

	CreatedAt time.Time // Дата создания кредита
	UpdatedAt time.Time // Дата последнего обновления
}

type CreditRepository interface {
	Create(credit *models.Credit) error
	Update(id uint, credit *models.Credit) error
	Delete(id uint) error

	GetAll(limit int, offset int) ([]*models.Credit, error)
	GetByID(id uint) (*models.Credit, error)
	GetAllForUser(userID uint) ([]*models.Credit, error)
}

func Migrate(db *gorm.DB) error {
	err := db.AutoMigrate(Credit{})
	if err != nil {
		return err
	}
	return nil
}

type creditRepositoryImpl struct {
	db *gorm.DB
}

func NewCreditRepository(db *gorm.DB) CreditRepository {
	if err := Migrate(db); err != nil {
		log.Fatal(err)
	}

	return &creditRepositoryImpl{db: db}
}

func (r *creditRepositoryImpl) Create(credit *models.Credit) error {
	return r.db.Create(credit).Error
}

func (r *creditRepositoryImpl) Update(id uint, credit *models.Credit) error {
	return r.db.Model(&models.Credit{}).Where("id = ?", id).Updates(credit).Error
}

func (r *creditRepositoryImpl) Delete(id uint) error {
	return r.db.Delete(&models.Credit{}, id).Error
}

func (r *creditRepositoryImpl) GetByID(id uint) (*models.Credit, error) {
	var credit models.Credit
	err := r.db.First(&credit, id).Error
	if err != nil {
		return nil, err
	}
	return &credit, nil
}

func (r *creditRepositoryImpl) GetAllForUser(userID uint) ([]*models.Credit, error) {
	var credits []*models.Credit
	err := r.db.Where("user_id = ?", userID).Find(&credits).Error
	if err != nil {
		return nil, err
	}
	return credits, nil
}

func (r *creditRepositoryImpl) GetAll(limit int, offset int) ([]*models.Credit, error) {
	var credits []*models.Credit

	if limit == 0 {
		err := r.db.Find(&credits).Error
		if err != nil {
			return nil, err
		}
		return credits, nil
	}

	err := r.db.Limit(limit).Offset(offset).Find(&credits).Error
	if err != nil {
		return nil, err
	}
	return credits, nil
}
