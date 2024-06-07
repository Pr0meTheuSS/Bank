package transactionservice

import (
	"gateway/internal/models"
	transactionrepository "gateway/internal/repositories/transaction_repository"
)

var _ TransactionService = (*transactionServiceImpl)(nil)

type TransactionService interface {
	AcceptPayment(creditID int, amount int) error
	GetPaymentsShedule(creditID int) ([]*models.Payment, error)
	ReshedulePayments(creditID int) ([]*models.Payment, error)
	GetLastUnpaidTransaction(creditID int) (*models.Payment, error)
}

type transactionServiceImpl struct {
	transactionRepo transactionrepository.TransactionRepository
}

func NewTransactionService(repo transactionrepository.TransactionRepository) TransactionService {
	return &transactionServiceImpl{
		transactionRepo: repo,
	}
}

func (s *transactionServiceImpl) AcceptPayment(creditID int, amount int) error {
	return s.transactionRepo.AcceptPayment(creditID, amount)
}

func (s *transactionServiceImpl) GetPaymentsShedule(creditID int) ([]*models.Payment, error) {
	return s.transactionRepo.GetPaymentsShedule(creditID)
}

func (s *transactionServiceImpl) ReshedulePayments(creditID int) ([]*models.Payment, error) {
	return nil, nil
}

func (s *transactionServiceImpl) GetLastUnpaidTransaction(creditID int) (*models.Payment, error) {
	return nil, nil
}
