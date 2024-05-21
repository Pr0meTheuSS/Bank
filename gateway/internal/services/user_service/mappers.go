package UserService

import (
	"gateway/internal/models"
)

func MapRegistrationRequestToUser(registrationRequest models.RegistrationRequest) models.User {
	user := models.User{
		ID:           0,
		FirstName:    registrationRequest.UserDetails.FirstName,
		SecondName:   registrationRequest.UserDetails.SecondName,
		LastName:     registrationRequest.UserDetails.LastName,
		Email:        registrationRequest.UserDetails.Email,
		Password:     registrationRequest.Password,
		PassportData: registrationRequest.UserDetails.PassportData,
		BirthDate:    registrationRequest.UserDetails.BirthDate,
		Gender:       models.Gender(registrationRequest.UserDetails.Gender),
		Isblocked:    false,
		Role:         models.UserRole(registrationRequest.UserDetails.Role),
		Status:       models.UserStatus(registrationRequest.UserDetails.Status),
	}

	return user
}
