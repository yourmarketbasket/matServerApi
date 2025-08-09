# API Documentation

This document provides a detailed overview of the API endpoints for the server.

## Table of Contents
- [Authentication](#authentication)
- [Authorization](#authorization)
- [API Modules](#api-modules)
  - [Auth](#auth)
  - [User Management](#user-management)
  - [Superuser](#superuser)
  - [Sacco](#sacco)
  - [Route](#route)
  - [Vehicle](#vehicle)
  - [Driver](#driver)
  - [Trip](#trip)
  - [Queue](#queue)
  - [Ticket](#ticket)
  - [Payment](#payment)
  - [Payroll](#payroll)
  - [Reallocation](#reallocation)
  - [Support](#support)
  - [Analytics](#analytics)
  - [Discount](#discount)
  - [Loyalty](#loyalty)
  - [Permission](#permission)
- [Socket.IO Events](#socketio-events)

## Authentication

Authentication is handled via JSON Web Tokens (JWT). For protected routes, a valid JWT must be included in the `Authorization` header of the request as a Bearer token.

`Authorization: Bearer <your_jwt_token>`

## Authorization

Authorization is role-based. Certain endpoints require specific permissions. If the user does not have the required permissions, the API will respond with a `403 Forbidden` error. Superusers have access to all routes.

## API Modules

### Auth

This section covers endpoints related to user authentication, including login, signup, and password management.

---

#### `POST /api/v1/auth/login`

- **Description:** Logs in a user and returns a JWT token.
- **Authentication:** Public.
- **Permissions:** None.
- **Parameters (Body):**
  - `emailOrPhone` (string, required): The user's email address or phone number.
  - `password` (string, required): The user's password.
  - `mfaCode` (string, optional): The Multi-Factor Authentication code, if enabled for the user.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "token": "your_jwt_token",
      "user": {
        "_id": "user_id",
        "name": "User Name",
        "email": "user@example.com",
        "role": "Passenger"
      }
    }
  }
  ```
- **Failure Response (401 Unauthorized):**
  ```json
  {
    "success": false,
    "message": "Invalid credentials"
  }
  ```

---

#### `POST /api/v1/auth/signup`

- **Description:** Registers a new user.
- **Authentication:** Public.
- **Permissions:** None.
- **Parameters (Body):**
  - `name` (string, required): The user's full name.
  - `email` (string, required): The user's email address.
  - `phone` (string, required): The user's phone number.
  - `password` (string, required): The user's password.
  - `role` (string, optional, default: 'Passenger'): The role of the user.
- **Socket Events:**
  - Emits `newUser` to connected clients with user data upon successful registration.
- **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "data": {
      "token": "your_jwt_token",
      "user": {
        "_id": "user_id",
        "name": "User Name",
        "email": "user@example.com",
        "role": "Passenger"
      }
    }
  }
  ```
- **Failure Response (400 Bad Request):**
  ```json
  {
    "success": false,
    "message": "User already exists"
  }
  ```

---

#### `POST /api/v1/auth/send-otp`

- **Description:** Sends a One-Time Password (OTP) to the user's email for verification or password reset.
- **Authentication:** Public.
- **Permissions:** None.
- **Parameters (Body):**
  - `email` (string, required): The email address to send the OTP to.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "If an account with that email exists, an OTP has been sent."
  }
  ```
- **Failure Response (500 Internal Server Error):**
  ```json
  {
    "success": false,
    "message": "Error sending OTP"
  }
  ```

---

#### `POST /api/v1/auth/verify-otp`

- **Description:** Verifies an OTP and returns a temporary token for actions like password reset.
- **Authentication:** Public.
- **Permissions:** None.
- **Parameters (Body):**
  - `email` (string, required): The user's email.
  - `otp` (string, required): The OTP received by the user.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "resetToken": "a_temporary_reset_token"
    }
  }
  ```
- **Failure Response (400 Bad Request):**
  ```json
  {
    "success": false,
    "message": "Invalid or expired OTP"
  }
  ```

---

#### `POST /api/v1/auth/forgot-password`

- **Description:** Initiates the password reset process by sending a reset token to the user's email.
- **Authentication:** Public.
- **Permissions:** None.
- **Parameters (Body):**
  - `email` (string, required): The user's email address.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "If a user with that email exists, a password reset token has been sent."
  }
  ```
- **Failure Response (404 Not Found):**
  ```json
  {
    "success": false,
    "message": "User not found"
  }
  ```

---

#### `POST /api/v1/auth/reset-password`

- **Description:** Resets the user's password using a valid reset token.
- **Authentication:** Public.
- **Permissions:** None.
- **Parameters (Body):**
  - `token` (string, required): The password reset token from the forgot password email.
  - `newPassword` (string, required): The new password.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "message": "Password reset successfully"
    }
  }
  ```
- **Failure Response (400 Bad Request):**
  ```json
  {
    "success": false,
    "message": "Invalid or expired token"
  }
  ```

---

#### `POST /api/v1/auth/mfa/setup`

- **Description:** Generates a QR code for the user to set up Multi-Factor Authentication.
- **Authentication:** Protected (requires JWT).
- **Permissions:** None (any authenticated user can set up MFA for their own account).
- **Parameters (Body):** None.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "qrCode": "data:image/png;base64,...",
      "secret": "MFA_SECRET_KEY"
    }
  }
  ```
- **Failure Response (500 Internal Server Error):**
  ```json
  {
    "success": false,
    "message": "MFA setup failed"
  }
  ```

---

#### `POST /api/v1/auth/mfa/verify`

- **Description:** Verifies the MFA token and enables MFA for the user's account.
- **Authentication:** Protected (requires JWT).
- **Permissions:** None.
- **Parameters (Body):**
  - `token` (string, required): The time-based one-time password (TOTP) from the authenticator app.
- **Socket Events:**
  - Emits `mfaVerified` upon successful verification.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "message": "MFA enabled successfully"
    }
  }
  ```
- **Failure Response (400 Bad Request):**
  ```json
  {
    "success": false,
    "message": "Invalid MFA token"
  }
  ```

---

#### `POST /api/v1/auth/verify-phone`

- **Description:** Initiates the phone number verification process for the logged-in user. (Note: Implementation details might vary, e.g., sending an SMS OTP).
- **Authentication:** Protected (requires JWT).
- **Permissions:** None.
- **Parameters (Body):** None.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "message": "Phone verification process started."
    }
  }
  ```
- **Failure Response (500 Internal Server Error):**
  ```json
  {
    "success": false,
    "message": "Failed to start phone verification"
  }
  ```

### User Management

This section covers endpoints for managing user accounts, including their status, rank, and permissions. All routes in this section are protected and require specific permissions.

---

#### `GET /api/v1/users`

- **Description:** Retrieves a list of all users.
- **Authentication:** Protected.
- **Permissions:** `P112` (View users).
- **Parameters:** None.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "user_id",
        "name": "User Name",
        "email": "user@example.com",
        "role": "Passenger",
        "status": "active"
      }
    ]
  }
  ```
- **Failure Response (403 Forbidden):**
  ```json
  {
    "success": false,
    "message": "User does not have the required permissions..."
  }
  ```

---

#### `GET /api/v1/users/:id`

- **Description:** Retrieves a single user by their ID.
- **Authentication:** Protected.
- **Permissions:** `P113` (View user details).
- **Parameters (URL):**
  - `id` (string, required): The ID of the user to retrieve.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "_id": "user_id",
      "name": "User Name",
      "email": "user@example.com",
      "role": "Passenger",
      "status": "active",
      "permissions": ["P001"]
    }
  }
  ```
- **Failure Response (404 Not Found):**
  ```json
  {
    "success": false,
    "message": "User not found"
  }
  ```

---

#### `PUT /api/v1/users/:id/status`

- **Description:** Updates the status of a user (e.g., 'active', 'suspended').
- **Authentication:** Protected.
- **Permissions:** `P111` (Update user status).
- **Parameters (URL):**
  - `id` (string, required): The ID of the user to update.
- **Parameters (Body):**
  - `status` (string, required): The new status for the user.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "_id": "user_id",
      "status": "suspended"
    }
  }
  ```
- **Failure Response (400 Bad Request):**
  ```json
  {
    "success": false,
    "message": "Invalid status provided"
  }
  ```

---

#### `PUT /api/v1/users/:id/rank`

- **Description:** Updates the rank or role of a user.
- **Authentication:** Protected.
- **Permissions:** `P114` (Update user rank).
- **Parameters (URL):**
  - `id` (string, required): The ID of the user to update.
- **Parameters (Body):**
  - `rank` (string, required): The new rank/role for the user.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "_id": "user_id",
      "role": "Admin"
    }
  }
  ```
- **Failure Response (400 Bad Request):**
  ```json
  {
    "success": false,
    "message": "Invalid rank provided"
  }
  ```

---

#### `POST /api/v1/users/:id/permissions`

- **Description:** Adds one or more permissions to a user.
- **Authentication:** Protected.
- **Permissions:** `P115` (Add user permissions).
- **Parameters (URL):**
  - `id` (string, required): The ID of the user.
- **Parameters (Body):**
  - `permission` (string, optional): A single permission to add.
  - `permissions` (array of strings, optional): A list of permissions to add. (Provide either `permission` or `permissions`).
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "_id": "user_id",
      "permissions": ["P001", "P002"]
    }
  }
  ```
- **Failure Response (400 Bad Request):**
  ```json
  {
    "success": false,
    "message": "Request body must contain either 'permission' or 'permissions'."
  }
  ```

---

#### `DELETE /api/v1/users/:id/permissions/:permission`

- **Description:** Removes a specific permission from a user.
- **Authentication:** Protected.
- **Permissions:** `P116` (Remove user permission).
- **Parameters (URL):**
  - `id` (string, required): The ID of the user.
  - `permission` (string, required): The permission to remove.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "_id": "user_id",
      "permissions": ["P001"]
    }
  }
  ```
- **Failure Response (404 Not Found):**
  ```json
  {
    "success": false,
    "message": "Permission not found on user"
  }
  ```

### Superuser

This section covers endpoints available only to superusers for system-wide management.

---

#### `POST /api/v1/superuser/register`

- **Description:** Registers the initial superuser. This is likely a one-time operation protected by a server-level admin key.
- **Authentication:** Public (but requires `adminKey`).
- **Permissions:** `P003`.
- **Parameters (Body):**
  - `adminKey` (string, required): A secret key to authorize superuser creation.
  - `userData` (object, required): The user object for the new superuser (containing `name`, `email`, `password`, etc.).
- **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "data": { "message": "Superuser registered successfully" }
  }
  ```
- **Failure Response (401 Unauthorized):**
  ```json
  {
    "success": false,
    "message": "Invalid admin key"
  }
  ```

---

#### `POST /api/v1/superuser/login`

- **Description:** Logs in a superuser. This is a separate login endpoint that may enforce stricter policies (e.g., mandatory MFA).
- **Authentication:** Public.
- **Permissions:** `P001`.
- **Parameters (Body):**
  - `emailOrPhone` (string, required): Superuser's email or phone.
  - `password` (string, required): Superuser's password.
  - `mfaCode` (string, required): MFA code is mandatory for superusers.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "token": "your_jwt_token",
      "user": { ... }
    }
  }
  ```
- **Failure Response (401 Unauthorized):**
  ```json
  {
    "success": false,
    "message": "Invalid credentials or MFA code"
  }
  ```

---

#### `POST /api/v1/superuser/staff`

- **Description:** Creates a new support staff user.
- **Authentication:** Protected.
- **Permissions:** `P009` (Add Support Staff).
- **Parameters (Body):**
  - User object (e.g., `name`, `email`, `password`, `role: 'Support Staff'`).
- **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "data": { ... } // The created staff user object
  }
  ```
- **Failure Response (400 Bad Request):**
  ```json
  {
    "success": false,
    "message": "User with this email already exists"
  }
  ```

---

#### `PUT /api/v1/superuser/staff/:id`

- **Description:** Updates the details of a support staff member.
- **Authentication:** Protected.
- **Permissions:** `P010` (Edit Support Staff).
- **Parameters (URL):**
  - `id` (string, required): The ID of the staff member to update.
- **Parameters (Body):**
  - Fields to update (e.g., `name`, `phone`).
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": { ... } // The updated staff user object
  }
  ```
- **Failure Response (404 Not Found):**
  ```json
  {
    "success": false,
    "message": "Staff not found"
  }
  ```

---

#### `DELETE /api/v1/superuser/staff/:id`

- **Description:** Deletes a support staff member.
- **Authentication:** Protected.
- **Permissions:** `P011` (Delete Support Staff).
- **Parameters (URL):**
  - `id` (string, required): The ID of the staff member to delete.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Support staff deleted successfully"
  }
  ```
- **Failure Response (404 Not Found):**
  ```json
  {
    "success": false,
    "message": "Staff not found"
  }
  ```

---

#### `GET /api/v1/superuser/metrics`

- **Description:** Retrieves system-wide metrics.
- **Authentication:** Protected.
- **Permissions:** `P012` (View system metrics).
- **Parameters:** None.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "metrics": {
        "totalUsers": 1500,
        "activeTrips": 45,
        "totalRevenue": 120500.75
      }
    }
  }
  ```
- **Failure Response (500 Internal Server Error):**
  ```json
  {
    "success": false,
    "message": "Failed to retrieve metrics"
  }
  ```

---

#### `POST /api/v1/superuser/fare-policy`

- **Description:** Sets or updates system-wide fare adjustment policies.
- **Authentication:** Protected.
- **Permissions:** `P013`, `P014`, `P015`.
- **Parameters (Body):**
  - Policy object (e.g., `fuelPriceMultiplier`, `timeBasedRules`).
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "policy": { ... } // The created/updated policy
    }
  }
  ```
- **Failure Response (400 Bad Request):**
  ```json
  {
    "success": false,
    "message": "Invalid policy data"
  }
  ```

---

#### `POST /api/v1/superuser/system-fee`

- **Description:** Sets or updates the system fee structure.
- **Authentication:** Protected.
- **Permissions:** `P016`, `P017`, `P018`.
- **Parameters (Body):**
  - Fee structure object (e.g., `percentage`, `fixedAmount`).
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "policy": { ... } // The created/updated fee policy
    }
  }
  ```
- **Failure Response (400 Bad Request):**
  ```json
  {
    "success": false,
    "message": "Invalid fee data"
  }
  ```

---

#### `POST /api/v1/superuser/loyalty-policy`

- **Description:** Sets or updates the loyalty points policy.
- **Authentication:** Protected.
- **Permissions:** `P019`, `P020`, `P021`.
- **Parameters (Body):**
  - Loyalty policy object (e.g., `pointsPerKsh`, `redemptionThreshold`).
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "policy": { ... } // The created/updated loyalty policy
    }
  }
  ```
- **Failure Response (400 Bad Request):**
  ```json
  {
    "success": false,
    "message": "Invalid loyalty policy data"
  }
  ```

---

#### `POST /api/v1/superuser/permissions/sync`

- **Description:** Synchronizes the permissions from the `permissions.js` config file into the database.
- **Authentication:** Protected.
- **Permissions:** `P111`.
- **Parameters:** None.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Permissions synchronized successfully"
  }
  ```
- **Failure Response (500 Internal Server Error):**
  ```json
  {
    "success": false,
    "message": "Synchronization failed"
  }
  ```

---

#### `GET /api/v1/superuser/permissions`

- **Description:** Retrieves all available permissions from the database.
- **Authentication:** Protected.
- **Permissions:** `P111`.
- **Parameters:** None.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": [ ... ] // List of permission objects
  }
  ```
