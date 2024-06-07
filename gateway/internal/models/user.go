package models

type User struct {
	ID           uint32 `json:"ID"`
	FirstName    string `json:"first_name"`
	SecondName   string `json:"second_name"`
	LastName     string `json:"last_name"`
	Email        string `json:"email"`
	Password     string `json:"password"`
	PassportData string `json:"passportData"`
	BirthDate    string `json:"birth_date"`
	Gender       Gender `json:"gender"`

	Isblocked bool       `json:"is_blocked"`
	Role      UserRole   `json:"role"`
	Status    UserStatus `json:"status"`
}

type Gender string

const (
	GenderMale   Gender = "MALE"
	GenderFemale Gender = "FEMALE"
)

type UserRole string
type UserStatus string

const (
	PendingUserStatus  UserStatus = "PENDING"
	VerifiedUserStatus UserStatus = "VERIFIED"
)

const (
	UserRoleAdmin    UserRole = "ADMIN"
	UserRoleEmployee UserRole = "EMPLOYEE"
	UserRoleClient   UserRole = "CLIENT"
)

type RegistrationRequest struct {
	UserDetails UserInput `json:"userDetails"`
	Password    string    `json:"password"`
}

type UserInput struct {
	FirstName    string     `json:"first_name"`
	SecondName   string     `json:"second_name"`
	LastName     string     `json:"last_name"`
	Email        string     `json:"email"`
	PassportData string     `json:"passportData"`
	BirthDate    string     `json:"birth_date"`
	Gender       Gender     `json:"gender"`
	Role         UserRole   `json:"role"`
	Status       UserStatus `json:"status"`
}

type RegistrationResponse struct {
	Status int `json:"status"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginResponse struct {
	User  User   `json:"user"`
	Token string `json:"token"`
}

type UserFilters struct {
	FirstName string
	LastName  string
	Email     string
	Gender    string
}
