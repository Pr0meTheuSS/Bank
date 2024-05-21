package models

// Tariff представляет модель тарифа по кредиту
type Tariff struct {
	ID   uint
	Name string // Название тарифа

	MinAmount float64 // Минимальная сумма кредита
	MaxAmount float64 // Максимальная сумма кредита

	MinDurationInMonth int // Минимальный срок кредита (в месяцах)
	MaxDurationInMonth int // Максимальный срок кредита (в месяцах)

	MinInterestRate float64
	MaxInterestRate float64
}
