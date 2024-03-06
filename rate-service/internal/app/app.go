package app

import (
	"context"
	"gateway/internal/api/graph"
	"gateway/internal/config"
	"gateway/internal/repository"
	"gateway/internal/service"
	"log"
	"net/http"
	"strconv"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
)

type App struct {
	port int
	mux  *http.ServeMux
}

func NewApp(cfg *config.Config) *App {
	resolver := graph.NewResolver(service.NewUserService(repository.NewUserRepository()))
	srv := handler.NewDefaultServer(graph.NewExecutableSchema(graph.Config{Resolvers: resolver}))

	mux := http.NewServeMux()
	mux.Handle("/", playground.Handler("GraphQL playground", "/query"))

	// Пример добавления мидлвэра только для конкретного пути
	mux.HandleFunc("/query-with-auth", AuthMiddleware(srv.ServeHTTP))
	mux.HandleFunc("/query", srv.ServeHTTP) // Для других запросов используем сервер без мидлвэра

	log.Printf("Connect to http://localhost:%s/ for GraphQL playground", strconv.Itoa(cfg.Port))

	return &App{
		port: cfg.Port,
		mux:  mux,
	}
}

func (a *App) RunApp(ctx context.Context) error {
	return http.ListenAndServe(":"+strconv.Itoa(a.port), a.mux)
}

// AuthMiddleware - мидлвэр для проверки авторизации
func AuthMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Здесь может быть код для проверки авторизации
		// Например, проверка наличия токена в заголовках запроса или другие механизмы

		// Если авторизация прошла успешно, передаем управление следующему обработчику
		next.ServeHTTP(w, r)
	}
}