- **Failure Response (500 Internal Server Error):**
  ```json
  {
    "success": false,
    "message": "Failed to retrieve permissions"
  }
  ```

---

#### `POST /api/v1/superuser/permissions`

- **Description:** Creates a new permission in the database.
- **Authentication:** Protected.
- **Permissions:** `P111`.
- **Parameters (Body):**
  - Permission object (e.g., `permissionNumber`, `description`, `roles`).
- **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "data": { ... } // The created permission object
  }
  ```
- **Failure Response (400 Bad Request):**
  ```json
  {
    "success": false,
    "message": "Permission number already exists"
  }
  ```

---

#### `PUT /api/v1/superuser/permissions/:id`

- **Description:** Updates an existing permission.
- **Authentication:** Protected.
- **Permissions:** `P111`.
- **Parameters (URL):**
  - `id` (string, required): The ID of the permission to update.
- **Parameters (Body):**
  - Fields to update (e.g., `description`, `roles`).
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": { ... } // The updated permission object
  }
  ```
- **Failure Response (404 Not Found):**
  ```json
  {
    "success": false,
    "message": "Permission not found"
  }
  ```

---

#### `DELETE /api/v1/superuser/permissions/:id`

- **Description:** Deletes a permission from the database.
- **Authentication:** Protected.
- **Permissions:** `P111`.
- **Parameters (URL):**
  - `id` (string, required): The ID of the permission to delete.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Permission deleted successfully"
  }
  ```
- **Failure Response (404 Not Found):**
  ```json
  {
    "success": false,
    "message": "Permission not found"
  }
  ```

### Sacco

This section covers endpoints for managing Saccos (Savings and Credit Co-operative Organizations).

---

#### `GET /api/v1/saccos`

- **Description:** Retrieves a list of all Saccos.
- **Authentication:** Protected.
- **Permissions:** `P023` (Add Sacco - permission reused for viewing).
- **Parameters:** None.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "sacco_id",
        "name": "Example Sacco",
        "status": "approved"
      }
    ]
  }
  ```
