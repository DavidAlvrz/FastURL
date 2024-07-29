package model

import (
	"database/sql"
	"log"
)

func InsertURL(id string, url string) bool {

	query := `INSERT INTO urls (id, url) VALUES (?, ?)`
	_, err := DB.Exec(query, id, url)
	if err != nil {
		log.Printf("Error inserting URL: %v\n", err)
		CloseDB()
		return false
	}

	return true
}

func GetURL(id string) (string, error) {

	var url string
	query := `SELECT url FROM urls WHERE id = ?`
	err := DB.QueryRow(query, id).Scan(&url)

	if err != nil {
		if err == sql.ErrNoRows {
			log.Printf("No URL found for id: %s\n", id)
			return "", nil
		}
		log.Printf("Error retrieving URL: %v\n", err)
		return "", err
	}
	return url, nil
}
