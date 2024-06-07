package models

import "time"

type Payment struct {
	ID       int
	creditID int
	amount   int

	date time.Time
}