- **Failure Response (500 Internal Server Error):**
  ```json
  {
    "success": false,
    "message": "Failed to retrieve Saccos"
  }
  ```

---

#### `POST /api/v1/saccos`

- **Description:** Creates a new Sacco.
- **Authentication:** Protected.
- **Permissions:** `P023` (Add Sacco).
- **Parameters (Body):**
  - `name` (string, required): The name of the Sacco.
  - Other Sacco details (e.g., `registrationNumber`, `contactPerson`).
- **Socket Events:**
  - Emits `newSacco` with the Sacco data upon creation.
- **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "data": { ... } // The created Sacco object
  }
  ```
- **Failure Response (400 Bad Request):**
  ```json
  {
    "success": false,
    "message": "Sacco with this name already exists"
  }
  ```

---

#### `PUT /api/v1/saccos/:id`

- **Description:** Updates the details of a Sacco.
- **Authentication:** Protected.
- **Permissions:** `P024` (Edit Sacco details).
- **Parameters (URL):**
  - `id` (string, required): The ID of the Sacco to update.
- **Parameters (Body):**
  - Fields to update (e.g., `name`, `contactPerson`).
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": { ... } // The updated Sacco object
  }
  ```
- **Failure Response (404 Not Found):**
  ```json
  {
    "success": false,
    "message": "Sacco not found"
  }
  ```

