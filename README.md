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

Set up the database schema. Run the following MySQL commands:


CREATE DATABASE resource_sharing;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    login_token VARCHAR(255) UNIQUE NOT NULL,
);

CREATE TABLE resources (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    resource_url TEXT NOT NULL,
    expiration_time DATETIME NOT NULL,
    is_expired BOOLEAN DEFAULT FALSE,
    access_token VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

# **Start the server:**

npm run start 
node app.js
The API server will be running on http://localhost:3000.

# **API Documentation**

1. Create a New User
Endpoint: POST /users

Description: Creates a resource with an expiration time.
curl --location 'http://localhost:3000/users' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "test",
    "email": "test@local.com"
}'

Response:

{
    "userId": 1,
    "access_token": "g3hqngmitqg"
}

2. Create a New Resource
Endpoint: POST /resources

Description: Creates a resource with an expiration time.

Curl:

curl --location 'http://localhost:3000/resources' \
--header 'Content-Type: application/json' \
--header 'user-id: 1' \
--header 'access-token: g3hqngmitqg' \
--data '{
    "resourceUrl": "http://example.com/file.pdf",
    "expirationTime": "2024-11-28 04:47:00"
}'

Response:

{
    "resourceId": 1,
    "resourceAccessToken": "3geck6nsm3g"
}


2. Fetch Resources
Endpoint: GET /resources

Description: Fetch resources for a user with optional filters for status.

Curl:

curl --location 'http://localhost:3000/resources?status=active' \
--header 'user-id: 1' \
--header 'access-token: g3hqngmitqg'

Response:

{
    "resources": [
        {
            "id": 1,
            "user_id": 1,
            "resource_url": "http://example.com/file.pdf",
            "expiration_time": "2024-11-27T23:17:00.000Z",
            "is_expired": 0,
            "access_token": "3geck6nsm3g",
            "created_at": "2024-11-26T07:55:31.000Z"
        }
    ]
}

3. Access a Specific Resource

Endpoint: GET /resources/:id

Description: Fetch a specific resource if it is still active.

Curl:

curl --location 'http://localhost:3000/resources/1' \
--header 'access-token: 3geck6nsm3g'

Response:

{
    "resources": [
        {
            "id": 1,
            "user_id": 1,
            "resource_url": "http://example.com/file.pdf",
            "expiration_time": "2024-11-27T23:17:00.000Z",
            "is_expired": 0,
            "access_token": "3geck6nsm3g",
            "created_at": "2024-11-26T07:55:31.000Z"
        }
    ]
}

4. Delete a Resource
Endpoint: DELETE /resources/:id

Description: Delete a resource if the user is the owner.

Curl:

curl --location --request DELETE 'http://localhost:3000/resources/1' \
--header 'user-id: 1' \
--header 'access-token: g3hqngmitqg'

Response:

{
    "data": {
        "message": "Deleted resource 1 successfully"
    }
}

Auto-Expiry Cron Job
The cron job checks for expired resources every minute and flags them as expired in the database. This ensures no active resources remain accessible past their expiration time.

Future Improvements
Implement user authentication with JWT.
Add support for resource uploads instead of just URLs.