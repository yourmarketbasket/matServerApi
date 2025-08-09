# API Documentation

This document provides detailed information about the User and Permission management APIs.

**Authentication:** All endpoints listed below are protected and require a valid JWT Bearer token sent in the `Authorization` header of your request. A `superuser` has access to all endpoints.

---

## User Management API

**Base Path:** `/api/v1/users`

This API is for managing users, their status, rank, and permissions.

### 1. Get All Users

*   **Endpoint:** `GET /api/v1/users`
*   **Description:** Retrieves a list of all users in the system.
*   **Authentication:** Required (Bearer Token). Requires `Superuser` or `Admin` role.
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

### 2. Get Admin Users

*   **Endpoint:** `GET /api/v1/users/admins`
*   **Description:** Retrieves a list of all admin users in the system.
*   **Authentication:** Required (Bearer Token). Requires `Superuser` or `Admin` role.
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

### 3. Get User by ID

*   **Endpoint:** `GET /api/v1/users/:id`
*   **Description:** Retrieves a single user by their unique database `_id`.
*   **Authentication:** Required (Bearer Token). Requires `Superuser` or `Admin` role.
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

### 4. Update User Status

*   **Endpoint:** `PUT /api/v1/users/:id/status`
*   **Description:** Updates a user's approval status using their `_id`.
*   **Authentication:** Required (Bearer Token). Requires `Superuser` or `Admin` role.
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

### 5. Update User Rank

*   **Endpoint:** `PUT /api/v1/users/:id/rank`
*   **Description:** Updates a user's rank using their `_id`.
*   **Authentication:** Required (Bearer Token). Requires `Superuser` or `Admin` role.
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

### 6. Add Permission(s) to User

*   **Endpoint:** `POST /api/v1/users/:id/permissions`
*   **Description:** Assigns one or more permissions to a user.
*   **Authentication:** Required (Bearer Token). Requires `Superuser` or `Admin` role.
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

### 7. Remove Permission from User

*   **Endpoint:** `DELETE /api/v1/users/:id/permissions/:permission`
*   **Description:** Revokes a permission from a user.
*   **Authentication:** Required (Bearer Token). Requires `Superuser` or `Admin` role.
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
*   **Authentication:** Required (Bearer Token). Requires `Superuser` or `Admin` role.
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
*   **Authentication:** Required (Bearer Token). Requires `Superuser` or `Admin` role.
*   **Success Response (200 OK):** Returns an array of all permission objects.

### 3. Get Permission by Number

*   **Endpoint:** `GET /api/v1/permissions/:permissionNumber`
*   **Description:** Retrieves a single permission definition by its number (e.g., "P001").
*   **Authentication:** Required (Bearer Token). Requires `Superuser` or `Admin` role.
*   **URL Parameters:**
    *   `permissionNumber` (string, required): The permission code (e.g., "P001").
*   **Success Response (200 OK):** Returns the requested permission object.
*   **Error Response (404 Not Found):** If no permission with the given number exists.

### 4. Update a Permission

*   **Endpoint:** `PUT /api/v1/permissions/:permissionNumber`
*   **Description:** Updates an existing permission definition by its number.
*   **Authentication:** Required (Bearer Token). Requires `Superuser` or `Admin` role.
*   **URL Parameters:**
    *   `permissionNumber` (string, required): The permission code to update.
*   **Request Body:** An object containing the fields to update.
*   **Success Response (200 OK):** Returns the full, updated permission object.

### 5. Delete a Permission

