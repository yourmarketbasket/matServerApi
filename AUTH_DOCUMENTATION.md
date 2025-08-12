# Authentication API Documentation

This document provides detailed information about the signup and login process for different user roles in the system.

## Passenger

### Passenger Signup

Creates a new passenger account.

- **Endpoint:** `POST /api/v1/passengers/signup`
- **Method:** `POST`
- **Authentication:** Public

#### Payload

| Field           | Type   | Required | Description                                                  |
| --------------- | ------ | -------- | ------------------------------------------------------------ |
| `name`          | string | Yes      | The passenger's full name.                                   |
| `email`         | string | Yes      | The passenger's email address.                               |
| `phone`         | string | Yes      | The passenger's phone number.                                |
| `password`      | string | Yes      | The passenger's password.                                    |
| `verifiedToken` | string | Yes      | A JWT token obtained after successful OTP verification.      |
| `dob`           | date   | No       | The passenger's date of birth.                               |

#### Success Response (201 Created)

```json
{
  "success": true,
  "data": {
    "passenger": {
      "_id": "60d0fe4f5311236168a109ca",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "Passenger",
      "verified": {
        "email": true,
        "phone": false
      }
    }
  }
}
```

**Address Object Example:**
```json
{
  "fullAddress": "123 Main Street",
  "city": "Nairobi",
  "postalCode": "00100",
  "country": "Kenya"
}
```

#### Failure Responses

- **400 Bad Request**

  If the verification token is missing:
  ```json
  {
    "success": false,
    "message": "Verification token is required."
  }
  ```

- **400 Bad Request**

  If a passenger with the same email already exists:
  ```json
  {
    "success": false,
    "message": "Passenger with that email already exists."
  }
  ```

### Passenger Login

Logs in a passenger and returns a JWT token.

- **Endpoint:** `POST /api/v1/passengers/login`
- **Method:** `POST`
- **Authentication:** Public

#### Payload

| Field        | Type   | Required | Description                                    |
| ------------ | ------ | -------- | ---------------------------------------------- |
| `emailOrPhone` | string | Yes      | The passenger's email address or phone number. |
| `password`   | string | Yes      | The passenger's password.                      |

#### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "passenger": {
      "_id": "passenger_id",
      "name": "Passenger Name",
      "email": "passenger@example.com",
      "role": "Passenger"
    },
    "token": "your_jwt_token"
  }
}
```

#### Failure Responses

- **401 Unauthorized**

  If the credentials are invalid:
  ```json
  {
    "success": false,
    "message": "Invalid credentials"
  }
  ```

- **401 Unauthorized**

  If the account is locked:
  ```json
  {
    "success": false,
    "message": "Account is locked due to too many failed login attempts. Please try again in 5 minutes."
  }
  ```

---

## Sacco

### Sacco Signup

Registers a new Sacco. The Sacco account will be pending review until approved by a superuser.

- **Endpoint:** `POST /api/v1/saccos/signup`
- **Method:** `POST`
- **Authentication:** Public

#### Payload

| Field                         | Type   | Required | Description                                                  |
| ----------------------------- | ------ | -------- | ------------------------------------------------------------ |
| `name`                        | string | Yes      | The Sacco's official name.                                   |
| `email`                       | string | Yes      | The Sacco's contact email address.                           |
| `phone`                       | string | Yes      | The Sacco's contact phone number.                            |
| `password`                    | string | Yes      | The account password.                                        |
| `registrationNumber`          | string | Yes      | The Sacco's official registration number.                    |
| `byLawsDocument`              | string | Yes      | A URL to the Sacco's bylaws document.                        |
| `leadershipInfoDocument`      | string | Yes      | A URL to a document with information about the Sacco's leadership. |
| `registrationFeePaymentProof` | string | Yes      | A URL to the proof of payment for the registration fee.      |
| `address`                     | object | Yes      | The Sacco's physical address. See example below.             |
| `verifiedToken`               | string | Yes      | A JWT token obtained after successful OTP verification.      |

#### Success Response (201 Created)

```json
{
  "success": true,
  "data": {
    "sacco": {
      "_id": "60d0fe4f5311236168a109cb",
      "name": "Example Sacco",
      "email": "contact@examplesacco.com",
      "role": "Sacco",
      "approvedStatus": "pending"
    }
  }
}
```

#### Failure Responses

- **400 Bad Request**

  If the verification token is missing:
  ```json
  {
    "success": false,
    "message": "Verification token is required."
  }
  ```

- **400 Bad Request**

  If a Sacco with the same email already exists:
  ```json
  {
    "success": false,
    "message": "Sacco with that email already exists."
  }
  ```

### Sacco Login

Logs in a Sacco and returns a JWT token.

- **Endpoint:** `POST /api/v1/saccos/login`
- **Method:** `POST`
- **Authentication:** Public

#### Payload

| Field        | Type   | Required | Description                                  |
| ------------ | ------ | -------- | -------------------------------------------- |
| `emailOrPhone` | string | Yes      | The Sacco's email address or phone number.   |
| `password`   | string | Yes      | The Sacco's password.                        |

#### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "sacco": {
      "_id": "sacco_id",
      "name": "Sacco Name",
      "email": "sacco@example.com",
      "role": "Sacco"
    },
    "token": "your_jwt_token"
  }
}
```

