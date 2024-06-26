package graph

import (
	adminsqlrepository "gateway/internal/repositories/admin_sql_repository"
	creditrepository "gateway/internal/repositories/credit_repository"
	tariffrepository "gateway/internal/repositories/tariff_repository"
	transactionrepository "gateway/internal/repositories/transaction_repository"
	userrepository "gateway/internal/repositories/user_repository"
	adminsqlservice "gateway/internal/services/admin_sql_service"
	creditservice "gateway/internal/services/credit_service"
	tariffservice "gateway/internal/services/tariff_service"
	transactionservice "gateway/internal/services/transaction_service"
	userservice "gateway/internal/services/user_service"
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct {
	userService        userservice.UserService
	creditService      creditservice.CreditService
	tariffService      tariffservice.TariffService
	transactionservice transactionservice.TransactionService
	adminSqlService    adminsqlservice.AdminSqlService
}

var dsn = "postgresql://postgres:password@localhost:5454?sslmode=disable"

func NewResolver() *Resolver {
	db, err := gorm.Open(postgres.New(postgres.Config{
		DSN: dsn,
	}), &gorm.Config{})

	if err != nil {
		log.Fatal(err.Error())
	}

	log.Printf("db with dsn=%s running\n", dsn)

	return &Resolver{
		userService:        userservice.NewUserService(userrepository.NewUserRepository(db)),
		creditService:      creditservice.NewCreditService(creditrepository.NewCreditRepository(db)),
		tariffService:      tariffservice.NewTariffService(tariffrepository.NewCreditTariffRepository(db)),
		adminSqlService:    adminsqlservice.NewAdminSqlService(adminsqlrepository.NewAdminSqlRepository(db)),
		transactionservice: transactionservice.NewTransactionService(transactionrepository.NewTransactionRepository(db)),
	}
}
