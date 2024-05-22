package app

import (
	"context"
	auth "gateway/internal"
	"gateway/internal/api/graph"
	"gateway/internal/api/graph/model"
	"gateway/internal/config"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/go-chi/chi"
	"github.com/go-chi/cors"
)

type App struct {
	port int
	mux  *chi.Mux
}

func NewApp(cfg *config.Config) *App {
	resolver := graph.NewResolver()
	srv := handler.NewDefaultServer(graph.NewExecutableSchema(graph.Config{Resolvers: resolver}))

	mux := chi.NewMux()

	// Настройка CORS
	cors := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"POST", "GET", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Content-Type", "Authorization"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	})

	// Применяем CORS middleware ко всем обработчикам
	mux.Use(cors.Handler)
	mux.Use(NewAuthMiddleware())
	mux.Handle("/", srv)

	log.Printf("Connect to http://localhost:%s/ for GraphQL playground", strconv.Itoa(cfg.Port))

	return &App{
		port: cfg.Port,
		mux:  mux,
	}
}

func (a *App) RunApp(ctx context.Context) error {
	return http.ListenAndServe(":"+strconv.Itoa(a.port), a.mux)
}

func NewAuthMiddleware() func(http.Handler) http.Handler {
	return func(h http.Handler) http.Handler {
		fn := func(w http.ResponseWriter, r *http.Request) {
			jwt := r.Header.Get("Authorization")
			if jwt == "" {
				h.ServeHTTP(w, r)
				return
			}
			tokenString := strings.Split(jwt, "Bearer ")[1]
			if tokenString == "" {
				http.Error(w, "Bearer token not found in Authorization header", http.StatusUnauthorized)
				return
			}

			claims, err := auth.ParseJWTToken(tokenString)
			if err != nil {
				http.Error(w, err.Error(), http.StatusUnauthorized)
				return
			}

			userId, _ := claims["userID"].(float64)
			userEmail, _ := claims["email"].(string)
			expired := claims["exp"].(float64)
			roleStr := claims["role"].(string)
			role := model.UserRole(roleStr)

			expiredTime := time.Unix(int64(expired), 0)

			// Заполнение структуры auth.AuthData
			access := auth.AuthData{
				UserId:    int(userId),
				UserEmail: userEmail,
				Expired:   expiredTime,
				Role:      role,
			}

			r = r.WithContext(context.WithValue(r.Context(), "auth", &access))
			h.ServeHTTP(w, r)
		}

		return http.HandlerFunc(fn)
	}
}
