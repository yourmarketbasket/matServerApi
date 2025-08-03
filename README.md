# SafarEasy API Server

This repository contains the Node.js, Express, and MongoDB backend for the SafarEasy transport management system. It provides a comprehensive API for handling all operations from authentication and Sacco management to trip registration, payments, and analytics, with a focus on security and role-based access control.

## Project Structure

The project follows a modular, feature-oriented structure designed for scalability and maintainability.

```
/
├── src/
│   ├── api/
│   │   ├── controllers/  // Handles incoming requests and sends responses.
│   │   ├── middlewares/  // Custom middleware for auth, RBAC, and encryption.
│   │   ├── models/       // Mongoose schemas defining the database structure.
│   │   ├── routes/       // Express router definitions for all API endpoints.
│   │   └── services/     // Contains the core business logic for each feature.
│   ├── config/           // Loads and exports configuration from environment variables.
│   └── loaders/          // Initializers for services like the database connection.
├── .env.example          // An example file for required environment variables.
├── .gitignore            // Specifies files and directories to be ignored by Git.
├── src/index.js          // The main entry point for the application.
└── package.json          // Lists project dependencies and defines scripts.
```

## Getting Started

### Prerequisites

*   **Node.js**: Version 18 or higher is recommended.
*   **MongoDB**: A running MongoDB instance (local or cloud-hosted).
*   **NPM**: Comes with Node.js.

### Setup Instructions

1.  **Clone the Repository**
    ```bash
    git clone <your-repository-url>
    cd <repository-directory>
    ```

2.  **Install Dependencies**
    Use npm to install all the required packages as defined in `package.json`.
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Create a `.env` file in the project root by copying the example file.
    ```bash
    cp .env.example .env
    ```
    Open the `.env` file and provide the necessary values for your environment:
    *   `MONGODB_URI`: Your MongoDB connection string.
    *   `JWT_SECRET`: A long, random string for signing JWTs.
    *   `ADMIN_KEY`: A secret key for the one-time registration of a superuser.
    *   `ENCRYPTION_KEY`: A 32-character key for AES-256 encryption.

### Running the Server

*   **For Development:**
    This command uses `nodemon` to start the server, which will automatically restart upon file changes.
    ```bash
    npm run dev
    ```

*   **For Production:**
    This command runs the server using `node`.
    ```bash
    npm start
    ```

The API will be available at `http://localhost:PORT`, where `PORT` is the value specified in your `.env` file (default is 3000).
