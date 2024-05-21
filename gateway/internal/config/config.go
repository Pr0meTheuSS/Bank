package config

type Config struct {
	// Environment string `env:"ENVIRONMENT,required"`
	Version string `env:"VERSION,required"`
	Port    int    `env:"PORT,required"`
}
