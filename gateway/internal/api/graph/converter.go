package graph

import (
	"gateway/internal/api/graph/model"
	"gateway/internal/models"
)

func convertLoginRequestDTOtoLoginRequestModel(request model.LoginRequest) *models.LoginRequest {
	return &models.LoginRequest{
		Email:    request.Email,
		Password: request.Password,
	}
}

func convertRegRequestDTOtoRegRequestModel(request model.RegistrationRequest) *models.RegistrationRequest {
	return &models.RegistrationRequest{
		UserDetails: models.UserInput{
			FirstName:    request.UserDetails.FirstName,
			SecondName:   request.UserDetails.SecondName,
			LastName:     request.UserDetails.LastName,
			Email:        request.UserDetails.Email,
			PassportData: request.UserDetails.PassportData,
			BirthDate:    request.UserDetails.BirthDate,
			Gender:       models.Gender(request.UserDetails.Gender.String()),
			Role:         models.UserRole(request.UserDetails.Role),
		},
		Password: request.Password,
	}
}

func convertRegResponseModeltoRegResponseDTO(response *models.RegistrationResponse) *model.RegistrationResponse {
	return &model.RegistrationResponse{
		Status: int(response.Status),
	}
}

func convertLoginResponseModeltoLoginResponseDTO(response *models.LoginResponse) *model.LoginResponse {
	return &model.LoginResponse{
		User: &model.User{
			ID:           int(response.User.ID),
			FirstName:    response.User.FirstName,
			SecondName:   response.User.SecondName,
			LastName:     response.User.LastName,
			Email:        response.User.Email,
			Password:     response.User.Password,
			PassportData: response.User.PassportData,
			BirthDate:    response.User.BirthDate,
			Gender:       model.Gender(response.User.Gender),
			Role:         model.UserRole(response.User.Role),
			Status:       model.UserStatus(response.User.Status),
			IsBlocked:    response.User.Isblocked,
		},
		Token: response.Token,
	}
}
