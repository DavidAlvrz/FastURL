package handlers

import (
	"encoding/json"
	"fastURL/model"
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
)

func RegisterHandlers() {
	r := mux.NewRouter()
	r.HandleFunc("/", homeHandler)
	r.HandleFunc("/url/get", getUrl).Methods("GET")
	r.HandleFunc("/url/add", addURL).Methods("POST")
	r.HandleFunc("/get/{id}", redirectURL).Methods("GET")
	http.Handle("/", r)
}

func homeHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "Welcome to URL Shortener!")
}

func addURL(w http.ResponseWriter, r *http.Request) {
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

	fmt.Fprintln(w, "URL inserted successfully")
}

func getUrl(w http.ResponseWriter, r *http.Request) {
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

	// Check if the long URL has been found
	if err != nil {
		http.Error(w, "Error fetching url "+id, http.StatusNotFound)
		return
	}

	fmt.Fprintln(w, url)
}

func redirectURL(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	url, err := model.GetURL(id)
	if err != nil {
		http.Error(w, "URL not found", http.StatusNotFound)
		return
	}

	http.Redirect(w, r, url, http.StatusFound)
}