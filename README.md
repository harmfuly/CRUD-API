# CRUD API Server

  

## Install packages


    npm  install


## Run the server


    npm start

  
The server will run on the port specified in the `.env` file. By default, it runs on port `5000`. You can configure it by setting `PORT` in `.env`.

  

To exit the server, use the command `Ctrl + C`.

## API Endpoints
### GET /api/users
Fetches all users.  
Response:

-   **200 OK**: Returns an array of all user records.

Example:

    curl http://localhost:5000/api/users

### POST /api/users

Creates a new user.  
Request body:

    {
      "username": "New User",
      "age": 25,
      "hobbies": ["reading", "gaming"]
    }

Response:

-   **201 Created**: Returns the newly created user.
-   **400 Bad Request**: If the required fields (`username`, `age`, `hobbies`) are missing.

Example:

    curl -X POST http://localhost:5000/api/users \
    -H "Content-Type: application/json" \
    -d '{"username": "New User", "age": 25, "hobbies": ["reading", "gaming"]}'

### PUT /api/users/{userId}

Updates an existing user by ID.  
Request body:

    {
      "username": "Updated User",
      "age": 30,
      "hobbies": ["fitness", "music"]
    }

Response:

-   **200 OK**: Returns the updated user.
-   **400 Bad Request**: If `userId` is not a valid UUID.
-   **404 Not Found**: If a user with the provided `userId` doesn't exist.

Example:

    curl -X PUT http://localhost:5000/api/users/{userId} \
    -H "Content-Type: application/json" \
    -d '{"username": "Updated User", "age": 30, "hobbies": ["fitness", "music"]}'

### DELETE /api/users/{userId}

Deletes a user by ID.  
Response:

-   **204 No Content**: If the user is successfully deleted.
-   **400 Bad Request**: If `userId` is not a valid UUID.
-   **404 Not Found**: If a user with the provided `userId` doesn't exist.

Example:

    curl -X DELETE http://localhost:5000/api/users/{userId}

## Error Handling

-   **404 Not Found**: For requests to non-existing endpoints.
-   **500 Internal Server Error**: For server-side errors during request processing.

## Application Modes

There are two modes for running the application:

-   **Development**: Run with `nodemon` or `ts-node-dev`.

    npm run start:dev

- **Production**: Build and run the application.

    npm run start:prod
