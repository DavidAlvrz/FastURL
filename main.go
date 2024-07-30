package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"fastURL/handlers"
	"fastURL/model"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
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

	// Load environment variables
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file: %v\n", err)
	}

	// DB setup
	model.InitDB()
	defer model.CloseDB()

	// Endpoints setup
	r := mux.NewRouter()
	handlers.RegisterHandlers(r)

	// Server setup
	certfile := os.Getenv("CERTFILE")
	keyfile := os.Getenv("KEYFILE")

	// Start on HTTPS if certfile and keyfile are provided
	if certfile != "" && keyfile != "" {
		log.Println("Starting https server on :8088")
		err := http.ListenAndServeTLS(":8088", certfile, keyfile, nil)
		if err != nil {
			log.Fatalf("Error starting https server:", err)
		}

	} else {

		fmt.Println("Starting http server on :8088")
		if err := http.ListenAndServe(":8088", withCORS(r)); err != nil {
			log.Fatalf("Error starting http server:", err)
		}
	}

}
