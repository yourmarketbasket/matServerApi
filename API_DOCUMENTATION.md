# API Documentation

This document provides detailed information about the User and Permission management APIs.

**Authentication:** All endpoints listed below are protected and require a valid JWT Bearer token sent in the `Authorization` header of your request.
**Authorization:** Specific permissions are required for each endpoint. A `superuser` has access to all endpoints.

---

## User Management API

**Base Path:** `/api/v1/users`

This API is for managing users, their status, rank, and permissions.

### 1. Get All Users

*   **Endpoint:** `GET /api/v1/users`
*   **Description:** Retrieves a list of all users in the system.
*   **Authorization:** Requires permission `P112`.
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "data": [
        {
          "_id": "60d0fe4f5311236168a109ca",
          "name": "Jane Doe",
          "email": "jane.doe@example.com",
          "role": "admin",
          "rank": "Manager"
        }
      ]
    }
    ```
*   **Error Response (403 Forbidden):** If the user lacks the required permission.
    ```json
    {
      "success": false,
      "message": "User does not have the required permissions to access this route."
    }
    ```

### 2. Get User by ID

*   **Endpoint:** `GET /api/v1/users/:id`
*   **Description:** Retrieves a single user by their unique database `_id`.
*   **Authorization:** Requires permission `P113`.
*   **URL Parameters:**
    *   `id` (string, required): The `_id` of the user.
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "data": {
        "_id": "60d0fe4f5311236168a109ca",
        "name": "Jane Doe",
        "email": "jane.doe@example.com",
        "role": "admin",
        "rank": "Manager",
        "approvedStatus": "approved",
        "permissions": ["P111", "P112"]
      }
    }
    ```
*   **Error Response (404 Not Found):** If no user with the given `_id` exists.
    ```json
    {
      "success": false,
      "error": "User not found."
    }
    ```

### 3. Update User Status

*   **Endpoint:** `PUT /api/v1/users/:id/status`
*   **Description:** Updates a user's approval status using their `_id`.
*   **Authorization:** Requires permission `P111`.
*   **URL Parameters:**
    *   `id` (string, required): The `_id` of the user.
*   **Request Body:**
    ```json
    {
      "status": "suspended"
    }
    ```
    *   Valid `status` values: `pending`, `approved`, `suspended`, `blocked`.
*   **Success Response (200 OK):** Returns the full, updated user object.
*   **Error Response (400 Bad Request):** If the `id` is missing from the URL.
    ```json
    {
        "success": false,
        "error": "User ID is missing from the request URL."
    }
    ```

### 4. Update User Rank

*   **Endpoint:** `PUT /api/v1/users/:id/rank`
*   **Description:** Updates a user's rank using their `_id`.
*   **Authorization:** Requires permission `P114`.
*   **URL Parameters:**
    *   `id` (string, required): The `_id` of the user.
*   **Request Body:**
    ```json
    {
      "rank": "Director"
    }
    ```
*   **Success Response (200 OK):** Returns the full, updated user object.
*   **Error Response (400 Bad Request):** If the `rank` is not a valid value.
    ```json
    {
        "success": false,
        "error": "User validation failed: rank: `InvalidRank` is not a valid enum value for path `rank`."
    }
    ```

### 5. Add Permission(s) to User

*   **Endpoint:** `POST /api/v1/users/:id/permissions`
*   **Description:** Assigns one or more permissions to a user.
*   **Authorization:** Requires permission `P115`.
*   **Request Body (Single):** `{ "permission": "P101" }`
*   **Request Body (Multiple):** `{ "permissions": ["P101", "P102"] }`
*   **Success Response (200 OK):** Returns the user object with the updated permissions array.
*   **Error Response (400 Bad Request):** If the request body is missing the required field.
    ```json
    {
        "success": false,
        "error": "Request body must contain either \\"permission\\" (string) or \\"permissions\\" (array of strings)."
    }
    ```

### 6. Remove Permission from User

*   **Endpoint:** `DELETE /api/v1/users/:id/permissions/:permission`
*   **Description:** Revokes a permission from a user.
*   **Authorization:** Requires permission `P116`.
*   **URL Parameters:**
    *   `id` (string, required): The `_id` of the user.
    *   `permission` (string, required): The permission code to remove (e.g., "P101").
*   **Success Response (200 OK):** Returns the user object with the updated permissions array.
*   **Error Response (400 Bad Request):** If the user does not have the specified permission.
     ```json
    {
        "success": false,
        "error": "User does not have this permission."
    }
    ```

---

## Permission Management API

**Base Path:** `/api/v1/permissions`

This API is for managing the permission definitions themselves.

### 1. Create Permission(s)

*   **Endpoint:** `POST /api/v1/permissions`
*   **Description:** Creates one or more new permission definitions.
*   **Authorization:** Requires permission `P117`.
*   **Request Body:** Can be a single permission object or an array of permission objects.
    *   **Single:** `{ "permissionNumber": "P122", "description": "...", "roles": ["Admin"] }`
    *   **Multiple:** `[ { ... }, { ... } ]`
*   **Success Response (201 Created):** Returns the created object or an array of created objects.
*   **Error Response (400 Bad Request):** If a `permissionNumber` is not unique.
    ```json
    {
        "success": false,
        "error": "Permission validation failed: permissionNumber: Error, expected `permissionNumber` to be unique. Value: `P122`"
    }
    ```

### 2. Get All Permissions

*   **Endpoint:** `GET /api/v1/permissions`
*   **Description:** Retrieves a list of all permission definitions.
*   **Authorization:** Requires permission `P118`.
*   **Success Response (200 OK):** Returns an array of all permission objects.

### 3. Get Permission by Number

*   **Endpoint:** `GET /api/v1/permissions/:permissionNumber`
*   **Description:** Retrieves a single permission definition by its number (e.g., "P001").
*   **Authorization:** Requires permission `P119`.
*   **URL Parameters:**
    *   `permissionNumber` (string, required): The permission code (e.g., "P001").
*   **Success Response (200 OK):** Returns the requested permission object.
*   **Error Response (404 Not Found):** If no permission with the given number exists.

### 4. Update a Permission

*   **Endpoint:** `PUT /api/v1/permissions/:permissionNumber`
*   **Description:** Updates an existing permission definition by its number.
*   **Authorization:** Requires permission `P120`.
*   **URL Parameters:**
    *   `permissionNumber` (string, required): The permission code to update.
*   **Request Body:** An object containing the fields to update.
*   **Success Response (200 OK):** Returns the full, updated permission object.

### 5. Delete a Permission

*   **Endpoint:** `DELETE /api/v1/permissions/:permissionNumber`
*   **Description:** Deletes a permission definition from the system by its number.
*   **Authorization:** Requires permission `P121`.
*   **URL Parameters:**
    *   `permissionNumber` (string, required): The permission code to delete.
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "data": {}
    }
    ```
