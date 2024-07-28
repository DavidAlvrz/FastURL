package model

import (
	"database/sql"
	"log"
	"os"

	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
)

var DB *sql.DB

func InitDB() {

	// Load environment variables
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file: %v\n", err)
	}
	connectionString := os.Getenv("DB_CONNECTION_STRING")

	// Connect to the database
	DB, err = sql.Open("mysql", connectionString)
	if err != nil {
		log.Fatalf("Error opening database: %v\n", err)
	} else {
		log.Println("Database connected")
	}

	// Initialize schema if needed
	createTable := `
    CREATE TABLE IF NOT EXISTS urls (
        id TEXT NOT NULL,
        url TEXT NOT NULL,
        PRIMARY KEY (id(255))
    );`

	_, err = DB.Exec(createTable)
	if err != nil {
		log.Fatalf("Error creating table: %v\n", err)
	}
}

func CloseDB() {
	DB.Close()
}
