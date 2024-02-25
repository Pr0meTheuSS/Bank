package app

import (
	"context"
	"gateway/internal/api/graph"
	"gateway/internal/config"
	"log"
	"net/http"
	"strconv"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
)

type App struct {
	port int
}

func NewApp(cfg *config.Config) *App {
	srv := handler.NewDefaultServer(graph.NewExecutableSchema(graph.Config{Resolvers: &graph.Resolver{}}))

	http.Handle("/", playground.Handler("GraphQL playground", "/query"))
	http.Handle("/query", srv)

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", strconv.Itoa(cfg.Port))

	return &App{
		port: cfg.Port,
	}
}

func (a *App) RunApp(ctx context.Context) error {
	return http.ListenAndServe(":"+strconv.Itoa(a.port), nil)
}
