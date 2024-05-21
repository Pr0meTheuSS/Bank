package tariffservice

import (
	"context"

	auth "gateway/internal"
	"gateway/internal/models"
	tariffrepository "gateway/internal/repositories/tariff_repository"
)

type TariffService interface {
	Create(ctx context.Context, authData *auth.AuthData, tariff *models.Tariff) error
	Update(ctx context.Context, authData *auth.AuthData, tariff *models.Tariff) error
	Delete(ctx context.Context, authData *auth.AuthData, ID int) error
	GetByID(ctx context.Context, ID int) (*models.Tariff, error)
	GetTariffs(ctx context.Context, limit int, offset int) ([]*models.Tariff, error)
}

// TariffServiceImpl реализует интерфейс TariffService
type TariffServiceImpl struct {
	repository tariffrepository.CreditTariffRepository
}

// NewTariffService создаёт новый сервис кредитных тарифов
func NewTariffService(repo tariffrepository.CreditTariffRepository) *TariffServiceImpl {
	return &TariffServiceImpl{repository: repo}
}

// Create создаёт новый кредитный тариф
func (s *TariffServiceImpl) Create(ctx context.Context, authData *auth.AuthData, tariff *models.Tariff) error {
	creditTariff := &tariffrepository.CreditTariff{
		Name:            tariff.Name,
		MinAmount:       tariff.MinAmount,
		MaxAmount:       tariff.MaxAmount,
		MinInterestRate: tariff.MinInterestRate,
		MaxInterestRate: tariff.MaxInterestRate,
		PaymentType:     tariffrepository.PaymentType(tariff.PaymentType),
		MinTermMonth:    tariff.MinTermMonth,
		MaxTermMonth:    tariff.MaxTermMonth,
		Description:     tariff.Description,
	}
	return s.repository.Create(creditTariff)
}

// Update обновляет существующий кредитный тариф
func (s *TariffServiceImpl) Update(ctx context.Context, authData *auth.AuthData, tariff *models.Tariff) error {
	existingTariff, err := s.repository.FindByID(uint(tariff.ID))
	if err != nil {
		return err
	}

	existingTariff.Name = tariff.Name
	existingTariff.MinAmount = tariff.MinAmount
	existingTariff.MaxAmount = tariff.MaxAmount
	existingTariff.MinInterestRate = tariff.MinInterestRate
	existingTariff.MaxInterestRate = tariff.MaxInterestRate
	existingTariff.PaymentType = tariffrepository.PaymentType(tariff.PaymentType)
	existingTariff.MinTermMonth = tariff.MinTermMonth
	existingTariff.MaxTermMonth = tariff.MaxTermMonth
	existingTariff.Description = tariff.Description

	return s.repository.Update(existingTariff)
}

// Delete удаляет кредитный тариф по ID
func (s *TariffServiceImpl) Delete(ctx context.Context, authData *auth.AuthData, ID int) error {
	return s.repository.Delete(uint(ID))
}

// GetByID возвращает кредитный тариф по ID
func (s *TariffServiceImpl) GetByID(ctx context.Context, ID int) (*models.Tariff, error) {
	creditTariff, err := s.repository.FindByID(uint(ID))
	if err != nil {
		return nil, err
	}

	return &models.Tariff{
		ID:              uint(creditTariff.ID),
		Name:            creditTariff.Name,
		MinAmount:       creditTariff.MinAmount,
		MaxAmount:       creditTariff.MaxAmount,
		MinInterestRate: creditTariff.MinInterestRate,
		MaxInterestRate: creditTariff.MaxInterestRate,
		PaymentType:     models.PaymentType(creditTariff.PaymentType),
		MinTermMonth:    creditTariff.MinTermMonth,
		MaxTermMonth:    creditTariff.MaxTermMonth,
		Description:     creditTariff.Description,
	}, nil
}

// GetTariffs возвращает список кредитных тарифов с пагинацией
func (s *TariffServiceImpl) GetTariffs(ctx context.Context, limit int, offset int) ([]*models.Tariff, error) {
	var tariffs []*models.Tariff
	creditTariffs, err := s.repository.GetAll(limit, offset)
	if err != nil {
		return nil, err
	}

	for _, creditTariff := range creditTariffs {
		tariffs = append(tariffs, &models.Tariff{
			ID:              uint(creditTariff.ID),
			Name:            creditTariff.Name,
			MinAmount:       creditTariff.MinAmount,
			MaxAmount:       creditTariff.MaxAmount,
			MinInterestRate: creditTariff.MinInterestRate,
			MaxInterestRate: creditTariff.MaxInterestRate,
			PaymentType:     models.PaymentType(creditTariff.PaymentType),
			MinTermMonth:    creditTariff.MinTermMonth,
			MaxTermMonth:    creditTariff.MaxTermMonth,
			Description:     creditTariff.Description,
		})
	}

	return tariffs, nil
}
