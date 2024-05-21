package userrepository

import (
	"gateway/internal/models"
	"log"

	"time"

	"gorm.io/gorm"
)

type UserRepository interface {
	Create(*models.User) error
	Update(id int, user *models.User) (*models.User, error)
	Delete(id int) error

	GetUsers(limit, offset int) ([]*models.User, error)
	GetByID(id int) (*models.User, error)
	GetByEmail(email string) (*models.User, error)
}

type userRepositoryImpl struct {
	db *gorm.DB
}

// StatusEnum представляет перечисление статусов пользователя.
type StatusEnum string

const (
	StatusPending  StatusEnum = "PENDING"
	StatusVerified StatusEnum = "VERIFIED"
)

type DBUser struct {
	gorm.Model
	ID int `gorm:"primaryKey"`

	FirstName  string
	SecondName string
	LastName   string

	Email        string `gorm:"unique"`
	Password     string
	BirthDate    time.Time
	Gender       string
	CreatedAt    time.Time
	PassportData string

	Status    StatusEnum
	IsBlocked bool

	IsAdmin    bool
	IsEmployee bool
	IsClient   bool
}

func Migrate(db *gorm.DB) error {
	err := db.AutoMigrate(&DBUser{})
	if err != nil {
		return err
	}
	return nil
}

func NewUserRepository(db *gorm.DB) UserRepository {
	if Migrate(db) != nil {
		return nil
	}

	log.Println("Migrate Users successfully")

	return &userRepositoryImpl{
		db: db,
	}
}

func (ur *userRepositoryImpl) Create(user *models.User) error {
	log.Println(user)
	u := MapUserToDBUser(user)
	return ur.db.Create(&u).Error
}

func (ur *userRepositoryImpl) Update(id int, user *models.User) (*models.User, error) {
	newUser := MapUserToDBUser(user)
	if err := ur.db.Model(&DBUser{}).Where("id = ?", id).Updates(newUser).Error; err != nil {
		return nil, err
	}
	return user, nil
}

func (ur *userRepositoryImpl) Delete(id int) error {
	if err := ur.db.Delete(&DBUser{}, id).Error; err != nil {
		return err
	}
	return nil
}

func (ur *userRepositoryImpl) GetByID(id int) (*models.User, error) {
	var user DBUser
	if err := ur.db.First(&user, id).Error; err != nil {
		return nil, err
	}
	ret := MapDBUserToUser(user)
	return &ret, nil
}

func (ur *userRepositoryImpl) GetByEmail(email string) (*models.User, error) {
	var user DBUser
	if err := ur.db.Where("email = ?", email).First(&user).Error; err != nil {
		return nil, err
	}
	ret := MapDBUserToUser(user)
	return &ret, nil
}

func (ur *userRepositoryImpl) GetUsers(limit int, offset int) ([]*models.User, error) {
	var users []*DBUser

	if limit == 0 {
		if err := ur.db.Offset(offset).Find(&users).Error; err != nil {
			return nil, err
		}

		return MapDBUsersToModelUsers(users), nil
	}

	if err := ur.db.Limit(limit).Offset(offset).Find(&users).Error; err != nil {
		return nil, err
	}

	return MapDBUsersToModelUsers(users), nil
}
