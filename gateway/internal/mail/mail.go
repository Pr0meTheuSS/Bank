package mail

import (
	"crypto/tls"
	"fmt"
	"log"
	"net/smtp"
)

const (
	// Учетные данные для доступа к SMTP-серверу Gmail
	email    = "yr.olimpiev@gmail.com"
	password = "stkkftucujhicqxp"
	// Настройки SMTP-сервера Gmail
	smtpHost = "smtp.gmail.com"
	smtpPort = 587
)

func SendConfirmMail(recipientEmail string, text string) error {
	// Формирование аутентификационных данных
	auth := smtp.PlainAuth("", email, password, smtpHost)

	// Установка соединения с сервером SMTP
	client, err := smtp.Dial(fmt.Sprintf("%s:%d", smtpHost, smtpPort))
	if err != nil {
		log.Println("Ошибка при подключении к серверу SMTP:", err)
		return err
	}
	defer client.Close()

	// Инициируем шифрование TLS
	tlsConfig := &tls.Config{
		ServerName:         smtpHost,
		InsecureSkipVerify: false,
	}
	if err = client.StartTLS(tlsConfig); err != nil {
		log.Println("Ошибка при запуске TLS:", err)
		return err
	}

	// Устанавливаем аутентификацию
	if err = client.Auth(auth); err != nil {
		log.Println("Ошибка аутентификации:", err)
		return err
	}

	// Формирование сообщения
	msg := []byte("To:" + recipientEmail + "\r\n" +
		"Subject: Подтверждение регистрации\r\n" +
		"\r\n" +
		text)

	// Отправка письма через SMTP
	if err = client.Mail(email); err != nil {
		log.Println("Ошибка при указании адреса отправителя:", err)
		return err
	}
	if err = client.Rcpt(recipientEmail); err != nil {
		log.Println("Ошибка при указании адреса получателя:", err)
		return err
	}
	w, err := client.Data()
	if err != nil {
		log.Println("Ошибка при получении записи:", err)
		return err
	}
	_, err = w.Write(msg)
	if err != nil {
		log.Println("Ошибка при записи сообщения:", err)
		return err
	}
	err = w.Close()
	if err != nil {
		log.Println("Ошибка при закрытии записи:", err)
		return err
	}

	log.Println("Письмо успешно отправлено!")
	return nil
}
