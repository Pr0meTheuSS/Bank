package service

import (
	"context"
	"gateway/internal/model"
)

type UserService interface {
	Create(ctx context.Context, info *model.UserInfo) (string, error)
	Get(ctx context.Context, uuid string) (*model.User, error)
}