---

#### `PUT /api/v1/saccos/:id/approve`

- **Description:** Approves a pending Sacco application.
- **Authentication:** Protected.
- **Permissions:** `P026` (Approve Sacco application).
- **Parameters (URL):**
  - `id` (string, required): The ID of the Sacco to approve.
- **Socket Events:**
  - Emits `saccoStatusUpdate` with the Sacco data.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "_id": "sacco_id",
      "status": "approved"
    }
  }
  ```
- **Failure Response (400 Bad Request):**
  ```json
  {
    "success": false,
    "message": "Sacco is not in pending state"
  }
  ```

---

#### `PUT /api/v1/saccos/:id/reject`

- **Description:** Rejects a pending Sacco application.
- **Authentication:** Protected.
- **Permissions:** `P027` (Reject Sacco application).
- **Parameters (URL):**
  - `id` (string, required): The ID of the Sacco to reject.
- **Parameters (Body):**
  - `reason` (string, required): The reason for rejection.
- **Socket Events:**
  - Emits `saccoStatusUpdate` with the Sacco data.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "_id": "sacco_id",
      "status": "rejected"
    }
  }
  ```
- **Failure Response (400 Bad Request):**
  ```json
  {
    "success": false,
    "message": "Reason for rejection is required"
  }
  ```

---

#### `DELETE /api/v1/saccos/:id`

- **Description:** Deletes a Sacco. (Note: The controller implementation is currently a placeholder).
- **Authentication:** Protected.
- **Permissions:** `P025` (Delete Sacco).
- **Parameters (URL):**
  - `id` (string, required): The ID of the Sacco to delete.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Sacco deleted successfully"
  }
  ```
- **Failure Response (400 Bad Request):**
  ```json
  {
    "success": false,
    "message": "Sacco has active trips and cannot be deleted"
  }
  ```

### Route

This section covers endpoints for managing transportation routes.

---

#### `GET /api/v1/routes`

- **Description:** Retrieves a list of available routes. Can be filtered by Sacco.
- **Authentication:** Public.
- **Permissions:** None.
- **Parameters (Query):**
  - `saccoId` (string, optional): The ID of a Sacco to filter routes by.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "route_id",
        "name": "Nairobi - Mombasa",
        "sacco": "sacco_id",
        "status": "finalized"
      }
    ]
  }
  ```
- **Failure Response (500 Internal Server Error):**
  ```json
  {
    "success": false,
    "message": "Failed to retrieve routes"
  }
  ```

---

#### `POST /api/v1/routes`

- **Description:** Creates a new route.
- **Authentication:** Protected.
- **Permissions:** Requires user to be part of a 'sacco' or 'support_staff'.
- **Parameters (Body):**
  - `name` (string, required): The name of the route (e.g., "City A - City B").
  - `sacco` (string, required): The ID of the Sacco this route belongs to.
  - `stops` (array of objects, optional): A list of stop points along the route.
- **Socket Events:**
  - Emits `newRoute` with the route data upon creation.
- **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "data": { ... } // The created route object
  }
  ```
- **Failure Response (400 Bad Request):**
  ```json
  {
    "success": false,
    "message": "Route name and Sacco are required"
  }
  ```

---

#### `PUT /api/v1/routes/:id`

- **Description:** Updates the details of a route.
- **Authentication:** Protected.
- **Permissions:** Requires user to be part of a 'sacco' or 'support_staff'.
- **Parameters (URL):**
  - `id` (string, required): The ID of the route to update.
- **Parameters (Body):**
  - Fields to update (e.g., `name`, `stops`).
- **Socket Events:**
  - Emits `routeUpdate` with the updated route data.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": { ... } // The updated route object
  }
  ```
- **Failure Response (404 Not Found):**
  ```json
  {
    "success": false,
    "message": "Route not found"
  }
  ```

---

#### `PUT /api/v1/routes/:id/finalize`

- **Description:** Finalizes a route, making it active and available for trips.
- **Authentication:** Protected.
- **Permissions:** Requires user to be part of a 'sacco' or 'support_staff'.
- **Parameters (URL):**
  - `id` (string, required): The ID of the route to finalize.
