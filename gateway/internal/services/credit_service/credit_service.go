package creditservice

import (
	"context"
	"gateway/internal/models"
	creditrepository "gateway/internal/repositories/credit_repository"
)

type CreditService interface {
	Create(ctx context.Context, credit *models.Credit) error
	Delete(ctx context.Context, ID int) error
	Update(ctx context.Context, credit *models.Credit) error

	GetCreditByUserID(ctx context.Context, userID int) ([]*models.Credit, error)
	GetCredits(ctx context.Context, limit int, offset int) ([]*models.Credit, error)
}

type CreditServiceImpl struct {
	creditRepo creditrepository.CreditRepository
}

func NewCreditService(creditRepo creditrepository.CreditRepository) CreditService {
	return &CreditServiceImpl{
		creditRepo: creditRepo,
	}
}

func (s *CreditServiceImpl) Create(ctx context.Context, credit *models.Credit) error {
	return s.creditRepo.Create(credit)
}

func (s *CreditServiceImpl) Delete(ctx context.Context, ID int) error {
	return s.creditRepo.Delete(uint(ID))
}

func (s *CreditServiceImpl) Update(ctx context.Context, credit *models.Credit) error {
	return s.creditRepo.Update(uint(credit.ID), credit)
}

func (s *CreditServiceImpl) GetCreditByUserID(ctx context.Context, userID int) ([]*models.Credit, error) {
	return s.creditRepo.GetAllForUser(uint(userID))
}

func (s *CreditServiceImpl) GetCredits(ctx context.Context, limit int, offset int) ([]*models.Credit, error) {
	return s.creditRepo.GetAll(limit, offset)
}
