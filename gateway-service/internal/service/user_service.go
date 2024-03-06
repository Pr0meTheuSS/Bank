package service

import (
	"context"
	"gateway/internal/repository"
	"gateway/internal/users"
	"time"

	"github.com/sirupsen/logrus"
)

type UserService interface {
	Create(ctx context.Context, user *users.UserInfo) (*users.User, error)
	GetAll(ctx context.Context) ([]*users.User, error)
	Delete(ctx context.Context, ID int) (bool, error)
}

type UserServiceImpl struct {
	UserRepository repository.UserRepository
}

func NewUserService(userRepo repository.UserRepository) UserService {
	defer logrus.Info("Init new user service")
	return &UserServiceImpl{
		UserRepository: userRepo,
	}
}

func (s *UserServiceImpl) Create(ctx context.Context, userInfo *users.UserInfo) (*users.User, error) {
	defer logrus.Info("UnserService.Create(ctx, info) called")
	return s.UserRepository.Create(ctx, &users.User{
		Info:      *userInfo,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	})
}

func (us *UserServiceImpl) GetAll(ctx context.Context) ([]*users.User, error) {
	defer logrus.Info("UnserService.GetAll(ctx) called")
	return us.UserRepository.GetAll(ctx)
}

func (us *UserServiceImpl) Delete(ctx context.Context, ID int) (bool, error) {
	defer logrus.Info("UnserService.Delete(ctx, ID) called")

	return us.UserRepository.Delete(ctx, ID)
}
