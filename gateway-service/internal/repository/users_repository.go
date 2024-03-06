package repository

import (
	"context"
	"errors"
	"gateway/internal/users"
	"time"
)

var (
	ErrUserAlreadyExists = errors.New("this user already exists")
	ErrUserNotFound      = errors.New("this user not found")
)

type UserRepository interface {
	Create(ctx context.Context, info *users.User) (*users.User, error)
	GetById(ctx context.Context, ID int) (*users.User, error)
	GetAll(ctx context.Context) ([]*users.User, error)
	Delete(ctx context.Context, ID int) (bool, error)
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
	if user, exists := r.Users[ID]; !exists {
		return nil, ErrUserAlreadyExists
	} else {
		return mapUserDAOToUser(user), nil
	}
}

func (r *UserRepositoryImpl) GetAll(ctx context.Context) ([]*users.User, error) {
	users := make([]*users.User, 0, len(r.Users))
	for _, v := range r.Users {
		users = append(users, mapUserDAOToUser(v))
	}

	return users, nil
}

func (r *UserRepositoryImpl) Find(ctx context.Context, info *users.User) (*UserDAO, bool) {
	for _, u := range r.Users {
		if u.ID == info.ID {
			return u, true
		}
	}

	return nil, false
}

func (r *UserRepositoryImpl) Delete(ctx context.Context, ID int) (bool, error) {
	if _, exists := r.Users[ID]; exists {
		delete(r.Users, ID)
		return true, nil
	}

	return false, ErrUserNotFound
}

func NewUserRepository() UserRepository {
	return &UserRepositoryImpl{
		Users: map[int]*UserDAO{},
	}
}