- **Socket Events:**
  - Emits `routeUpdate` with the updated route data.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "_id": "route_id",
      "status": "finalized"
    }
  }
  ```
- **Failure Response (400 Bad Request):**
  ```json
  {
    "success": false,
    "message": "Route must be in draft status to be finalized"
  }
  ```

---

#### `DELETE /api/v1/routes/:id`

- **Description:** Deletes a route.
- **Authentication:** Protected.
- **Permissions:** Requires user to be part of a 'sacco' or 'support_staff'.
- **Parameters (URL):**
  - `id` (string, required): The ID of the route to delete.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Route deleted successfully"
  }
  ```
- **Failure Response (400 Bad Request):**
  ```json
  {
    "success": false,
    "message": "Route has active trips and cannot be deleted"
  }
  ```

---

#### `POST /api/v1/routes/:id/fare-adjustment`

- **Description:** Adds a temporary or permanent fare adjustment to a specific route.
- **Authentication:** Protected.
- **Permissions:** Requires user to be part of a 'sacco'.
- **Parameters (URL):**
  - `id` (string, required): The ID of the route.
- **Parameters (Body):**
  - `multiplier` (number, required): The fare adjustment multiplier (e.g., 1.2 for a 20% increase).
  - `reason` (string, required): The reason for the adjustment.
  - `startDate` (date, optional): The start date for the adjustment.
  - `endDate` (date, optional): The end date for the adjustment.
- **Socket Events:**
  - Emits `fareUpdate` with the adjustment details.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": { ... } // The route object with the new fare adjustment
  }
  ```
- **Failure Response (400 Bad Request):**
  ```json
  {
    "success": false,
    "message": "Invalid fare adjustment data"
  }
  ```

### Vehicle

This section covers endpoints for managing vehicles within a Sacco.

---

#### `GET /api/v1/vehicles/:saccoId`

- **Description:** Retrieves all vehicles belonging to a specific Sacco.
- **Authentication:** Public.
- **Permissions:** None.
- **Parameters (URL):**
  - `saccoId` (string, required): The ID of the Sacco.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "vehicle_id",
        "plateNumber": "KDA 123X",
        "sacco": "sacco_id"
      }
    ]
  }
  ```
- **Failure Response (500 Internal Server Error):**
  ```json
  {
    "success": false,
    "message": "Failed to retrieve vehicles"
  }
  ```

---

#### `POST /api/v1/vehicles`

- **Description:** Creates a new vehicle.
- **Authentication:** Protected.
- **Permissions:** Requires user to be part of a 'sacco' or 'support_staff'.
- **Parameters (Body):**
  - `plateNumber` (string, required): The vehicle's license plate number.
  - `sacco` (string, required): The ID of the Sacco this vehicle belongs to.
  - `capacity` (number, required): The seating capacity of the vehicle.
- **Socket Events:**
  - Emits `newVehicle` with the vehicle data upon creation.
- **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "data": { ... } // The created vehicle object
  }
  ```
- **Failure Response (400 Bad Request):**
  ```json
  {
    "success": false,
    "message": "Plate number already exists"
  }
  ```

---

#### `PUT /api/v1/vehicles/:id`

- **Description:** Updates the details of a vehicle.
- **Authentication:** Protected.
- **Permissions:** Requires user to be part of a 'sacco' or 'support_staff'.
- **Parameters (URL):**
  - `id` (string, required): The ID of the vehicle to update.
- **Parameters (Body):**
  - Fields to update (e.g., `capacity`, `status`).
- **Socket Events:**
  - Emits `vehicleUpdate` with the updated vehicle data.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": { ... } // The updated vehicle object
  }
  ```
- **Failure Response (404 Not Found):**
  ```json
  {
    "success": false,
    "message": "Vehicle not found"
  }
  ```

---

#### `DELETE /api/v1/vehicles/:id`

- **Description:** Deletes a vehicle.
- **Authentication:** Protected.
- **Permissions:** Requires user to be part of a 'sacco' or 'support_staff'.
- **Parameters (URL):**
  - `id` (string, required): The ID of the vehicle to delete.
- **Socket Events:**
  - Emits `vehicleDeleted` with the vehicle ID.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Vehicle deleted successfully"
  }
  ```
- **Failure Response (400 Bad Request):**
  ```json
  {
    "success": false,
    "message": "Vehicle has active trips and cannot be deleted"
  }
  ```

### Driver

This section covers endpoints for managing drivers.

---

#### `GET /api/v1/drivers/:saccoId`

- **Description:** Retrieves all drivers associated with a specific Sacco.
- **Authentication:** Protected.
- **Permissions:** `P062`, `P086`.
- **Parameters (URL):**
  - `saccoId` (string, required): The ID of the Sacco.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "driver_id",
        "name": "Driver Name",
        "sacco": "sacco_id"
      }
    ]
  }
  ```
- **Failure Response (500 Internal Server Error):**
  ```json
  {
    "success": false,
    "message": "Failed to retrieve drivers"
  }
  ```

---

#### `POST /api/v1/drivers`

- **Description:** Onboards a new driver.
- **Authentication:** Protected.
- **Permissions:** `P062`, `P086`.
- **Parameters (Body):**
  - `name` (string, required): The driver's full name.
  - `phone` (string, required): The driver's phone number.
  - `licenseNumber` (string, required): The driver's license number.
  - `sacco` (string, required): The ID of the Sacco the driver is being onboarded to.
- **Socket Events:**
  - Emits `newDriver` with the driver data upon creation.
- **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "data": { ... } // The created driver object
  }
  ```
- **Failure Response (400 Bad Request):**
  ```json
  {
    "success": false,
    "message": "Driver with this license number already exists"
  }
  ```

---

#### `PUT /api/v1/drivers/:id`

- **Description:** Updates the details of a driver.
- **Authentication:** Protected.
- **Permissions:** `P064` (Update driver details).
- **Parameters (URL):**
  - `id` (string, required): The ID of the driver to update.
- **Parameters (Body):**
  - Fields to update (e.g., `phone`, `status`).
- **Socket Events:**
  - Emits `driverUpdate` with the updated driver data.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": { ... } // The updated driver object
  }
  ```
