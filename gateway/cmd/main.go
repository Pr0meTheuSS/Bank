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
		log.Fatalf("godotenv.Load(): %e", err)
	}

	cfg := config.Config{} // 👈 new instance of `Config`

	err = env.Parse(&cfg) // 👈 Parse environment variables into `Config`
	if err != nil {
		log.Fatalf("unable to parse ennvironment variables: %e", err)
	}

	fmt.Println("Config:")
	fmt.Printf("Listen TCP port: %d\nVersion: %s\n", cfg.Port, cfg.Version)

	app := app.NewApp(&cfg)

	log.Fatal(app.RunApp(context.Background()))
}