*   **Endpoint:** `DELETE /api/v1/permissions/:permissionNumber`
*   **Description:** Deletes a permission definition from the system by its number.
*   **Authentication:** Required (Bearer Token). Requires `Superuser` or `Admin` role.
*   **URL Parameters:**
    *   `permissionNumber` (string, required): The permission code to delete.
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "data": {}
    }
    ```

---

## Team Management API

**Base Path:** `/api/v1/teams`

This API is for managing teams.

### 1. Create a new team

*   **Endpoint:** `POST /api/v1/teams`
*   **Description:** Creates a new team.
*   **Authentication:** Required (Bearer Token). Requires `Superuser` or `Admin` role.
*   **Request Body:**
    ```json
    {
      "name": "Team Alpha",
      "teamLead": "60d0fe4f5311236168a109ca"
    }
    ```
*   **Success Response (201 Created):** Returns the created team object.

### 2. Get all teams

*   **Endpoint:** `GET /api/v1/teams`
*   **Description:** Retrieves a list of all teams.
*   **Authentication:** Required (Bearer Token). Requires `Superuser` or `Admin` role.
*   **Success Response (200 OK):** Returns an array of all team objects.

### 3. Get team by ID

*   **Endpoint:** `GET /api/v1/teams/:id`
*   **Description:** Retrieves a single team by its unique database `_id`.
*   **Authentication:** Required (Bearer Token). Requires `Superuser` or `Admin` role.
*   **URL Parameters:**
    *   `id` (string, required): The `_id` of the team.
*   **Success Response (200 OK):** Returns the requested team object.

### 4. Update a team

*   **Endpoint:** `PUT /api/v1/teams/:id`
*   **Description:** Updates an existing team by its `_id`.
*   **Authentication:** Required (Bearer Token). Requires `Superuser` or `Admin` role.
*   **URL Parameters:**
    *   `id` (string, required): The `_id` of the team to update.
*   **Request Body:** An object containing the fields to update.
*   **Success Response (200 OK):** Returns the full, updated team object.

### 5. Delete a team

*   **Endpoint:** `DELETE /api/v1/teams/:id`
*   **Description:** Deletes a team from the system by its `_id`.
*   **Authentication:** Required (Bearer Token). Requires `Superuser` or `Admin` role.
*   **URL Parameters:**
    *   `id` (string, required): The `_id` of the team to delete.
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "data": {}
    }
    ```

### 6. Add a member to a team

*   **Endpoint:** `POST /api/v1/teams/:id/members/:userId`
*   **Description:** Adds a user to a team.
*   **Authentication:** Required (Bearer Token). Requires `Superuser` or `Admin` role.
*   **URL Parameters:**
    *   `id` (string, required): The `_id` of the team.
    *   `userId` (string, required): The `_id` of the user to add.
*   **Success Response (200 OK):** Returns the updated team object.

### 7. Remove a member from a team

*   **Endpoint:** `DELETE /api/v1/teams/:id/members/:userId`
*   **Description:** Removes a user from a team.
*   **Authentication:** Required (Bearer Token). Requires `Superuser` or `Admin` role.
*   **URL Parameters:**
    *   `id` (string, required): The `_id` of the team.
    *   `userId` (string, required): The `_id` of nutty to remove.
*   **Success Response (200 OK):** Returns the updated team object.

---

## Support Group Management API

**Base Path:** `/api/v1/support-groups`

This API is for managing support groups.

### 1. Create a new support group

*   **Endpoint:** `POST /api/v1/support-groups`
*   **Description:** Creates a new support group.
*   **Authentication:** Required (Bearer Token). Requires `Superuser` or `Admin` role.
*   **Request Body:**
    ```json
    {
      "name": "Support Group Alpha",
      "supervisor": "60d0fe4f5311236168a109ca"
    }
    ```
*   **Success Response (201 Created):** Returns the created support group object.

### 2. Get all support groups

*   **Endpoint:** `GET /api/v1/support-groups`
*   **Description:** Retrieves a list of all support groups.
*   **Authentication:** Required (Bearer Token). Requires `Superuser` or `Admin` role.
*   **Success Response (200 OK):** Returns an array of all support group objects.

### 3. Get support group by ID

*   **Endpoint:** `GET /api/v1/support-groups/:id`
*   **Description:** Retrieves a single support group by its unique database `_id`.
*   **Authentication:** Required (Bearer Token). Requires `Superuser` or `Admin` role.
*   **URL Parameters:**
    *   `id` (string, required): The `_id` of the support group.
*   **Success Response (200 OK):** Returns the requested support group object.

### 4. Update a support group

*   **Endpoint:** `PUT /api/v1/support-groups/:id`
*   **Description:** Updates an existing support group by its `_id`.
*   **Authentication:** Required (Bearer Token). Requires `Superuser` or `Admin` role.
*   **URL Parameters:**
    *   `id` (string, required): The `_id` of the support group to update.
*   **Request Body:** An object containing the fields to update.
*   **Success Response (200 OK):** Returns the full, updated support group object.

### 5. Delete a support group

