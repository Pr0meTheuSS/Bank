package adminsqlrepository

import (
	"fmt"
	"log"

	"gorm.io/gorm"
)

type AdminSqlRepository interface {
	Query(query string) ([]string, error)
}

type adminSqlRepositoryImpl struct {
	db *gorm.DB
}

func NewAdminSqlRepository(db *gorm.DB) AdminSqlRepository {
	return &adminSqlRepositoryImpl{db: db}
}

func (r *adminSqlRepositoryImpl) Query(query string) ([]string, error) {
	log.Println("Admin Query repository invoked")
	rows, err := r.db.Raw(query).Rows()
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	columns, err := rows.Columns()
	if err != nil {
		return nil, err
	}

	var results []string
	for rows.Next() {
		columnsPointers := make([]interface{}, len(columns))
		columnsValues := make([]interface{}, len(columns))
		for i := range columnsPointers {
			columnsPointers[i] = &columnsValues[i]
		}
		if err := rows.Scan(columnsPointers...); err != nil {
			return nil, err
		}
		rowData := make(map[string]interface{})
		for i, colName := range columns {
			rowData[colName] = columnsValues[i]
		}
		results = append(results, fmt.Sprintf("%v", rowData))
	}
	log.Println(results)
	return results, nil
}
