package models

// Tariff представляет модель тарифа по кредиту
type Tariff struct {
	ID uint

	Name string

	MinAmount float64
	MaxAmount float64

	MinInterestRate float64
	MaxInterestRate float64

	PaymentType PaymentType

	MinTermMonth uint
	MaxTermMonth uint

	Description string
}
