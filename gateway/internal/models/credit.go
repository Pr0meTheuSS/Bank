package models

import "time"

type PaymentType string

const (
	Annuity        PaymentType = "ANNUITY" // Аннуитетный платеж
	Differentiated PaymentType = "DIFF"    // Дифференцированный платеж
)

type Credit struct {
	ID            uint64
	UserID        uint64
	ApplicationID uint64

	Body       uint64
	Percents   uint64
	Fine       uint64
	Commission uint64

	IsActive bool // Статус кредита

	PaymentType    PaymentType
	InterestRate   float64 // Процентная ставка
	LoanTermMonths uint    // Срок кредита в месяцах

	StartDate time.Time // Дата начала кредита
	EndDate   time.Time // Дата окончания кредита
}
