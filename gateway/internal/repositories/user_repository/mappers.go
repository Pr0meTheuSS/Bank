package userrepository

import (
	"gateway/internal/models"
	"log"
	"time"

	"gorm.io/gorm"
)

func MapDBUserToUser(dbUser DBUser) models.User {
	return models.User{
		ID:           uint32(dbUser.ID),
		FirstName:    dbUser.FirstName,
		SecondName:   dbUser.SecondName,
		LastName:     dbUser.LastName,
		Email:        dbUser.Email,
		Password:     dbUser.Password,
		PassportData: dbUser.PassportData,
		BirthDate:    dbUser.BirthDate.Format("2006-01-02"), // Форматируем дату как строку
		Gender:       models.Gender(dbUser.Gender),          // Преобразуем строку в enum Gender
		Isblocked:    dbUser.IsBlocked,
		Role:         UserRoleFromDBUser(dbUser),          // Определяем роль пользователя
		Status:       UserStatusFromDBUser(dbUser.Status), // Преобразуем строку в enum UserStatus
	}
}

func UserStatusFromDBUser(userStatus StatusEnum) models.UserStatus {
	if userStatus == StatusPending {
		return models.PendingUserStatus
	} else if userStatus == StatusVerified {
		return models.VerifiedUserStatus
	}

	return models.PendingUserStatus
}

func UserRoleFromDBUser(dbUser DBUser) models.UserRole {
	if dbUser.IsAdmin {
		return models.UserRoleAdmin
	} else if dbUser.IsEmployee {
		return models.UserRoleEmployee
	} else if dbUser.IsClient {
		return models.UserRoleClient
	}
	return models.UserRoleClient
}

func MapDBUsersToModelUsers(dbUsers []*DBUser) []*models.User {
	var users []*models.User
	for _, dbUser := range dbUsers {
		user := MapDBUserToUser(*dbUser)
		users = append(users, &user)
	}
	return users
}

func MapUserToDBUser(user *models.User) DBUser {
	log.Println("Is user blocked:", user.Isblocked)
	ret := DBUser{
		Model:        gorm.Model{},
		ID:           int(user.ID),
		FirstName:    user.FirstName,
		SecondName:   user.SecondName,
		LastName:     user.LastName,
		Email:        user.Email,
		Password:     user.Password,
		BirthDate:    ParseDateString(user.BirthDate),
		Gender:       string(user.Gender),
		CreatedAt:    time.Time{},
		PassportData: user.PassportData,
		Status:       MapStatusToDBStatus(user.Status),
		IsBlocked:    user.Isblocked,
		IsAdmin:      user.Role == models.UserRoleAdmin,
		IsEmployee:   user.Role == models.UserRoleEmployee,
		IsClient:     user.Role == models.UserRoleClient,
	}
	log.Println(ret.IsBlocked)
	return ret
}

func MapStatusToDBStatus(status models.UserStatus) StatusEnum {
	if status == models.PendingUserStatus {
		return StatusPending
	} else if status == models.VerifiedUserStatus {
		return StatusVerified
	}

	return StatusPending
}

// Вспомогательная функция для парсинга строки с датой
func ParseDateString(dateString string) time.Time {
	t, _ := time.Parse("2006-01-02", dateString)
	return t
}