*   **Endpoint:** `DELETE /api/v1/support-groups/:id`
*   **Description:** Deletes a support group from the system by its `_id`.
*   **Authentication:** Required (Bearer Token). Requires `Superuser` or `Admin` role.
*   **URL Parameters:**
    *   `id` (string, required): The `_id` of the support group to delete.
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "data": {}
    }
    ```

### 6. Add a member to a support group

*   **Endpoint:** `POST /api/v1/support-groups/:id/members/:userId`
*   **Description:** Adds a user to a support group.
*   **Authentication:** Required (Bearer Token). Requires `Superuser` or `Admin` role.
*   **URL Parameters:**
    *   `id` (string, required): The `_id` of the support group.
    *   `userId` (string, required): The `_id` of the user to add.
*   **Success Response (200 OK):** Returns the updated support group object.

### 7. Remove a member from a support group

*   **Endpoint:** `DELETE /api/v1/support-groups/:id/members/:userId`
*   **Description:** Removes a user from a support group.
*   **Authentication:** Required (Bearer Token). Requires `Superuser` or `Admin` role.
*   **URL Parameters:**
    *   `id` (string, required): The `_id` of the support group.
    *   `userId` (string, required): The `_id` of the user to remove.
*   **Success Response (200 OK):** Returns the updated support group object.

---

## Analytics API

**Base Path:** `/api/v1/analytics`

This API is for retrieving analytics data.

### 1. Get Sacco Revenue

*   **Endpoint:** `GET /api/v1/analytics/revenue/sacco/:saccoId`
*   **Description:** Retrieves revenue data for a specific Sacco.
*   **Authentication:** Required (Bearer Token). Requires `sacco`, `support_staff`, or `superuser` role.
*   **URL Parameters:**
    *   `saccoId` (string, required): The `_id` of the Sacco.
*   **Query Parameters:**
    *   `startDate` (date, optional): The start date for the report.
    *   `endDate` (date, optional): The end date for the report.
*   **Success Response (200 OK):** Returns an object with revenue data.

### 2. Get Owner Revenue

*   **Endpoint:** `GET /api/v1/analytics/revenue/owner/:ownerId`
*   **Description:** Retrieves revenue data for a specific vehicle owner.
*   **Authentication:** Required (Bearer Token). Requires `owner`, `sacco`, `support_staff`, or `superuser` role.
*   **URL Parameters:**
    *   `ownerId` (string, required): The `_id` of the owner.
*   **Query Parameters:**
    *   `startDate` (date, optional): The start date for the report.
    *   `endDate` (date, optional): The end date for the report.
*   **Success Response (200 OK):** Returns an object with revenue data.

### 3. Get Cancellation Stats

*   **Endpoint:** `GET /api/v1/analytics/cancellations/:routeId`
*   **Description:** Retrieves cancellation statistics for a specific route.
*   **Authentication:** Required (Bearer Token). Requires `sacco`, `support_staff`, or `superuser` role.
*   **URL Parameters:**
    *   `routeId` (string, required): The `_id` of the route.
*   **Success Response (200 OK):** Returns an object with cancellation stats.

### 4. Get Payroll Accuracy

*   **Endpoint:** `GET /api/v1/analytics/payroll/:saccoId`
*   **Description:** Retrieves payroll accuracy data for a specific Sacco.
*   **Authentication:** Required (Bearer Token). Requires `sacco`, `support_staff`, or `superuser` role.
*   **URL Parameters:**
    *   `saccoId` (string, required): The `_id` of the Sacco.
*   **Success Response (200 OK):** Returns an object with payroll accuracy data.

### 5. Get Loyalty Usage

*   **Endpoint:** `GET /api/v1/analytics/loyalty/:userId`
*   **Description:** Retrieves loyalty point usage for a specific user.
*   **Authentication:** Required (Bearer Token). The user can view their own loyalty usage. `admin` and `superuser` can view any user's loyalty usage.
*   **URL Parameters:**
    *   `userId` (string, required): The `_id` of the user.
*   **Success Response (200 OK):** Returns an object with loyalty usage data.

### 6. Get User Registration Stats

*   **Endpoint:** `GET /api/v1/analytics/registrations`
*   **Description:** Retrieves user registration statistics.
*   **Authentication:** Required (Bearer Token). Requires `admin` or `superuser` role.
*   **Query Parameters:**
    *   `period` (string, optional): The period for the report ('daily', 'weekly', 'monthly'). Defaults to 'daily'.
*   **Success Response (200 OK):** Returns an array of objects with registration data.
