package transactionrepository

import (
	"gateway/internal/models"
	creditrepository "gateway/internal/repositories/credit_repository"
	"time"

	"gorm.io/gorm"
)

type TransactionRepository interface {
	AcceptPayment(creditID int, amount int) error
	GetPaymentsShedule(creditID int) ([]*models.Payment, error)
}

type Payment struct {
	gorm.Model
	ID uint `gorm:"primaryKey"`

	CreditID int
	Credit   creditrepository.Credit `gorm:"constraint:OnUpdate:SET NULL,OnDelete:CASCADE;"`

	Amount      int
	PaymentType models.PaymentType

	CreatedAt time.Time
}

type transactionRepositoryImpl struct {
	db *gorm.DB
}

func NewTransactionRepository(db *gorm.DB) TransactionRepository {
	if err := db.AutoMigrate(Payment{}); err != nil {
		panic(err.Error())
	}

	return &transactionRepositoryImpl{db: db}
}

func (r *transactionRepositoryImpl) AcceptPayment(creditID int, amount int) error {
	return nil
}
func (r *transactionRepositoryImpl) GetPaymentsShedule(creditID int) ([]*models.Payment, error) {
	return nil, nil
}