#### Failure Responses

- **401 Unauthorized**

  If the credentials are invalid:
  ```json
  {
    "success": false,
    "message": "Invalid credentials"
  }
  ```

- **401 Unauthorized**

  If the account is not approved:
  ```json
  {
    "success": false,
    "message": "Your account is currently pending. Please contact support."
  }
  ```

- **401 Unauthorized**

  If the account is locked:
  ```json
  {
    "success": false,
    "message": "Account is locked. Please try again in 5 minutes."
  }
  ```

---

## Owner

### Owner Signup

Registers a new vehicle owner. The owner account will be pending review until approved by a superuser.

- **Endpoint:** `POST /api/v1/owners/signup`
- **Method:** `POST`
- **Authentication:** Public

#### Payload

| Field                       | Type   | Required | Description                                                  |
| --------------------------- | ------ | -------- | ------------------------------------------------------------ |
| `name`                      | string | Yes      | The owner's full name or business name.                      |
| `email`                     | string | Yes      | The owner's contact email address.                           |
| `phone`                     | string | Yes      | The owner's contact phone number.                            |
| `password`                  | string | Yes      | The account password.                                        |
| `idNumberOrBusinessRegNo`   | string | Yes      | The owner's National ID number or Business Registration number. |
| `kraPinCertificate`         | string | Yes      | A URL to the KRA PIN certificate document.                   |
| `saccoAffiliation`          | string | Yes      | The `_id` of the Sacco the owner is affiliated with.         |
| `verifiedToken`             | string | Yes      | A JWT token obtained after successful OTP verification.      |

#### Success Response (201 Created)

```json
{
  "success": true,
  "data": {
    "owner": {
      "_id": "60d0fe4f5311236168a109cc",
      "name": "Jane Smith",
      "email": "jane.smith@example.com",
      "role": "Owner",
      "approvedStatus": "pending"
    }
  }
}
```

#### Failure Responses

- **400 Bad Request**

  If the verification token is missing:
  ```json
  {
    "success": false,
    "message": "Verification token is required."
  }
  ```

- **400 Bad Request**

  If an owner with the same email already exists:
  ```json
  {
    "success": false,
    "message": "Owner with that email already exists."
  }
  ```

### Owner Login

Logs in an owner and returns a JWT token.

- **Endpoint:** `POST /api/v1/owners/login`
- **Method:** `POST`
- **Authentication:** Public

#### Payload

| Field        | Type   | Required | Description                                  |
| ------------ | ------ | -------- | -------------------------------------------- |
| `emailOrPhone` | string | Yes      | The owner's email address or phone number.   |
| `password`   | string | Yes      | The owner's password.                        |

#### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "owner": {
      "_id": "owner_id",
      "name": "Owner Name",
      "email": "owner@example.com",
      "role": "Owner"
    },
    "token": "your_jwt_token"
  }
}
```

#### Failure Responses

- **401 Unauthorized**

  If the credentials are invalid:
  ```json
  {
    "success": false,
    "message": "Invalid credentials"
  }
  ```

- **401 Unauthorized**

  If the account is not approved:
  ```json
  {
    "success": false,
    "message": "Your account is currently pending. Please contact support."
  }
  ```

- **401 Unauthorized**

  If the account is locked:
  ```json
  {
    "success": false,
    "message": "Account is locked. Please try again in 5 minutes."
  }
  ```

---

## Queue Manager

### Queue Manager Signup

Registers a new queue manager. The queue manager account will be pending review until approved by a superuser.

- **Endpoint:** `POST /api/v1/queue-managers/signup`
- **Method:** `POST`
- **Authentication:** Public

#### Payload

| Field            | Type   | Required | Description                                             |
| ---------------- | ------ | -------- | ------------------------------------------------------- |
| `name`           | string | Yes      | The queue manager's full name.                          |
| `email`          | string | Yes      | The queue manager's email address.                      |
| `phone`          | string | Yes      | The queue manager's phone number.                       |
| `password`       | string | Yes      | The account password.                                   |
| `idNumber`       | string | Yes      | The queue manager's National ID number.                 |
| `drivingLicense` | string | Yes      | The queue manager's driving license number.             |
| `dob`            | date   | Yes      | The queue manager's date of birth.                      |
| `verifiedToken`  | string | Yes      | A JWT token obtained after successful OTP verification. |

#### Success Response (201 Created)

```json
{
  "success": true,
  "data": {
    "queueManager": {
      "_id": "60d0fe4f5311236168a109cd",
      "name": "Mike Ross",
      "email": "mike.ross@example.com",
      "role": "QueueManager",
      "approvedStatus": "pending"
    }
  }
}
```

#### Failure Responses

- **400 Bad Request**

  If the verification token is missing:
  ```json
  {
    "success": false,
    "message": "Verification token is required."
  }
  ```

- **400 Bad Request**

  If a queue manager with the same email already exists:
  ```json
  {
    "success": false,
    "message": "QueueManager with that email already exists."
  }
  ```

### Queue Manager Login

Logs in a queue manager and returns a JWT token.

- **Endpoint:** `POST /api/v1/queue-managers/login`
- **Method:** `POST`
- **Authentication:** Public

#### Payload

| Field        | Type   | Required | Description                                          |
| ------------ | ------ | -------- | ---------------------------------------------------- |
| `emailOrPhone` | string | Yes      | The queue manager's email address or phone number.   |
| `password`   | string | Yes      | The queue manager's password.                        |

#### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "queueManager": {
      "_id": "queueManager_id",
      "name": "Queue Manager Name",
      "email": "queuemanager@example.com",
      "role": "QueueManager"
    },
    "token": "your_jwt_token"
  }
}
```

