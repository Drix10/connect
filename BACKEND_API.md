# Carbon Trade X - API Documentation

## Base URL

```
Development: http://localhost:3000
Production: https://api.carbontradeX.com
```

## API Version

```
v1
```

All endpoints are prefixed with `/api/v1`

---

## Table of Contents

1. [Authentication](#authentication)
2. [Health Checks](#health-checks)
3. [Error Responses](#error-responses)
4. [Rate Limiting](#rate-limiting)
5. [Security](#security)

---

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <access_token>
```

### Token Expiry

- **Access Token**: 1 hour
- **Refresh Token**: 7 days

---

## Health Checks

### 1. Basic Health Check

**Endpoint:** `GET /health`

**Description:** Basic health check to verify server is running

**Authentication:** None

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Status Codes:**

- `200 OK` - Server is healthy

---

### 2. Readiness Check

**Endpoint:** `GET /health/ready`

**Description:** Detailed health check including database and Redis status

**Authentication:** None

**Response (Healthy):**

```json
{
  "status": "ready",
  "database": "connected",
  "redis": "connected",
  "mode": "Local SQLite"
}
```

**Response (Unhealthy):**

```json
{
  "status": "not ready",
  "database": "disconnected",
  "redis": "connected"
}
```

**Status Codes:**

- `200 OK` - All services healthy
- `503 Service Unavailable` - One or more services unhealthy

---

### 3. Liveness Probe

**Endpoint:** `GET /health/live`

**Description:** Simple liveness probe for container orchestration

**Authentication:** None

**Response:**

```json
{
  "status": "alive"
}
```

**Status Codes:**

- `200 OK` - Server is alive

---

## Authentication Endpoints

### 1. Register User

**Endpoint:** `POST /api/v1/auth/register`

**Description:** Register a new user account

**Authentication:** None

**Rate Limit:** 5 requests per hour per IP

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe",
  "organization": "Acme Corp",
  "country": "India",
  "phone": "+91-9876543210"
}
```

**Required Fields:**

- `email` (string, valid email)
- `password` (string, min 8 chars, must contain uppercase, lowercase, number, special char)
- `name` (string, 2-255 chars)

**Optional Fields:**

- `organization` (string, max 255 chars)
- `country` (string, max 100 chars)
- `phone` (string, max 50 chars)

**Success Response (201 Created):**

```json
{
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "usr_1234567890",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user",
      "kycStatus": "not_started",
      "accountStatus": "active"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  }
}
```

**Error Responses:**

- `400 Bad Request` - Invalid input data
- `409 Conflict` - Email already registered
- `429 Too Many Requests` - Rate limit exceeded

**Error Examples:**

```json
{
  "error": "Email already registered"
}
```

```json
{
  "error": "Password must contain at least one uppercase letter"
}
```

---

### 2. Login

**Endpoint:** `POST /api/v1/auth/login`

**Description:** Authenticate user and receive access tokens

**Authentication:** None

**Rate Limit:** 5 requests per 15 minutes per IP

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Request Headers:**

```
User-Agent: Mozilla/5.0...
X-Fingerprint: device-fingerprint-hash (optional)
```

**Success Response (200 OK):**

```json
{
  "message": "Login successful",
  "data": {
    "user": {
      "id": "usr_1234567890",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user",
      "kycStatus": "approved",
      "accountStatus": "active",
      "emailVerified": true,
      "twoFactorEnabled": false
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  }
}
```

**2FA Required Response (200 OK):**

```json
{
  "message": "2FA required",
  "requiresTwoFactor": true,
  "userId": "usr_1234567890"
}
```

**Error Responses:**

- `401 Unauthorized` - Invalid credentials
- `403 Forbidden` - Account suspended
- `429 Too Many Requests` - Rate limit exceeded

---

### 3. Refresh Token

**Endpoint:** `POST /api/v1/auth/refresh`

**Description:** Get new access token using refresh token

**Authentication:** None (requires refresh token)

**Request Body:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Request Headers:**

```
User-Agent: Mozilla/5.0...
X-Fingerprint: device-fingerprint-hash (optional)
```

**Success Response (200 OK):**

```json
{
  "message": "Token refreshed",
  "data": {
    "user": {
      "id": "usr_1234567890",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  }
}
```

**Error Responses:**

- `401 Unauthorized` - Invalid or expired refresh token
- `403 Forbidden` - Device fingerprint mismatch

---

### 4. Logout

**Endpoint:** `POST /api/v1/auth/logout`

**Description:** Invalidate current session and tokens

**Authentication:** Required

**Request Headers:**

```
Authorization: Bearer <access_token>
```

**Success Response (200 OK):**

```json
{
  "message": "Logout successful"
}
```

**Error Responses:**

- `401 Unauthorized` - Invalid or missing token
- `500 Internal Server Error` - Logout failed

---

### 5. Request Password Reset

**Endpoint:** `POST /api/v1/auth/password-reset/request`

**Description:** Request password reset link via email

**Authentication:** None

**Rate Limit:** 3 requests per hour per IP

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Success Response (200 OK):**

```json
{
  "message": "If the email exists, a password reset link has been sent"
}
```

**Note:** Always returns success to prevent email enumeration attacks

**Error Responses:**

- `429 Too Many Requests` - Rate limit exceeded

---

### 6. Reset Password

**Endpoint:** `POST /api/v1/auth/password-reset/confirm`

**Description:** Reset password using token from email

**Authentication:** None

**Request Body:**

```json
{
  "token": "reset-token-from-email",
  "newPassword": "NewSecurePass123!"
}
```

**Success Response (200 OK):**

```json
{
  "message": "Password reset successful"
}
```

**Error Responses:**

- `400 Bad Request` - Invalid token or password requirements not met

**Error Examples:**

```json
{
  "error": "Invalid or expired reset token"
}
```

```json
{
  "error": "Password must be at least 8 characters long"
}
```

---

### 7. Enable Two-Factor Authentication (2FA)

**Endpoint:** `POST /api/v1/auth/2fa/enable`

**Description:** Initiate 2FA setup and get QR code

**Authentication:** Required

**Request Headers:**

```
Authorization: Bearer <access_token>
```

**Success Response (200 OK):**

```json
{
  "message": "2FA setup initiated",
  "data": {
    "secret": "JBSWY3DPEHPK3PXP",
    "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
  }
}
```

**Usage:**

1. Display QR code to user
2. User scans with authenticator app (Google Authenticator, Authy, etc.)
3. User enters code to verify (see next endpoint)

**Error Responses:**

- `401 Unauthorized` - Invalid or missing token
- `500 Internal Server Error` - 2FA setup failed

---

### 8. Verify and Complete 2FA Setup

**Endpoint:** `POST /api/v1/auth/2fa/verify`

**Description:** Verify 2FA code and complete setup

**Authentication:** Required

**Rate Limit:** 10 requests per 15 minutes per user

**Request Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "code": "123456"
}
```

**Success Response (200 OK):**

```json
{
  "message": "2FA enabled successfully"
}
```

**Error Responses:**

- `400 Bad Request` - Invalid 2FA code
- `401 Unauthorized` - Invalid or missing token
- `429 Too Many Requests` - Rate limit exceeded

---

### 9. Disable Two-Factor Authentication

**Endpoint:** `POST /api/v1/auth/2fa/disable`

**Description:** Disable 2FA for account

**Authentication:** Required

**Request Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "password": "CurrentPassword123!",
  "code": "123456"
}
```

**Success Response (200 OK):**

```json
{
  "message": "2FA disabled successfully"
}
```

**Error Responses:**

- `400 Bad Request` - Invalid password or 2FA code
- `401 Unauthorized` - Invalid or missing token

---

### 10. Get Current User

**Endpoint:** `GET /api/v1/auth/me`

**Description:** Get current authenticated user's information

**Authentication:** Required

**Request Headers:**

```
Authorization: Bearer <access_token>
```

**Success Response (200 OK):**

```json
{
  "data": {
    "userId": "usr_1234567890",
    "email": "user@example.com",
    "role": "user"
  }
}
```

**Error Responses:**

- `401 Unauthorized` - Invalid or missing token
- `500 Internal Server Error` - Failed to get user

---

## Error Responses

### Standard Error Format

All error responses follow this format:

```json
{
  "error": "Error message describing what went wrong"
}
```

### Common HTTP Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required or failed
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource already exists
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error
- `503 Service Unavailable` - Service temporarily unavailable

---

## Rate Limiting

### Rate Limit Headers

All responses include rate limit information:

```
RateLimit-Limit: 100
RateLimit-Remaining: 95
RateLimit-Reset: 1642234567
```

### Rate Limits by Endpoint

| Endpoint         | Limit        | Window     |
| ---------------- | ------------ | ---------- |
| General API      | 100 requests | 15 minutes |
| Registration     | 5 requests   | 1 hour     |
| Login            | 5 requests   | 15 minutes |
| Password Reset   | 3 requests   | 1 hour     |
| 2FA Verification | 10 requests  | 15 minutes |

### Rate Limit Exceeded Response (429)

```json
{
  "error": "Too many requests, please try again later"
}
```

---

## Security

### HTTPS Requirement (Production)

**⚠️ CRITICAL: Production deployments MUST use HTTPS**

- All production traffic must be served over HTTPS
- The API enforces HSTS (HTTP Strict Transport Security) via the `Strict-Transport-Security` header
- Plain HTTP requests should be rejected or redirected to HTTPS
- Enable HTTPS enforcement via environment configuration (e.g., `NODE_ENV=production` or `FORCE_HTTPS=true`)
- CORS allowed origins must use `https://` protocol in production (no `http://` origins)

**HSTS Header (Production):**

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

### Password Requirements

- Minimum 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)
- At least one special character (!@#$%^&\*(),.?":{}|<>)
- Maximum 128 characters

### Email Validation

- Must be valid email format
- Maximum 254 characters
- Must include domain with TLD (e.g., .com, .org)

### Security Headers

All responses include security headers:

- `Content-Security-Policy`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security` (HTTPS only, production)

### CORS

Allowed origins configured in environment variables.

- **Development:** `http://localhost:3001` (HTTP allowed)
- **Production:** Must use `https://` origins only

### Token Storage Security

**⚠️ IMPORTANT: Never store tokens in localStorage**

**Recommended Approaches:**

1. **HttpOnly Cookies (Recommended for Production)**
   - Server sets tokens in httpOnly, Secure cookies
   - Cookies are automatically sent with requests
   - Not accessible to JavaScript (XSS protection)
   - Example: `Set-Cookie: accessToken=...; HttpOnly; Secure; SameSite=Strict`

2. **Memory-Only Storage**
   - Store tokens in JavaScript memory (variables)
   - Tokens lost on page reload (requires re-authentication)
   - Highest security, no persistence

3. **Secure Session Storage + CSP**
   - Use sessionStorage with strict Content Security Policy
   - Better than localStorage but still accessible to JavaScript
   - Cleared when tab/window closes

**Never use localStorage or sessionStorage for production tokens** - they are vulnerable to XSS attacks.

---

## Request Examples

### Using cURL

#### Register

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "name": "John Doe"
  }'
```

#### Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

#### Get Current User

```bash
curl -X GET http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### Logout

```bash
curl -X POST http://localhost:3000/api/v1/auth/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Using JavaScript (Fetch)

#### Register

```javascript
const response = await fetch("http://localhost:3000/api/v1/auth/register", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: "user@example.com",
    password: "SecurePass123!",
    name: "John Doe",
  }),
});

