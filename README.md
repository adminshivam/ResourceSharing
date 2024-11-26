# Expiring Temporary Resource Sharing Module
This project implements a backend module to manage temporary resource sharing. Users can share resources (e.g., files, links, or documents) with others for a limited time. The resources automatically expire after the specified duration and become inaccessible.

# **Features**
- **Create Temporary Resources:** Users can upload or register a resource with an expiration time.
- **Access Control** Secure access links are provided using unique tokens.
- **Auto-Expiry** Resources are automatically flagged as expired once the expiration time passes.
- **Query Resources** Users can fetch active or expired resources easily.

# **Tech Stack**

- **Backend Framework:** Node.js with Express
- **Database:** MySQL
- **Scheduling:** Node.js with custom interval-based expiry checks

# **Setup Instructions**

# **Prerequisites**
- Node.js (v16+ recommended)
- MySQL database server

# **Steps**
- Clone the repository:

git clone <repository-url>
cd resource-sharing

Install dependencies:

npm install
Configure environment variables in .env:

DB_HOST=localhost
DB_NAME=resource_sharing
DB_USER=root
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
PORT=3000

Set up the database schema. Run the following MySQL commands:


CREATE DATABASE resource_sharing;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE resources (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    resource_url TEXT NOT NULL,
    expiration_time DATETIME NOT NULL,
    is_expired BOOLEAN DEFAULT FALSE,
    access_token VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

# **Start the server:**

node app.js
The API server will be running on http://localhost:3000.

# **API Documentation**

1. Create a New Resource
Endpoint: POST /resources

Description: Creates a resource with an expiration time.

Request Body:

{
  "user_id": 1,
  "resource_url": "http://example.com/file.pdf",
  "expiration_time": "2024-12-01 12:00:00"
}
Response:

{
  "id": 1,
  "access_token": "unique-token-here"
}

2. Fetch Resources
Endpoint: GET /resources

Description: Fetch resources for a user with optional filters for status.

Query Parameters:

user_id (required): ID of the user.
status (optional): active or expired.

Response:

[
  {
    "id": 1,
    "user_id": 1,
    "resource_url": "http://example.com/file.pdf",
    "expiration_time": "2024-12-01T12:00:00.000Z",
    "is_expired": false,
    "access_token": "unique-token-here"
  }
]

3. Access a Specific Resource

Endpoint: GET /resources/:id

Description: Fetch a specific resource if it is still active.

Headers:

access_token: Token for secure access.
Response:

{
  "id": 1,
  "user_id": 1,
  "resource_url": "http://example.com/file.pdf",
  "expiration_time": "2024-12-01T12:00:00.000Z",
  "is_expired": false,
  "access_token": "unique-token-here"
}
Error (Expired or Invalid):

{
  "message": "Resource is expired or invalid."
}

4. Delete a Resource
Endpoint: DELETE /resources/:id

Description: Delete a resource if the user is the owner.

Request Body:

{
  "user_id": 1
}
Response:

{
  "message": "Resource deleted successfully."
}
Error (Unauthorized):

{
  "message": "Unauthorized to delete this resource."
}

Auto-Expiry Cron Job
The cron job checks for expired resources every minute and flags them as expired in the database. This ensures no active resources remain accessible past their expiration time.

Testing
You can use tools like Postman or cURL to test the API endpoints.

Example Requests:

Create Resource:

curl -X POST http://localhost:3000/resources \
-H "Content-Type: application/json" \
-d '{"user_id": 1, "resource_url": "http://example.com/file.pdf", "expiration_time": "2024-12-01 12:00:00"}'
Fetch Active Resources:

curl -X GET "http://localhost:3000/resources?user_id=1&status=active"
Access Resource:

curl -X GET http://localhost:3000/resources/1 \
-H "access_token: your_generated_token"
Delete Resource:

curl -X DELETE http://localhost:3000/resources/1 \
-H "Content-Type: application/json" \
-d '{"user_id": 1}'

Future Improvements
Implement user authentication with JWT.
Add support for resource uploads instead of just URLs.