- **Failure Response (404 Not Found):**
  ```json
  {
    "success": false,
    "message": "Driver not found"
  }
  ```

---

#### `GET /api/v1/drivers/:id/performance`

- **Description:** Retrieves performance metrics for a specific driver.
- **Authentication:** Protected.
- **Permissions:** `P065` (View driver performance metrics).
- **Parameters (URL):**
  - `id` (string, required): The ID of the driver.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "driverId": "driver_id",
      "totalTrips": 50,
      "rating": 4.8,
      "incidents": 1
    }
  }
  ```
- **Failure Response (404 Not Found):**
  ```json
  {
    "success": false,
    "message": "Driver not found"
  }
  ```

### Trip

This section covers endpoints for managing trips.

---

#### `GET /api/v1/trips/:routeId`

- **Description:** Retrieves all available trips for a specific route.
- **Authentication:** Public.
- **Permissions:** None.
- **Parameters (URL):**
  - `routeId` (string, required): The ID of the route.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "trip_id",
        "route": "route_id",
        "vehicle": "vehicle_id",
        "departureTime": "2024-01-01T10:00:00.000Z",
        "status": "scheduled"
      }
    ]
  }
  ```
- **Failure Response (500 Internal Server Error):**
  ```json
  {
    "success": false,
    "message": "Failed to retrieve trips"
  }
  ```

---

#### `POST /api/v1/trips`

- **Description:** Creates a new trip.
- **Authentication:** Protected.
- **Permissions:** Requires 'sacco', 'driver', or 'support_staff' role.
- **Parameters (Body):**
  - `route` (string, required): The ID of the route for this trip.
  - `vehicle` (string, required): The ID of the vehicle for this trip.
  - `driver` (string, required): The ID of the driver for this trip.
  - `departureTime` (date, required): The scheduled departure time.
- **Socket Events:**
  - Emits `newTrip` with the trip data upon creation.
- **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "data": { ... } // The created trip object
  }
  ```
- **Failure Response (400 Bad Request):**
  ```json
  {
    "success": false,
    "message": "Vehicle or driver is already scheduled for another trip at this time"
  }
  ```

---

#### `PUT /api/v1/trips/:id/cancel`

- **Description:** Cancels a scheduled trip.
- **Authentication:** Protected.
- **Permissions:** Requires 'sacco', 'driver', or 'support_staff' role.
- **Parameters (URL):**
  - `id` (string, required): The ID of the trip to cancel.
- **Parameters (Body):**
  - `reason` (string, required): The reason for cancellation.
- **Socket Events:**
  - Emits `tripCancelled` with the trip ID and reason.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Trip canceled successfully"
  }
  ```
- **Failure Response (400 Bad Request):**
  ```json
  {
    "success": false,
    "message": "Trip has already departed and cannot be canceled"
  }
  ```

---

#### `PUT /api/v1/trips/:id/complete`

- **Description:** Marks a trip as completed.
- **Authentication:** Protected.
- **Permissions:** Requires 'sacco', 'driver', or 'support_staff' role.
- **Parameters (URL):**
  - `id` (string, required): The ID of the trip to complete.
- **Socket Events:**
  - Emits `tripCompleted` with the trip ID.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "_id": "trip_id",
      "status": "completed"
    }
  }
  ```
- **Failure Response (400 Bad Request):**
  ```json
  {
    "success": false,
    "message": "Trip is not in progress"
  }
  ```

### Queue

This section covers endpoints for managing trip queues for routes.

---

#### `GET /api/v1/queues/:routeId`

- **Description:** Retrieves the current trip queue for a specific route.
- **Authentication:** Public.
- **Permissions:** None.
- **Parameters (URL):**
  - `routeId` (string, required): The ID of the route.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "queue_entry_id",
        "trip": "trip_id",
        "position": 1
      }
    ]
  }
  ```
- **Failure Response (500 Internal Server Error):**
  ```json
  {
    "success": false,
    "message": "Failed to retrieve queue"
  }
  ```

---

#### `POST /api/v1/queues`

- **Description:** Adds a trip to the queue.
- **Authentication:** Protected.
- **Permissions:** Requires 'sacco' or 'support_staff' role.
- **Parameters (Body):**
  - `tripId` (string, required): The ID of the trip to add to the queue.
- **Socket Events:**
  - Emits `queueUpdate` with the updated queue data for the relevant route.
- **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "data": { ... } // The created queue entry object
  }
  ```
- **Failure Response (400 Bad Request):**
  ```json
  {
    "success": false,
    "message": "Trip is already in a queue"
  }
  ```

---

#### `DELETE /api/v1/queues/:id`

- **Description:** Removes a trip from the queue.
- **Authentication:** Protected.
- **Permissions:** Requires 'sacco' or 'support_staff' role.
- **Parameters (URL):**
  - `id` (string, required): The ID of the queue entry to remove.
- **Socket Events:**
  - Emits `queueUpdate` with the updated queue data for the relevant route.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Queue entry deleted successfully"
  }
  ```
- **Failure Response (404 Not Found):**
  ```json
  {
    "success": false,
    "message": "Queue entry not found"
  }
  ```

### Ticket

This section covers endpoints for creating and managing passenger tickets.

---

#### `POST /api/v1/tickets`

- **Description:** Creates a new ticket for a trip. This is typically done by a passenger.
- **Authentication:** Protected.
- **Permissions:** Any authenticated user can create a ticket for themselves.
- **Parameters (Body):**
  - `tripId` (string, required): The ID of the trip.
  - `seatNumber` (string, required): The desired seat number.
- **Socket Events:**
  - Emits `newTicket` with the ticket data.