const data = await response.json();
console.log(data);
```

#### Login with Secure Token Handling

```javascript
const response = await fetch("http://localhost:3000/api/v1/auth/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include", // Important: Include cookies
  body: JSON.stringify({
    email: "user@example.com",
    password: "SecurePass123!",
  }),
});

const data = await response.json();

// ⚠️ SECURITY NOTE: Do NOT store tokens in localStorage
// Recommended: Use httpOnly cookies (server-side) or memory-only storage
// For development/testing only, you can use memory variables:
let accessToken = data.data.accessToken; // Memory only, lost on reload
let refreshToken = data.data.refreshToken; // Memory only

// Production: Server should set httpOnly cookies instead
// No client-side token storage needed
```

#### Authenticated Request

```javascript
// If using httpOnly cookies (recommended):
const response = await fetch("http://localhost:3000/api/v1/auth/me", {
  method: "GET",
  credentials: "include", // Automatically sends cookies
});

// If using memory storage (development only):
const response = await fetch("http://localhost:3000/api/v1/auth/me", {
  method: "GET",
  headers: {
    Authorization: `Bearer ${accessToken}`, // From memory variable
  },
});

const data = await response.json();
console.log(data);
```

---

## Test Credentials

**⚠️ SECURITY NOTICE: Do not use shared credentials in production**

For development and testing, create test accounts using one of these methods:

### Method 1: Use Registration Endpoint

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-test@example.com",
    "password": "YourSecurePass123!",
    "name": "Test User"
  }'
```

### Method 2: Use Local Seed Scripts

```bash
# Run the database seed script
npm run prisma:seed

# This creates development users with unique credentials
# Check prisma/seed.ts for details
```

### Method 3: Create via Prisma Studio

```bash
# Open Prisma Studio GUI
npm run prisma:studio

# Navigate to Users table and create manually
```

**Important:**

- Never commit real credentials to version control
- Never share admin credentials in public documentation
- Use environment-specific test accounts
- Rotate credentials regularly

---

## Postman Collection

Import this collection to test all endpoints:

```json
{
  "info": {
    "name": "Carbon Trade X API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000/api/v1"
    },
    {
      "key": "accessToken",
      "value": ""
    }
  ]
}
```

---

## Changelog

### Version 1.0.0 (Current)

- Initial API release
- Authentication endpoints
- Health check endpoints
- Rate limiting
- 2FA support
- JWT-based authentication

---

## Support

For API support or questions:

- **Email:** support@carbontradeX.com
- **Documentation:** https://docs.carbontradeX.com
- **Status Page:** https://status.carbontradeX.com

---

## License

Copyright © 2024 Carbon Trade X. All rights reserved.
