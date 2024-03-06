package main

import (
	"context"
	"fmt"
	"gateway/internal/app"
	"gateway/internal/config"
	"log"

	"github.com/caarlos0/env"
	"github.com/joho/godotenv"
)

func main() {
	// Loading the environment variables from '.env' file.
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("unable to load .env file: %e", err)
	}

	cfg := config.Config{} // 👈 new instance of `Config`

	err = env.Parse(&cfg) // 👈 Parse environment variables into `Config`
	if err != nil {
		log.Fatalf("unable to parse ennvironment variables: %e", err)
	}

	fmt.Println("Config:")
	fmt.Printf("Version: %s\n", cfg.Version)
	app := app.NewApp(&cfg)

	app.RunApp(context.Background())
}