- **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "data": { ... } // The created ticket object, including a QR code
  }
  ```
- **Failure Response (400 Bad Request):**
  ```json
  {
    "success": false,
    "message": "Seat is already booked"
  }
  ```

---

#### `GET /api/v1/tickets/:userId`

- **Description:** Retrieves all tickets belonging to a specific user.
- **Authentication:** Protected.
- **Permissions:** Users can view their own tickets. Support staff may have broader access.
- **Parameters (URL):**
  - `userId` (string, required): The ID of the user.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": [ ... ] // An array of ticket objects
  }
  ```
- **Failure Response (404 Not Found):**
  ```json
  {
    "success": false,
    "message": "User not found"
  }
  ```

---

#### `GET /api/v1/tickets/scan/:qrCode`

- **Description:** Scans a ticket's QR code to validate it.
- **Authentication:** Protected.
- **Permissions:** `queue_manager`, `driver`.
- **Parameters (URL):**
  - `qrCode` (string, required): The QR code data from the ticket.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": { ... } // The validated ticket object
  }
  ```
- **Failure Response (404 Not Found):**
  ```json
  {
    "success": false,
    "message": "Invalid or expired ticket"
  }
  ```

---

#### `PUT /api/v1/tickets/:id/status`

- **Description:** Updates the status of a ticket (e.g., to 'boarded', 'cancelled').
- **Authentication:** Protected.
- **Permissions:** `queue_manager`, `support_staff`, `driver`.
- **Parameters (URL):**
  - `id` (string, required): The ID of the ticket.
- **Parameters (Body):**
  - `status` (string, required): The new status.
- **Socket Events:**
  - Emits `ticketUpdate` with the updated ticket data.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": { ... } // The updated ticket object
  }
  ```
- **Failure Response (400 Bad Request):**
  ```json
  {
    "success": false,
    "message": "Invalid status transition"
  }
  ```

---

#### `PUT /api/v1/tickets/:id/reallocate`

- **Description:** Reallocates a passenger's ticket to a new trip.
- **Authentication:** Protected.
- **Permissions:** `support_staff`.
- **Parameters (URL):**
  - `id` (string, required): The ID of the ticket to reallocate.
- **Parameters (Body):**
  - `newTripId` (string, required): The ID of the new trip.
- **Socket Events:**
  - Emits `ticketReallocated` with the old and new ticket information.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": { ... } // The new, reallocated ticket object
  }
  ```
- **Failure Response (400 Bad Request):**
  ```json
  {
    "success": false,
    "message": "New trip is full or does not exist"
  }
  ```

### Payment

This section covers endpoints for handling payments.

---

#### `POST /api/v1/payments`

- **Description:** Initiates a payment process for a ticket or other service.
- **Authentication:** Protected.
- **Permissions:** Any authenticated user.
- **Parameters (Body):**
  - `ticketId` (string, required): The ID of the ticket being paid for.
  - `amount` (number, required): The payment amount.
  - `method` (string, required): The payment method (e.g., 'mpesa', 'card').
- **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "data": { ... } // The payment initiation response, e.g., a redirect URL or transaction ID
  }
  ```
- **Failure Response (400 Bad Request):**
  ```json
  {
    "success": false,
    "message": "Invalid payment details"
  }
  ```

---

#### `PUT /api/v1/payments/:id/confirm`

- **Description:** Confirms a payment. This endpoint is typically a webhook called by a payment gateway.
- **Authentication:** Public (security is usually handled by other means like IP whitelisting or signature verification).
- **Permissions:** None.
- **Parameters (URL):**
  - `id` (string, required): The ID of the payment transaction.
- **Parameters (Body):**
  - `status` (string, required): The new status from the payment gateway (e.g., 'completed', 'failed').
- **Socket Events:**
  - Emits `paymentConfirmed` with the payment status.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": { ... } // The updated payment object
  }
  ```
- **Failure Response (404 Not Found):**
  ```json
  {
    "success": false,
    "message": "Payment transaction not found"
  }
  ```

---

#### `GET /api/v1/payments/sacco/:saccoId`

- **Description:** Retrieves all payments for a specific Sacco.
- **Authentication:** Protected.
- **Permissions:** `sacco`, `support_staff`, `superuser`.
- **Parameters (URL):**
  - `saccoId` (string, required): The ID of the Sacco.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": [ ... ] // An array of payment objects
  }
  ```
- **Failure Response (500 Internal Server Error):**
  ```json
  {
    "success": false,
    "message": "Failed to retrieve payments"
  }
  ```

## Socket.IO Events

