# expressJs-basics-notes-crud-project
This is a basic expressJS and nodeJS project which have CRUD operation for managing notes with in-memory "nedb" database and authorization APIs


## Introduction

MyNotesApp is a simple note-taking application built with Node.js and Express. It allows users to create, read, update, and delete notes.

## Setup

1. **Clone the repository:**

   ```
   git clone https://github.com/sdrashti1001/expressJs-basics-notes-crud-project.git
   ```

2. **Install dependencies:**

   ```
   npm install
   ```

3. **Start the application:**

   ```
   npm run serve
   ```

   The application will be running on `http://localhost:3000` by default.

4. **To run the testcases:**
 ```
   npm test
```
5. **Postman collect:**
Find postman collection in root folder's "Notes API - expressJS.postman_collection" file.
You can import above collection or see below mentioned endpoints description for better understanding.

## API Endpoints


### Authentication

#### Register User
- **URL:** `/register`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "username": "example_user",
    "password": "example_password"
  }
  ```
- **Response:**
  - `201 Created` on successful registration.
  - `500 Internal Server Error` if registration fails.

#### Login User
- **URL:** `/login`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "username": "example_user",
    "password": "example_password"
  }
  ```
- **Response:**
  - `200 OK` with JWT token on successful login.
  - `400 Bad Request` if username or password is incorrect.
  - `500 Internal Server Error` if login fails.


### Get All Notes

- **URL:** `/api/notes`
- **Method:** `GET`
- **Response:**

  ```json
  [
    {
      "id": "1",
      "title": "Note 1",
      "description": "Description of Note 1",
      "createdAt": "2024-05-05T16:57:16.417Z",
       "updatedAt": "2024-05-05T16:58:05.114Z",
       "_id": "0WNzkVNF7tfvOmP5"

    },
    {
      "id": "2",
      "title": "Note 2",
      "description": "Description of Note 2",
      "createdAt": "2024-05-05T16:57:16.417Z",
       "updatedAt": "2024-05-05T16:58:05.114Z",
       "_id": "0WNzkVNF7tfvOmP5"

    }
  ]
  ```

### Get Note by ID

- **URL:** `/api/notes/:id`
- **Method:** `GET`
- **Response:**

  ```json
  {
    "id": "1",
    "title": "Note 1",
    "description": "Description of Note 1",
     "createdAt": "2024-05-05T16:57:16.417Z",
     "updatedAt": "2024-05-05T16:58:05.114Z",
     "_id": "0WNzkVNF7tfvOmP5"
  }
  ```

### Create Note

- **URL:** `/api/notes`
- **Method:** `POST`
- **Request:**

  ```json
  {
    "title": "New Note",
    "description": "Description of the new note"
  }
  ```

- **Response:**

  ```json
  {
    "id": "3",
    "title": "New Note",
    "description": "Description of the new note",
      "createdAt": "2024-05-05T16:57:16.417Z",
       "updatedAt": "2024-05-05T16:58:05.114Z",
       "_id": "0WNzkVNF7tfvOmP5"
  }
  ```

### Update Note

- **URL:** `/api/notes/:id`
- **Method:** `PUT`
- **Request:**

  ```json
  {
    "title": "Updated Note",
    "description": "Updated description",
    "createdAt":"2023-05-05T17:25:58.781Z" // optional parameter added to test GET byDateRange API
  }
  ```

- **Response:**

  ```json
   {
    "message": "Note Updated"
  }

  ```

### Delete Note

- **URL:** `/api/notes/:id`
- **Method:** `DELETE`
- **Response:**

  ```json
  {
    "message": "Note Deleted"
  }
  ```

### Delete All Notes

- **URL:** `/api/notes`
- **Method:** `DELETE`
- **Response:**

  ```json
  {
    "message": "All Notes are Deleted"
  }
  ```

To add filtering capabilities to the GET `/api/notes` endpoint for searching by date range, you can modify the endpoint as follows:

### Get All Notes with Filtering by Date Range

- **URL:** `/api/notes`
- **Method:** `GET`
- **Query Parameters:**
  - `start_date`: The start date of the date range (format: YYYY-MM-DD).
  - `end_date`: The end date of the date range (format: YYYY-MM-DD).
- **Response:**
  - An array of notes within the specified date range.

#### Example Request:

```
GET /api/notes/byDateRange?start_date=2024-01-01&end_date=2024-12-31
```

#### Example Response:

```json
[
  {
    "id": "1",
    "title": "Note 1",
    "description": "Description of Note 1",
    "createdAt": "2024-05-01T10:00:00Z",
    "updatedAt": "2024-05-01T12:00:00Z"
  },
  {
    "id": "2",
    "title": "Note 2",
    "description": "Description of Note 2",
    "createdAt": "2024-05-15T08:00:00Z",
    "updatedAt": "2024-05-15T10:00:00Z"
  }
]
```
