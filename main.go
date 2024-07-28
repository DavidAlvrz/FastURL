package main

import (
	"fmt"
	"net/http"

	"fastURL/handlers"
	"fastURL/model"
)

func main() {
	// DB setup
	model.InitDB()
	defer model.CloseDB()

	// Endpoints setup
	handlers.RegisterHandlers()

	// Server setup
	fmt.Println("Starting server on :8088")
	if err := http.ListenAndServe(":8088", nil); err != nil {
		fmt.Println("Error starting server:", err)
	}
}