The server uses Socket.IO for real-time communication. Events are either broadcast globally, sent to specific rooms (e.g., a Sacco room, a user's private room), or handled on the server.

### Server-Side Listeners (Events the Server Receives)

-   **`connection`**:
    -   **Trigger**: A client successfully connects to the Socket.IO server.
    -   **Action**: The server logs the connection and emits a `connected` event back to the client.
-   **`vehicleLocationUpdate`**:
    -   **Trigger**: A client (e.g., a driver's app) sends an update on a vehicle's location.
    -   **Payload**: `(data)` - An object containing location information (e.g., `{ vehicleId: '...', latitude: '...', longitude: '...' }`).
    -   **Action**: The server broadcasts a `locationUpdate` event to other clients.
-   **`disconnect`**:
    -   **Trigger**: A client disconnects from the server.
    -   **Action**: The server logs the disconnection and emits a `userDisconnected` event to all clients.

### Client-Side Listeners (Events the Server Emits)

#### General Events
-   **`connected`**: Emitted to a client upon successful connection.
-   **`userDisconnected`**: Emitted globally when any user disconnects.
    -   **Payload**: `{ userId: socket.id }`
-   **`userRegistered`**: Emitted globally when a new user (passenger, Sacco admin, or superuser) is successfully registered.
    -   **Payload**: `{ user: object }` - The newly created user object.

#### Auth & User Management
-   **`mfaEnabled`**: Emitted to a specific user's room when they enable MFA.
    -   **Room**: `userId`
    -   **Payload**: `{ userId: string }`
-   **`staffCreated`**: Emitted globally when a superuser creates a support staff account.
    -   **Payload**: `{ staff: object }` - The new staff user object.
-   **`staffUpdated`**: Emitted globally when a support staff account is updated.
    -   **Payload**: `{ staff: object }` - The updated staff user object.
-   **`staffDeleted`**: Emitted globally when a support staff account is deleted.
    -   **Payload**: `{ staffId: string }`

#### Sacco & Vehicle Management
-   **`saccoCreated`**: Emitted globally when a new Sacco is registered.
    -   **Payload**: `{ sacco: object }` - The new Sacco object.
-   **`saccoStatusChanged`**: Emitted globally when a Sacco's status is changed (e.g., approved, rejected).
    -   **Payload**: `{ saccoId: string, status: string, reason?: string }`
-   **`vehicleCreated`**: Emitted globally when a new vehicle is added.
    -   **Payload**: `{ vehicle: object }`
-   **`vehicleUpdated`**: Emitted globally when vehicle details are updated.
    -   **Payload**: `{ vehicle: object }`
-   **`vehicleDeleted`**: Emitted globally when a vehicle is deleted.
    -   **Payload**: `{ vehicleId: string }`

#### Driver Management
-   **`driverCreated`**: Emitted globally when a new driver is registered.
    -   **Payload**: `{ driver: object }`
-   **`driverUpdated`**: Emitted globally when driver details are updated.
    -   **Payload**: `{ driver: object }`

#### Route, Trip, & Queue Management
-   **`routeCreated`**: Emitted globally when a new route is created.
    -   **Payload**: `{ route: object }`
-   **`routeUpdated`**: Emitted globally when a route is updated or finalized.
    -   **Payload**: `{ route: object }`
-   **`fareAdjusted`**: Emitted globally when a route's fare is adjusted.
    -   **Payload**: `{ routeId: string, adjustment: object }`
-   **`tripRegistered`**: Emitted globally when a new trip is registered.
    -   **Payload**: `{ trip: object }`
-   **`tripStatusChanged`**: Emitted globally when a trip's status changes (e.g., canceled, completed).
    -   **Payload**: `{ tripId: string, status: string, reason?: string }`
-   **`queueUpdated`**: Emitted globally when the vehicle queue for a route changes.
    -   **Payload**: `{ routeId: string }`
-   **`locationUpdate`**: Broadcast to clients (e.g., tracking dashboards) with new vehicle location data.
    -   **Payload**: `(data)` - The data received from the `vehicleLocationUpdate` event.

#### Ticket & Payment
-   **`ticketRegistered`**: Emitted globally when a new ticket is booked.
    -   **Payload**: `{ ticket: object }`
-   **`ticketStatusChanged`**: Emitted globally when a ticket's status changes (e.g., boarded, canceled).
    -   **Payload**: `{ ticketId: string, status: string }`
-   **`ticketsReallocated`**: Emitted globally when tickets are automatically reallocated from a canceled trip.
    -   **Payload**: `{ originalTripId: string, reason: string }`
-   **`ticketReallocated`**: Emitted globally when a single ticket is manually reallocated.
    -   **Payload**: `{ ticketId: string, newTripId: string }`
-   **`paymentConfirmed`**: Emitted globally when a payment is successfully completed.
    -   **Payload**: `{ payment: object }`
-   **`paymentFailed`**: Emitted globally when a payment fails.
    -   **Payload**: `{ payment: object }`

#### Support & Disputes
-   **`newInquiry`**: Emitted to the support staff room when a new inquiry is submitted.
    -   **Room**: `support_staff`
    -   **Payload**: `{ inquiry: object }`
-   **`inquiryResolved`**: Emitted to the support staff room when an inquiry is resolved.
    -   **Room**: `support_staff`
    -   **Payload**: `{ inquiry: object }`
-   **`inquiryEscalated`**: Emitted to the admins' room when an inquiry is escalated.
    -   **Room**: `admins`
    -   **Payload**: `{ inquiry: object, details: string }`

#### Policies & Discounts
-   **`discountCreated`**: Emitted to a Sacco's room when a new discount is created.
    -   **Room**: `saccoId`
    -   **Payload**: `{ discount: object }`
-   **`discountUpdated`**: Emitted to a Sacco's room when a discount is updated.
    -   **Room**: `saccoId`
    -   **Payload**: `{ discount: object }`
-   **`discountDeleted`**: Emitted to a Sacco's room when a discount is deleted.
    -   **Room**: `saccoId`
    -   **Payload**: `{ discountId: string }`
-   **`farePolicyUpdated`**: Emitted globally when the system-wide fare policy is updated.
    -   **Payload**: `{ policy: object }`
-   **`systemFeePolicyUpdated`**: Emitted globally when the system fee policy is updated.
    -   **Payload**: `{ policy: object }`
-   **`loyaltyPolicyUpdated`**: Emitted globally when the loyalty program policy is updated.
    -   **Payload**: `{ policy: object }`

#### Loyalty & Payroll
-   **`loyaltyUpdated`**: Emitted to a specific user's room when their loyalty points balance changes.
    -   **Room**: `userId`
    -   **Payload**: `{ loyalty: object }`
-   **`payrollProcessed`**: Emitted to relevant parties (owner, driver, Sacco) after a trip's payroll is processed.
    -   **Room**: `ownerId`, `driverId`, `saccoId`
    -   **Payload**: `{ payroll: object }`
-   **`payrollDisputeResolved`**: Emitted to relevant parties when a payroll dispute is resolved.
    -   **Room**: `ownerId`, `driverId`, `saccoId`
    -   **Payload**: `{ payroll: object }`

---
