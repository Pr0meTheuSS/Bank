package graph

import (
	"gateway/internal/api/graph/model"
	"gateway/internal/users"
)

func mapUserToDTOUser(user *users.User) *model.User {
	return &model.User{
		ID: string(user.ID),
		Fullname: &model.FullName{
			Name:       user.Info.FirstName,
			SecondName: user.Info.SecondName,
			LastName:   user.Info.LastName,
		},
		Email:        user.Info.Email,
		PassportData: user.Info.PassportData,
		BirthDate:    user.Info.BirthDate,
		Role:         mapUserRoleToDTORole(user.UserRole),
	}
}

func mapUserRoleToDTORole(userRole users.Role) model.Role {
	switch userRole {
	case users.ADMIN:
		return model.RoleAdmin
	case users.EMPLOYEE:
		return model.RoleEmployee
	case users.CLIENT:
		return model.RoleClient
	default:
		//TODO: replace to RoleUnknown
		return model.RoleClient
	}
}
