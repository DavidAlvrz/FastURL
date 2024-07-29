package handlers

import (
	"encoding/json"
	"fastURL/model"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

func RegisterHandlers(r *mux.Router) {
	r.HandleFunc("/", homeHandler)
	r.HandleFunc("/url/get", getUrl).Methods("GET")
	r.HandleFunc("/url/add", addURL).Methods("POST")
	r.HandleFunc("/go/{id}", redirectURL).Methods("GET")
}

func homeHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "Welcome to URL Shortener!")
}

func addURL(w http.ResponseWriter, r *http.Request) {
	log.Println("Call received to insert an URL")

	// Check if the request method is POST
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	// Decode the JSON body
	var urlRequest URLRequestDTO
	if err := json.NewDecoder(r.Body).Decode(&urlRequest); err != nil {
		http.Error(w, "Error parsing JSON data", http.StatusBadRequest)
		return
	}

	// Check if the shortURL and longURL have been passed
	if urlRequest.Id == "" || urlRequest.Url == "" {
		http.Error(w, "id and url are required", http.StatusBadRequest)
		return
	}

	// Insert the URL into the database
	success := model.InsertURL(urlRequest.Id, urlRequest.Url)

	// Check if the URL has been inserted successfully
	if !success {
		http.Error(w, "Error inserting URL", http.StatusInternalServerError)
		return
	}

	fmt.Fprintln(w, "{\"error\": false, \"msg\": \"URL inserted successfully\"}")
}

func getUrl(w http.ResponseWriter, r *http.Request) {
	log.Println("Call received to retrieve an URL")

	// Check if the request method is GET
	if r.Method != http.MethodGet {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	var id = r.URL.Query().Get("id")

	// Check if the shortURL has been passed
	if id == "" {
		http.Error(w, "shortURL is required", http.StatusBadRequest)
		return
	}

	// Retrieve associated long URL
	var url, err = model.GetURL(id)

	// Check database error
	if err != nil {
		http.Error(w, "Error fetching url "+id, http.StatusInternalServerError)
		return
	}

	// Check if the URL has been found
	if url == "" {
		http.Error(w, "URL not found", http.StatusNoContent)
		return
	}

	// Return the URL
	w.Write([]byte(fmt.Sprintf("{\"url\": \"%s\"}", url)))

}

func redirectURL(w http.ResponseWriter, r *http.Request) {
	log.Println("Call received to reditect an URL")

	vars := mux.Vars(r)
	id := vars["id"]

	url, err := model.GetURL(id)
	if err != nil {
		http.Error(w, "URL not found", http.StatusNotFound)
		return
	}

	http.Redirect(w, r, url, http.StatusFound)
}
