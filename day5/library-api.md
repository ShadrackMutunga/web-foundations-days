# Library Books API Design

This document outlines the RESTful API endpoints for managing books in a library system.

## Endpoints

### 1. List all books
- **Method:** `GET`
- **Path:** `/books`
- **Description:** Retrieves a list of all books in the library catalog.
- **Success Status Code:** `200 OK`

### 2. Get a single book
- **Method:** `GET`
- **Path:** `/books/{id}`
- **Description:** Retrieves the details of a specific book by its unique ID.
- **Success Status Code:** `200 OK`

### 3. Create a new book
- **Method:** `POST`
- **Path:** `/books`
- **Description:** Adds a new book to the library catalog.
- **Example Request Body:** `{"title": "The Hobbit", "author": "J.R.R. Tolkien", "year": 1937}`
- **Success Status Code:** `201 Created`

### 4. Update a book
- **Method:** `PUT`
- **Path:** `/books/{id}`
- **Description:** Replaces all details of an existing book with the provided data.
- **Example Request Body:** `{"title": "The Hobbit", "author": "J.R.R. Tolkien", "year": 1937}`
- **Success Status Code:** `200 OK`

### 5. Delete a book
- **Method:** `DELETE`
- **Path:** `/books/{id}`
- **Description:** Removes a specific book from the library catalog.
- **Success Status Code:** `204 No Content`

### 6. List books by author
- **Method:** `GET`
- **Path:** `/books?author={author_name}`
- **Description:** Retrieves a filtered list of books written by a specific author using a query parameter.
- **Success Status Code:** `200 OK`

## Error Codes

- **400 Bad Request**: The request was invalid or missing required fields. 
  - *Example:* Trying to `POST` a new book without providing a `title` or `author` in the JSON request body.
  
- **404 Not Found**: The requested resource does not exist on the server.
  - *Example:* Trying to `GET /books/999` when no book with the ID `999` exists in the database.