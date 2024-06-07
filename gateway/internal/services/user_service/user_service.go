package UserService

import (
	"context"
	"errors"
	"fmt"
	auth "gateway/internal"
	"gateway/internal/api/graph/model"
	"gateway/internal/mail"
	"gateway/internal/models"
	userrepository "gateway/internal/repositories/user_repository"
	"log"
	"math/rand"
)

var _ UserService = (*UserServiceImpl)(nil)

type UserService interface {
	Register(ctx context.Context, request *models.RegistrationRequest) (*models.RegistrationResponse, error)
	Login(ctx context.Context, request *models.LoginRequest) (*models.LoginResponse, error)
	RecoveryPassword(ctx context.Context, email string) (*model.RecoveryPasswordResponse, error)

	Create(ctx context.Context, authData *auth.AuthData, user *models.User) (*models.User, error)
	Update(ctx context.Context, authData *auth.AuthData, userID int, user *models.User) (*models.User, error)
	Delete(ctx context.Context, authData *auth.AuthData, userID int) error

	GetUserByEmail(ctx context.Context, authData *auth.AuthData, email string) (*models.User, error)
	GetUsers(ctx context.Context, authData *auth.AuthData, limit int, offset int, filters *models.UserFilters) ([]*models.User, error)
}

type UserServiceImpl struct {
	userRepo userrepository.UserRepository
}

func NewUserService(userRepo userrepository.UserRepository) UserService {
	return &UserServiceImpl{
		userRepo: userRepo,
	}
}

const (
	welcomeEmailMessage                 = "Банк Надёжник приветствует Вас! Благодарим за регистрацию!"
	recoveryPasswordMessageFormatString = "Восстановление доступа к аккаунту в банке Надежник. Используйте пароль: %s"
)

const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[]{}|;:,.<>?/"

func GenerateRandomPassword() string {
	// Определяем длину пароля (от 10 до 16 символов)
	length := rand.Intn(7) + 10

	// Создаем слайс байтов для пароля
	password := make([]byte, length)

	// Заполняем слайс случайными символами из charset
	for i := range password {
		password[i] = charset[rand.Intn(len(charset))]
	}

	return string(password)
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
	go mail.SendConfirmMail(newUser.Email, welcomeEmailMessage)
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
	log.Println(user, err)

	if user.Password != request.Password {
		log.Println(user.Password, request.Password)

		return nil, errors.New("wrong email or password")
	}

	// if user.Isblocked {
	// 	return nil, errors.New("wrong email or password")
	// }

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

func (s *UserServiceImpl) RecoveryPassword(ctx context.Context, email string) (*model.RecoveryPasswordResponse, error) {
	user, err := s.userRepo.GetByEmail(email)
	if err != nil || user == nil {
		return &model.RecoveryPasswordResponse{
			Status: 400,
		}, err
	}

	user.Password = GenerateRandomPassword()
	if _, err = s.userRepo.Update(int(user.ID), user); err != nil {
		return &model.RecoveryPasswordResponse{
			Status: 400,
		}, err
	}

	go mail.SendConfirmMail(user.Email, fmt.Sprintf(recoveryPasswordMessageFormatString, user.Password))

	return &model.RecoveryPasswordResponse{
		Status: 200,
	}, nil
}

func (s *UserServiceImpl) GetUserByEmail(ctx context.Context, authData *auth.AuthData, email string) (*models.User, error) {
	log.Println("GetUserByEmail Service")

	asker, err := s.userRepo.GetByID(authData.UserId)
	if err != nil {
		return nil, errors.New("not authorized")
	}
	// Запрос самого себя допустим
	if asker.Email == email {
		return asker, nil
	}

	if asker.Role != models.UserRoleAdmin {
		return nil, errors.New("access denied")
	}
	if asker.Isblocked {
		return nil, errors.New("your account is blocked")
	}

	// Получаем пользователя из репозитория по электронной почте
	user, err := s.userRepo.GetByEmail(email)
	if err != nil {
		return nil, err
	}

	return user, nil
}

func (s *UserServiceImpl) Update(ctx context.Context, authData *auth.AuthData, userID int, user *models.User) (*models.User, error) {
	log.Println("Update UserService")
	asker, err := s.userRepo.GetByID(authData.UserId)
	if err != nil {
		return nil, errors.New("not authorized")
	}

	if asker.Role != models.UserRoleAdmin {
		return nil, errors.New("access denied")
	}
	if asker.Isblocked {
		return nil, errors.New("your account is blocked")
	}

	return s.userRepo.Update(int(userID), user)
}

func (s *UserServiceImpl) Create(ctx context.Context, authData *auth.AuthData, user *models.User) (*models.User, error) {
	log.Println("Create UserService")

	asker, err := s.userRepo.GetByID(authData.UserId)
	if err != nil {
		return nil, errors.New("not authorized")
	}

	if asker.Role != models.UserRoleAdmin {
		return nil, errors.New("access denied")
	}
	if asker.Isblocked {
		return nil, errors.New("your account is blocked")
	}

	return user, s.userRepo.Create(user)
}

func (s *UserServiceImpl) Delete(ctx context.Context, authData *auth.AuthData, userID int) error {
	log.Println("Delete UserService")
	asker, err := s.userRepo.GetByID(authData.UserId)
	if err != nil {
		return errors.New("not authorized")
	}

	if asker.Role != models.UserRoleAdmin {
		return errors.New("access denied")
	}
	if asker.Isblocked {
		return errors.New("your account is blocked")
	}

	return s.userRepo.Delete(userID)
}

func (s *UserServiceImpl) GetUsers(ctx context.Context, authData *auth.AuthData, limit int, offset int, filters *models.UserFilters) ([]*models.User, error) {
	log.Println("GetAllUsers Service")
	u, err := s.GetUserByEmail(ctx, authData, authData.UserEmail)
	if err != nil {
		return nil, errors.New("not authorized")
	}
	if u.Isblocked {
		return nil, errors.New("your account is blocked")
	}

	if u.Role == models.UserRoleClient {
		return []*models.User{u}, nil
	}

	// Получаем пользователей из репозитория с фильтрами
	users, err := s.userRepo.GetUsers(limit, offset, filters)
	if err != nil {
		return nil, err
	}

	return users, nil
}