#### Failure Responses

- **401 Unauthorized**

  If the credentials are invalid:
  ```json
  {
    "success": false,
    "message": "Invalid credentials"
  }
  ```

- **401 Unauthorized**

  If the account is not approved:
  ```json
  {
    "success": false,
    "message": "Your account is currently pending. Please contact support."
  }
  ```

- **401 Unauthorized**

  If the account is locked:
  ```json
  {
    "success": false,
    "message": "Account is locked. Please try again in 5 minutes."
  }
  ```

---

## Driver

### Driver Signup

Registers a new driver. The driver account will be pending review until approved by a superuser.

- **Endpoint:** `POST /api/v1/drivers/signup`
- **Method:** `POST`
- **Authentication:** Public

#### Payload

| Field                  | Type   | Required | Description                                                  |
| ---------------------- | ------ | -------- | ------------------------------------------------------------ |
| `name`                 | string | Yes      | The driver's full name.                                      |
| `email`                | string | Yes      | The driver's email address.                                  |
| `phone`                | string | Yes      | The driver's phone number.                                   |
| `password`             | string | Yes      | The account password.                                        |
| `licenseNumber`        | string | Yes      | The driver's license number.                                 |
| `saccoId`              | string | Yes      | The `_id` of the Sacco the driver is affiliated with.        |
| `idNumber`             | string | Yes      | The driver's National ID number.                             |
| `idPhotoFront`         | string | Yes      | A URL to a photo of the front of the driver's ID.            |
| `idPhotoBack`          | string | Yes      | A URL to a photo of the back of the driver's ID.             |
| `drivingLicenseExpiry` | date   | Yes      | The expiry date of the driving license.                      |
| `drivingLicensePhoto`  | string | Yes      | A URL to a photo of the driving license.                     |
| `dob`                  | date   | Yes      | The driver's date of birth.                                  |
| `gender`               | string | Yes      | The driver's gender (`Male`, `Female`, or `Other`).          |
| `verifiedToken`        | string | Yes      | A JWT token obtained after successful OTP verification.      |

#### Success Response (201 Created)

```json
{
  "success": true,
  "data": {
    "driver": {
      "_id": "60d0fe4f5311236168a109ce",
      "name": "Harvey Specter",
      "email": "harvey.specter@example.com",
      "role": "Driver",
      "approvedStatus": "pending"
    }
  }
}
```

#### Failure Responses

- **400 Bad Request**

  If the verification token is missing:
  ```json
  {
    "success": false,
    "message": "Verification token is required."
  }
  ```

- **400 Bad Request**

  If a driver with the same email already exists:
  ```json
  {
    "success": false,
    "message": "Driver with that email already exists."
  }
  ```

### Driver Login

Logs in a driver and returns a JWT token.

- **Endpoint:** `POST /api/v1/drivers/login`
- **Method:** `POST`
- **Authentication:** Public

#### Payload

| Field        | Type   | Required | Description                                  |
| ------------ | ------ | -------- | -------------------------------------------- |
| `emailOrPhone` | string | Yes      | The driver's email address or phone number.  |
| `password`   | string | Yes      | The driver's password.                       |

#### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "driver": {
      "_id": "driver_id",
      "name": "Driver Name",
      "email": "driver@example.com",
      "role": "Driver"
    },
    "token": "your_jwt_token"
  }
}
```

#### Failure Responses

- **401 Unauthorized**

  If the credentials are invalid:
  ```json
  {
    "success": false,
    "message": "Invalid credentials"
  }
  ```

- **401 Unauthorized**

  If the account is not approved:
  ```json
  {
    "success": false,
    "message": "Your account is currently pending. Please contact support."
  }
  ```

- **401 Unauthorized**

  If the account is locked:
  ```json
  {
    "success": false,
    "message": "Account is locked. Please try again in 5 minutes."
  }
  ```
