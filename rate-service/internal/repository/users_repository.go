package repository

import (
	"context"
	"errors"
	"gateway/internal/users"
	"time"
)

var ErrUserAlreadyExists = errors.New("this user already exists")

type UserRepository interface {
	Create(ctx context.Context, info *users.User) (*users.User, error)
	GetById(ctx context.Context, ID int) (*users.User, error)
	GetAll(ctx context.Context) ([]*users.User, error)
}

type UserDAO struct {
	ID int

	FirstName  string
	SecondName string
	LastName   string

	Email        string
	PassportData string
	BirthDate    time.Time

	CreatedAt time.Time
	UpdatedAt time.Time
}

type UserRepositoryImpl struct {
	Users map[int]*UserDAO
}

var id = 0

func (r *UserRepositoryImpl) Create(ctx context.Context, info *users.User) (*users.User, error) {
	if _, exists := r.Find(ctx, info); !exists {
		id++
		r.Users[id] = &UserDAO{
			ID:           id,
			FirstName:    info.Info.FirstName,
			SecondName:   info.Info.SecondName,
			LastName:     info.Info.LastName,
			Email:        info.Info.Email,
			PassportData: info.Info.PassportData,
			BirthDate:    info.Info.BirthDate,
			CreatedAt:    info.CreatedAt,
			UpdatedAt:    info.UpdatedAt,
		}

		return mapUserDAOToUser(r.Users[id]), nil
	} else {
		return nil, ErrUserAlreadyExists
	}
}

func mapUserDAOToUser(udao *UserDAO) *users.User {
	return &users.User{
		ID: udao.ID,
		Info: users.UserInfo{
			FirstName:    udao.FirstName,
			LastName:     udao.LastName,
			SecondName:   udao.SecondName,
			Email:        udao.Email,
			PassportData: udao.PassportData,
			BirthDate:    udao.BirthDate,
		},
		CreatedAt: udao.CreatedAt,
		UpdatedAt: udao.UpdatedAt,
	}
}

func (r *UserRepositoryImpl) GetById(ctx context.Context, ID int) (*users.User, error) {
	return nil, nil
}

func (r *UserRepositoryImpl) GetAll(ctx context.Context) ([]*users.User, error) {
	return []*users.User{}, nil
}

func (r *UserRepositoryImpl) Find(ctx context.Context, info *users.User) (*UserDAO, bool) {
	for _, u := range r.Users {
		if u.ID == info.ID {
			return u, true
		}
	}

	return nil, false
}

func NewUserRepository() UserRepository {
	return &UserRepositoryImpl{
		Users: map[int]*UserDAO{},
	}
}
