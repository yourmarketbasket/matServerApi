# Superuser API Documentation

This document provides detailed information about the superuser registration and login process.

## Superuser Registration

Creates the initial superuser. This is a one-time operation protected by a server-level admin key.

- **Endpoint:** `POST /api/v1/superuser/register`
- **Method:** `POST`
- **Authentication:** Public (but requires `adminKey`)

### Payload

| Field      | Type   | Required | Description                                      |
| ---------- | ------ | -------- | ------------------------------------------------ |
| `adminKey` | string | Yes      | A secret key to authorize superuser creation.    |
| `userData` | object | Yes      | The user object for the new superuser.           |

**`userData` Object:**

| Field      | Type   | Required | Description                     |
| ---------- | ------ | -------- | ------------------------------- |
| `name`     | string | Yes      | The superuser's full name.      |
| `email`    | string | Yes      | The superuser's email address.  |
| `phone`    | string | Yes      | The superuser's phone number.   |
| `password` | string | Yes      | The superuser's password.       |

### Success Response (201 Created)

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "60d0fe4f5311236168a109cf",
      "name": "Super User",
      "email": "superuser@example.com",
      "role": "Superuser",
      "permissions": ["P001", "P002", ...],
      "approvedStatus": "approved"
    }
  }
}
```

### Failure Responses

- **401 Unauthorized**

  If the `adminKey` is invalid:
  ```json
  {
    "success": false,
    "message": "Invalid admin key. Superuser registration failed."
  }
  ```

- **400 Bad Request**

  If a superuser with the same email already exists:
  ```json
  {
    "success": false,
    "message": "A superuser with that email already exists."
  }
  ```

---

## Superuser Login

Logs in a superuser and returns a JWT token.

- **Endpoint:** `POST /api/v1/superuser/login`
- **Method:** `POST`
- **Authentication:** Public

### Payload

| Field        | Type   | Required | Description                                      |
| ------------ | ------ | -------- | ------------------------------------------------ |
| `emailOrPhone` | string | Yes      | The superuser's email address or phone number.   |
| `password`   | string | Yes      | The superuser's password.                        |
| `mfaCode`    | string | No       | The Multi-Factor Authentication code, if enabled. |

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "token": "your_jwt_token",
    "user": {
      "_id": "60d0fe4f5311236168a109cf",
      "name": "Super User",
      "email": "superuser@example.com",
      "role": "Superuser"
    }
  }
}
```

### Failure Response (401 Unauthorized)

```json
{
  "success": false,
  "message": "Invalid credentials or not a superuser."
}
```
