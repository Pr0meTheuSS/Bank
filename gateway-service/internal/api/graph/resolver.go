package graph

import (
	"gateway/internal/service"
)

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct {
	UserServer service.UserService
}

func NewResolver(userService service.UserService) *Resolver {
	return &Resolver{
		UserServer: userService,
	}
}
