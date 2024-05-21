package graph

import (
	"gateway/internal/api/graph/model"
	"gateway/internal/models"
)

func MapUsersToDTO(users []*models.User) []*model.User {
	var graphqlUsers []*model.User
	for _, user := range users {
		graphqlUser := MapUserToDTO(user)
		graphqlUsers = append(graphqlUsers, graphqlUser)
	}
	return graphqlUsers
}
func MapUserToDTO(user *models.User) *model.User {
	return &model.User{
		ID:           int(user.ID),
		FirstName:    user.FirstName,
		SecondName:   user.SecondName,
		LastName:     user.LastName,
		Email:        user.Email,
		Password:     user.Password,
		PassportData: user.PassportData,
		BirthDate:    user.BirthDate,
		Gender:       model.Gender(user.Gender),
		Role:         model.UserRole(user.Role),
		Status:       model.UserStatus(user.Status),
		IsBlocked:    user.Isblocked,
	}
}
func MapUpdateUserRequestToUser(updateReq model.UpdateUserRequest) models.User {
	return models.User{
		ID:           uint32(updateReq.ID),
		FirstName:    updateReq.FirstName,
		SecondName:   updateReq.SecondName,
		LastName:     updateReq.LastName,
		Email:        updateReq.Email,
		Password:     updateReq.Password,
		PassportData: updateReq.PassportData,
		BirthDate:    updateReq.BirthDate,
		Gender:       models.Gender(updateReq.Gender),
		Isblocked:    updateReq.IsBlocked,
		Role:         MapUserRoleToModel(updateReq.Role),
		Status:       MapUserStatusToModel(updateReq.Status),
	}
}
func MapUserRoleToModel(role model.UserRole) models.UserRole {
	if role == model.UserRoleAdmin {
		return models.UserRoleAdmin
	} else if role == model.UserRoleClient {
		return models.UserRoleClient
	} else if role == model.UserRoleEmployee {
		return models.UserRoleEmployee
	}

	return models.UserRoleClient
}
func MapUserStatusToModel(status model.UserStatus) models.UserStatus {
	if status == model.UserStatusPending {
		return models.PendingUserStatus
	} else if status == model.UserStatusVerified {
		return models.VerifiedUserStatus
	}

	return models.PendingUserStatus
}

func MapCreditsToDTO(credits []*models.Credit) []*model.Credit {
	creditsDTO := make([]*model.Credit, 0, len(credits))
	for _, credit := range credits {
		creditDTO := &model.Credit{
			ID:             int(credit.ID),
			UserID:         int(credit.UserID),
			ApplicationID:  int(credit.ApplicationID),
			Body:           int(credit.Body),
			Percents:       int(credit.Percents),
			Fine:           int(credit.Fine),
			Commission:     int(credit.Commission),
			IsActive:       credit.IsActive,
			PaymentType:    model.PaymentType(credit.PaymentType),
			InterestRate:   credit.InterestRate,
			LoanTermMonths: int(credit.LoanTermMonths),
			StartDate:      credit.StartDate,
			EndDate:        credit.EndDate,
		}
		creditsDTO = append(creditsDTO, creditDTO)
	}

	return creditsDTO
}
