// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package model

import (
	"fmt"
	"io"
	"strconv"
	"time"
)

type CreateCreditRequest struct {
	UserID         int         `json:"userID"`
	ApplicationID  int         `json:"applicationID"`
	Body           int         `json:"body"`
	Percents       int         `json:"percents"`
	Fine           int         `json:"fine"`
	Commission     int         `json:"commission"`
	IsActive       bool        `json:"isActive"`
	PaymentType    PaymentType `json:"paymentType"`
	InterestRate   float64     `json:"interestRate"`
	LoanTermMonths int         `json:"loanTermMonths"`
	StartDate      time.Time   `json:"startDate"`
	EndDate        time.Time   `json:"endDate"`
}

type CreateCreditResponse struct {
	Success bool    `json:"success"`
	Credit  *Credit `json:"credit,omitempty"`
}

type CreateCreditTariffResponse struct {
	Status int `json:"status"`
}

type CreateUserInput struct {
	FirstName    string     `json:"first_name"`
	SecondName   string     `json:"second_name"`
	LastName     string     `json:"last_name"`
	Email        string     `json:"email"`
	Password     string     `json:"password"`
	PassportData string     `json:"passport_data"`
	BirthDate    string     `json:"birth_date"`
	Gender       Gender     `json:"gender"`
	Role         UserRole   `json:"role"`
	Status       UserStatus `json:"status"`
}

type CreateUserResponse struct {
	Status int `json:"status"`
}

type Credit struct {
	ID             int         `json:"id"`
	UserID         int         `json:"userID"`
	ApplicationID  int         `json:"applicationID"`
	Body           int         `json:"body"`
	Percents       int         `json:"percents"`
	Fine           int         `json:"fine"`
	Commission     int         `json:"commission"`
	IsActive       bool        `json:"isActive"`
	PaymentType    PaymentType `json:"paymentType"`
	InterestRate   float64     `json:"interestRate"`
	LoanTermMonths int         `json:"loanTermMonths"`
	StartDate      time.Time   `json:"startDate"`
	EndDate        time.Time   `json:"endDate"`
}

type CreditTariff struct {
	ID              int         `json:"id"`
	Name            string      `json:"name"`
	MinAmount       float64     `json:"minAmount"`
	MaxAmount       float64     `json:"maxAmount"`
	MinInterestRate float64     `json:"minInterestRate"`
	MaxInterestRate float64     `json:"maxInterestRate"`
	PaymentType     PaymentType `json:"paymentType"`
	MinTermMonth    int         `json:"minTermMonth"`
	MaxTermMonth    int         `json:"maxTermMonth"`
	Description     *string     `json:"description,omitempty"`
}

type CreditTariffInput struct {
	Name            string      `json:"name"`
	MinAmount       float64     `json:"minAmount"`
	MaxAmount       float64     `json:"maxAmount"`
	MinInterestRate float64     `json:"minInterestRate"`
	MaxInterestRate float64     `json:"maxInterestRate"`
	PaymentType     PaymentType `json:"paymentType"`
	MinTermMonth    int         `json:"minTermMonth"`
	MaxTermMonth    int         `json:"maxTermMonth"`
	Description     *string     `json:"description,omitempty"`
}

type DeleteCreditResponse struct {
	Success bool `json:"success"`
}

type DeleteCreditTariffResponse struct {
	Status int `json:"status"`
}

