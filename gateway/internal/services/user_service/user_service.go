package UserService

import (
	"context"
	"errors"
	auth "gateway/internal"
	"gateway/internal/api/graph/model"
	"gateway/internal/models"
	userrepository "gateway/internal/repositories/user_repository"
	"log"
)

type UserService interface {
	Register(ctx context.Context, request *models.RegistrationRequest) (*models.RegistrationResponse, error)
	Login(ctx context.Context, request *models.LoginRequest) (*models.LoginResponse, error)

	Create(ctx context.Context, authData *auth.AuthData, user *models.User) (*models.User, error)
	Update(ctx context.Context, authData *auth.AuthData, userID int, user *models.User) (*models.User, error)
	Delete(ctx context.Context, authData *auth.AuthData, userID int) error

	GetUserByEmail(ctx context.Context, authData *auth.AuthData, email string) (*models.User, error)
	GetUsers(ctx context.Context, authData *auth.AuthData, limit int, offset int) ([]*models.User, error)
}

type UserServiceImpl struct {
	userRepo userrepository.UserRepository
}

func NewUserService(userRepo userrepository.UserRepository) UserService {
	return &UserServiceImpl{
		userRepo: userRepo,
	}
}

func (s *UserServiceImpl) Register(ctx context.Context,
	request *models.RegistrationRequest,
) (*models.RegistrationResponse, error) {
	log.Println("UserService: Register invoked")

	newUser := MapRegistrationRequestToUser(*request)
	err := s.userRepo.Create(&newUser)

	if err != nil {
		return &models.RegistrationResponse{Status: 401}, nil
	}
	return &models.RegistrationResponse{Status: 200}, nil
}

func (s *UserServiceImpl) Login(ctx context.Context,
	request *models.LoginRequest,
) (*models.LoginResponse, error) {
	log.Printf("UserServiceImpl: login invoked")

	user, err := s.userRepo.GetByEmail(request.Email)
	if err != nil {
		return nil, errors.New("wrong email or password")
	}

	if user.Password != request.Password {
		return nil, errors.New("wrong email or password")
	}

	if user.Isblocked {
		return nil, errors.New("wrong email or password")
	}

	jwt, err := auth.GenerateJWT(int(user.ID), user.Email, model.UserRole(user.Role))
	if err != nil {
		return nil, err
	}

	return &models.LoginResponse{
		User: models.User{
			ID:           uint32(user.ID),
			FirstName:    user.FirstName,
			SecondName:   user.SecondName,
			LastName:     user.LastName,
			Email:        user.Email,
			PassportData: user.PassportData,
			BirthDate:    user.BirthDate,
			Gender:       models.Gender(user.Gender),
			Role:         models.UserRole(user.Role),
		},
		Token: jwt,
	}, nil
}

func (s *UserServiceImpl) GetUserByEmail(ctx context.Context, authData *auth.AuthData, email string) (*models.User, error) {
	log.Println("GetUserByEmail Service")
	// Получаем пользователя из репозитория по электронной почте
	user, err := s.userRepo.GetByEmail(email)
	if err != nil {
		return nil, err
	}

	// Преобразуем модель базы данных в модель GraphQL
	graphqlUser := &models.User{
		ID:           uint32(user.ID),
		FirstName:    user.FirstName,
		SecondName:   user.SecondName,
		LastName:     user.LastName,
		Email:        user.Email,
		PassportData: user.PassportData,
		BirthDate:    user.BirthDate,
		Gender:       models.Gender(user.Gender),
		Role:         models.UserRole(user.Role),
	}

	return graphqlUser, nil
}

func (s *UserServiceImpl) Update(ctx context.Context, authData *auth.AuthData, userID int, user *models.User) (*models.User, error) {
	log.Println("Update UserService")
	return s.userRepo.Update(int(userID), user)
}

func (s *UserServiceImpl) Create(ctx context.Context, authData *auth.AuthData, user *models.User) (*models.User, error) {
	log.Println("Create UserService")
	return user, s.userRepo.Create(user)
}

func (s *UserServiceImpl) Delete(ctx context.Context, authData *auth.AuthData, userID int) error {
	log.Println("Delete UserService")
	return s.userRepo.Delete(userID)
}

func (s *UserServiceImpl) GetUsers(ctx context.Context, authData *auth.AuthData, limit int, offset int) ([]*models.User, error) {
	log.Println("GetAllUsers Service")
	// u, err := s.GetUserByEmail(ctx, authData, authData.UserEmail)
	// if err != nil {
	// 	return nil, errors.New("access denied")
	// }
	// if u.Role != models.UserRoleAdmin {
	// 	return nil, errors.New("access denied")
	// }

	// Получаем пользователей из репозитория с указанием ограничения и смещения
	users, err := s.userRepo.GetUsers(limit, offset)
	if err != nil {
		return nil, err
	}

	return users, nil
}
