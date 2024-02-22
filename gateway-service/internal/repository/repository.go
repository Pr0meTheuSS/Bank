package repository

import (
	"context"
	"gateway/internal/model"
)

type UserRepository interface {
	Create(ctx context.Context, userUUID string, info *model.UserInfo) error
	Get(ctx context.Context, uuid string) (*model.User, error)
}
