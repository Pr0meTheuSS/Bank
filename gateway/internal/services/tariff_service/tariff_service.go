package tariffservice

import (
	"context"
	auth "gateway/internal"
	"gateway/internal/models"
)

type TariffService interface {
	Create(ctx context.Context, authData *auth.AuthData, tariff *models.Tariff) error
	Update(ctx context.Context, authData *auth.AuthData, tarrif *models.Tariff) error
	Delete(ctx context.Context, authData *auth.AuthData, ID int) error
	GetByID(ctx context.Context, ID int) (*models.Tariff, error)

	GetTarrifs(ctx context.Context, limit int, offset int) ([]*models.Tariff, error)
}
