package auth

import (
	"errors"
	"fmt"
	"gateway/internal/api/graph/model"
	"log"
	"time"

	"github.com/dgrijalva/jwt-go"
)

var (
	secretKey = []byte("your_secret_key")
)

type AuthData struct {
	UserId    int
	UserEmail string
	Expired   time.Time
	Role      model.UserRole
}

func GenerateJWT(userID int, email string, role model.UserRole) (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)

	claims := token.Claims.(jwt.MapClaims)
	claims["userID"] = userID
	claims["email"] = email
	claims["role"] = role.String()
	claims["exp"] = time.Now().Add(time.Hour * 24).Unix()

	// Подпись токена с использованием секретного ключа
	tokenString, err := token.SignedString(secretKey)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

// VerifyJWT проверяет переданный JWT токен и возвращает данные из него, если токен действителен.
func VerifyJWT(tokenString string) (jwt.MapClaims, error) {
	// Парсинг токена
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return secretKey, nil
	})
	log.Println(err)
	if err != nil {
		return nil, err
	}

	// Проверка токена
	if !token.Valid {
		return nil, fmt.Errorf("invalid token")
	}

	// Извлечение данных из токена
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return nil, fmt.Errorf("invalid token claims")
	}

	// Порверка срока действия токена
	expiryTime := time.Unix(int64(claims["exp"].(float64)), 0)
	if time.Now().After(expiryTime) {
		return nil, errors.New("token has expired")
	}

	return claims, nil
}

// Ваша функция для распарсивания JWT токена
func ParseJWTToken(tokenString string) (jwt.MapClaims, error) {
	// Парсинг JWT токена
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Предполагается, что ваш ключ подписи находится в переменной []byte
		return secretKey, nil
	})

	// Обработка ошибки парсинга токена
	if err != nil {
		return nil, err
	}

	// Проверка валидности токена
	if !token.Valid {
		return nil, errors.New("token is not valid")
	}

	// Получение клеймов из токена
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return nil, errors.New("invalid claims")
	}

	return claims, nil
}
