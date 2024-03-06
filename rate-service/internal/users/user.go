package users

import (
	"time"
)

type Role int

const (
	ADMIN    = iota
	EMPLOYEE = iota
	CLIENT   = iota
)

type User struct {
	ID   int
	Info UserInfo

	UserRole  Role
	CreatedAt time.Time
	UpdatedAt time.Time
}

type UserInfo struct {
	FirstName  string
	LastName   string
	SecondName string

	Email        string
	PassportData string
	BirthDate    time.Time
}
