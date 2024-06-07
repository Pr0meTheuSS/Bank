package adminsqlservice

import (
	adminsqlrepository "gateway/internal/repositories/admin_sql_repository"
	"log"
)

type AdminSqlService interface {
	Query(query string) ([]*string, error)
}

type adminSqlServiceImpl struct {
	adminSqlRepopsitory adminsqlrepository.AdminSqlRepository
}

func NewAdminSqlService(repo adminsqlrepository.AdminSqlRepository) AdminSqlService {
	return adminSqlServiceImpl{adminSqlRepopsitory: repo}
}

func (s adminSqlServiceImpl) Query(query string) ([]*string, error) {
	log.Println("Admin Query service invoked")
	answers, err := s.adminSqlRepopsitory.Query(query)
	if err != nil {
		return nil, err
	}
	ret := make([]*string, 0, len(answers))
	for _, answer := range answers {
		ret = append(ret, &answer)
	}
	return ret, nil
}