// ==========================================
type DeleteUserResponse struct {
	Status int `json:"status"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// ==================================================
type LoginResponse struct {
	User  *User  `json:"user"`
	Token string `json:"token"`
}

type Mutation struct {
}

type Query struct {
}

type RegistrationRequest struct {
	UserDetails *RegistrationUserInput `json:"user_details"`
	Password    string                 `json:"password"`
}

// ==================================================
type RegistrationResponse struct {
	Status int `json:"status"`
}

type RegistrationUserInput struct {
	FirstName    string   `json:"first_name"`
	SecondName   string   `json:"second_name"`
	LastName     string   `json:"last_name"`
	Email        string   `json:"email"`
	Password     string   `json:"password"`
	PassportData string   `json:"passport_data"`
	BirthDate    string   `json:"birth_date"`
	Gender       Gender   `json:"gender"`
	Role         UserRole `json:"role"`
}

type UpdateCreditRequest struct {
	ID             int          `json:"id"`
	UserID         *int         `json:"userID,omitempty"`
	ApplicationID  *int         `json:"applicationID,omitempty"`
	Body           *int         `json:"body,omitempty"`
	Percents       *int         `json:"percents,omitempty"`
	Fine           *int         `json:"fine,omitempty"`
	Commission     *int         `json:"commission,omitempty"`
	IsActive       *bool        `json:"isActive,omitempty"`
	PaymentType    *PaymentType `json:"paymentType,omitempty"`
	InterestRate   *float64     `json:"interestRate,omitempty"`
	LoanTermMonths *int         `json:"loanTermMonths,omitempty"`
	StartDate      *time.Time   `json:"startDate,omitempty"`
	EndDate        *time.Time   `json:"endDate,omitempty"`
}

type UpdateCreditResponse struct {
	Success bool    `json:"success"`
	Credit  *Credit `json:"credit,omitempty"`
}

type UpdateCreditTariffResponse struct {
	Status int `json:"status"`
}

type UpdateUserRequest struct {
	ID           int        `json:"ID"`
	FirstName    string     `json:"first_name"`
	SecondName   string     `json:"second_name"`
	LastName     string     `json:"last_name"`
	Email        string     `json:"email"`
	Password     string     `json:"password"`
	PassportData string     `json:"passport_data"`
	BirthDate    string     `json:"birth_date"`
	Gender       Gender     `json:"gender"`
	IsBlocked    bool       `json:"is_blocked"`
	Role         UserRole   `json:"role"`
	Status       UserStatus `json:"status"`
}

type UpdateUserResponse struct {
	Status int `json:"status"`
}

// User types and enums
// ==================================================
type User struct {
	ID           int        `json:"ID"`
	FirstName    string     `json:"first_name"`
	SecondName   string     `json:"second_name"`
	LastName     string     `json:"last_name"`
	Email        string     `json:"email"`
	Password     string     `json:"password"`
	PassportData string     `json:"passport_data"`
	BirthDate    string     `json:"birth_date"`
	Gender       Gender     `json:"gender"`
	Role         UserRole   `json:"role"`
	Status       UserStatus `json:"status"`
	IsBlocked    bool       `json:"is_blocked"`
}

type Gender string

const (
	GenderMale   Gender = "MALE"
	GenderFemale Gender = "FEMALE"
)

var AllGender = []Gender{
	GenderMale,
	GenderFemale,
}

func (e Gender) IsValid() bool {
	switch e {
	case GenderMale, GenderFemale:
		return true
	}
	return false
}

func (e Gender) String() string {
	return string(e)
}

func (e *Gender) UnmarshalGQL(v interface{}) error {
	str, ok := v.(string)
	if !ok {
		return fmt.Errorf("enums must be strings")
	}

	*e = Gender(str)
	if !e.IsValid() {
		return fmt.Errorf("%s is not a valid Gender", str)
	}
	return nil
}

func (e Gender) MarshalGQL(w io.Writer) {
	fmt.Fprint(w, strconv.Quote(e.String()))
}

type PaymentType string

const (
	PaymentTypeAnnuity        PaymentType = "Annuity"
	PaymentTypeDifferentiated PaymentType = "DIFFERENTIATED"
)

var AllPaymentType = []PaymentType{
	PaymentTypeAnnuity,
	PaymentTypeDifferentiated,
}

func (e PaymentType) IsValid() bool {
	switch e {
	case PaymentTypeAnnuity, PaymentTypeDifferentiated:
		return true
	}
	return false
}

func (e PaymentType) String() string {
	return string(e)
}

func (e *PaymentType) UnmarshalGQL(v interface{}) error {
	str, ok := v.(string)
	if !ok {
		return fmt.Errorf("enums must be strings")
	}

	*e = PaymentType(str)
	if !e.IsValid() {
		return fmt.Errorf("%s is not a valid PaymentType", str)
	}
	return nil
}

func (e PaymentType) MarshalGQL(w io.Writer) {
	fmt.Fprint(w, strconv.Quote(e.String()))
}

type UserRole string

const (
	UserRoleAdmin    UserRole = "ADMIN"
	UserRoleEmployee UserRole = "EMPLOYEE"
	UserRoleClient   UserRole = "CLIENT"
)

var AllUserRole = []UserRole{
	UserRoleAdmin,
	UserRoleEmployee,
	UserRoleClient,
}

func (e UserRole) IsValid() bool {
	switch e {
	case UserRoleAdmin, UserRoleEmployee, UserRoleClient:
		return true
	}
	return false
}

func (e UserRole) String() string {
	return string(e)
}

func (e *UserRole) UnmarshalGQL(v interface{}) error {
	str, ok := v.(string)
	if !ok {
		return fmt.Errorf("enums must be strings")
	}

	*e = UserRole(str)
	if !e.IsValid() {
		return fmt.Errorf("%s is not a valid UserRole", str)
	}
	return nil
}

func (e UserRole) MarshalGQL(w io.Writer) {
	fmt.Fprint(w, strconv.Quote(e.String()))
}

type UserStatus string

const (
	UserStatusPending  UserStatus = "PENDING"
	UserStatusVerified UserStatus = "VERIFIED"
	UserStatusDenied   UserStatus = "DENIED"
)

var AllUserStatus = []UserStatus{
	UserStatusPending,
	UserStatusVerified,
	UserStatusDenied,
}

func (e UserStatus) IsValid() bool {
	switch e {
	case UserStatusPending, UserStatusVerified, UserStatusDenied:
		return true
	}
	return false
}

func (e UserStatus) String() string {
	return string(e)
}

func (e *UserStatus) UnmarshalGQL(v interface{}) error {
	str, ok := v.(string)
	if !ok {
		return fmt.Errorf("enums must be strings")
	}

	*e = UserStatus(str)
	if !e.IsValid() {
		return fmt.Errorf("%s is not a valid UserStatus", str)
	}
	return nil
}

func (e UserStatus) MarshalGQL(w io.Writer) {
	fmt.Fprint(w, strconv.Quote(e.String()))
}
