package tariffrepository

import (
	"log"
	"time"

	"gorm.io/gorm"
)

type PaymentType string

const (
	Annuity        PaymentType = "ANNUITY" // Аннуитетный платеж
	Differentiated PaymentType = "DIFF"    // Дифференцированный платеж
)

// CreditTariff представляет сущность кредитного тарифа
type CreditTariff struct {
	gorm.Model
	ID uint `gorm:"primaryKey"`

	Name string `gorm:"not null"`

	MinAmount float64 `gorm:"not null"`
	MaxAmount float64 `gorm:"not null"`

	MinInterestRate float64 `gorm:"not null"`
	MaxInterestRate float64 `gorm:"not null"`

	PaymentType PaymentType `gorm:"not null"`

	MinTermMonth uint `gorm:"not null"`
	MaxTermMonth uint `gorm:"not null"`

	Description string

	CreatedAt time.Time
	UpdatedAt time.Time
}

// CreditTariffRepository предоставляет методы для работы с кредитными тарифами
type CreditTariffRepository interface {
	Create(tariff *CreditTariff) error
	FindByID(id uint) (*CreditTariff, error)
	Update(tariff *CreditTariff) error
	Delete(id uint) error
	GetAll(limit int, offset int) ([]*CreditTariff, error)
}

type creditTariffRepositoryImpl struct {
	db *gorm.DB
}

// Migrate создает таблицы в базе данных
func Migrate(db *gorm.DB) error {
	err := db.AutoMigrate(&CreditTariff{})
	if err != nil {
		return err
	}
	return nil
}

// NewCreditTariffRepository создает новый репозиторий кредитных тарифов
func NewCreditTariffRepository(db *gorm.DB) CreditTariffRepository {
	if err := Migrate(db); err != nil {
		log.Fatal(err)
	}

	return &creditTariffRepositoryImpl{db: db}
}

// Create создает новый кредитный тариф
func (r *creditTariffRepositoryImpl) Create(tariff *CreditTariff) error {
	return r.db.Create(tariff).Error
}

// FindByID ищет кредитный тариф по ID
func (r *creditTariffRepositoryImpl) FindByID(id uint) (*CreditTariff, error) {
	var tariff CreditTariff
	if err := r.db.First(&tariff, id).Error; err != nil {
		return nil, err
	}
	return &tariff, nil
}

// Update обновляет данные кредитного тарифа
func (r *creditTariffRepositoryImpl) Update(tariff *CreditTariff) error {
	return r.db.Save(tariff).Error
}

// Delete удаляет кредитный тариф по ID
func (r *creditTariffRepositoryImpl) Delete(id uint) error {
	return r.db.Delete(&CreditTariff{}, id).Error
}

// GetAll возвращает список кредитных тарифов с учетом лимита и смещения
func (r *creditTariffRepositoryImpl) GetAll(limit int, offset int) ([]*CreditTariff, error) {
	var tariffs []*CreditTariff
	if err := r.db.Limit(limit).Offset(offset).Find(&tariffs).Error; err != nil {
		return nil, err
	}
	return tariffs, nil
}
