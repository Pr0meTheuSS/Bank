package creditservice

import (
	"context"
	"errors"
	auth "gateway/internal"
	"gateway/internal/api/graph/model"
	"gateway/internal/models"
	creditrepository "gateway/internal/repositories/credit_repository"
	"log"
)

type CreditService interface {
	Create(ctx context.Context, auth *auth.AuthData, credit *models.Credit) error
	Delete(ctx context.Context, auth *auth.AuthData, ID int) error
	Update(ctx context.Context, auth *auth.AuthData, credit *models.Credit) error

	GetCreditByUserID(ctx context.Context, auth *auth.AuthData, userID int) ([]*models.Credit, error)
	GetCredits(ctx context.Context, auth *auth.AuthData, limit int, offset int, filters *model.CreditFilters) ([]*models.Credit, error)
}

type CreditServiceImpl struct {
	creditRepo creditrepository.CreditRepository
}

func NewCreditService(creditRepo creditrepository.CreditRepository) CreditService {
	return &CreditServiceImpl{
		creditRepo: creditRepo,
	}
}

func (s *CreditServiceImpl) Create(ctx context.Context, auth *auth.AuthData, credit *models.Credit) error {
	if auth.Role != model.UserRoleAdmin && auth.UserId != int(credit.UserID) {
		return errors.New("access denied")
	}

	return s.creditRepo.Create(credit)
}

func (s *CreditServiceImpl) Delete(ctx context.Context, auth *auth.AuthData, ID int) error {
	if auth.Role != model.UserRoleAdmin {
		return errors.New("access denied")
	}

	return s.creditRepo.Delete(uint(ID))
}

func (s *CreditServiceImpl) Update(ctx context.Context, auth *auth.AuthData, credit *models.Credit) error {
	if auth.Role != model.UserRoleAdmin {
		return errors.New("access denied")
	}

	return s.creditRepo.Update(uint(credit.ID), credit)
}

func (s *CreditServiceImpl) GetCreditByUserID(ctx context.Context, auth *auth.AuthData, userID int) ([]*models.Credit, error) {
	if auth.Role == model.UserRoleClient && auth.UserId != int(userID) {
		return nil, errors.New("access denied")
	}

	return s.creditRepo.GetAllForUser(uint(userID))
}

func (s *CreditServiceImpl) GetCredits(ctx context.Context, auth *auth.AuthData, limit int, offset int, filters *model.CreditFilters) ([]*models.Credit, error) {
	log.Println("Credit Service GetCredits invoked")
	if auth.Role != model.UserRoleAdmin {
		return nil, errors.New("access denied")
	}

	return s.creditRepo.GetAll(limit, offset, filters)
}
