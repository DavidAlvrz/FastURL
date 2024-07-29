package main

import (
	"fmt"
	"net/http"

	"fastURL/handlers"
	"fastURL/model"

	"github.com/gorilla/mux"
)

func withCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*") // Permitir todos los orígenes (modificar según sea necesario)
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		// Manejar preflight requests
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func main() {
	// DB setup
	model.InitDB()
	defer model.CloseDB()

	// Endpoints setup
	r := mux.NewRouter()
	handlers.RegisterHandlers(r)

	// Server setup
	fmt.Println("Starting server on :8088")
	if err := http.ListenAndServe(":8088", withCORS(r)); err != nil {
		fmt.Println("Error starting server:", err)
	}
}
