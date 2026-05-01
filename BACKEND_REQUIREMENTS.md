# Backend Requirements Document

**Project:** Carbon Trade X - Production Backend  
**Purpose:** Replace 80% dummy/simulated features with real implementations  
**Status:** Planning Phase  
**Last Updated:** May 1, 2026

---

## Executive Summary

This document outlines the complete backend infrastructure requirements to transform Carbon Trade X from a demo MVP (20% real, 80% simulated) into a production-ready platform. The backend will replace localStorage with a robust database, implement real authentication, integrate payment processing, add real AI capabilities, and connect to carbon credit registries.

### Current State (Demo MVP)

**What's Real (20%):**

- ✅ CAD Trust API integration (live data)
- ✅ Frontend UI/UX (production-ready)
- ✅ localStorage persistence (browser-only)

**What's Fake (80%):**

- ❌ No backend server or database
- ❌ No user authentication
- ❌ No payment processing
- ❌ No real AI (just if-else rules)
- ❌ No KYC verification
- ❌ No real market data
- ❌ No registry submission

### Target State (Production)

**Backend Infrastructure:**

- ✅ Node.js/Express API server
- ✅ PostgreSQL database
- ✅ JWT authentication system
- ✅ Stripe/Razorpay payment gateway
- ✅ Real AI integration (OpenAI/Anthropic)
- ✅ KYC verification (Aadhaar/PAN)
- ✅ Market data APIs
- ✅ Registry API integrations

---

## Table of Contents

1. [System Architecture](#1-system-architecture)
2. [Database Design](#2-database-design)
3. [API Endpoints](#3-api-endpoints)
4. [Authentication & Authorization](#4-authentication--authorization)
5. [Payment Integration](#5-payment-integration)
6. [KYC Verification System](#6-kyc-verification-system)
7. [AI Integration](#7-ai-integration)
8. [Market Data Integration](#8-market-data-integration)
9. [Registry Integration](#9-registry-integration)
10. [File Storage](#10-file-storage)
11. [Email & SMS Notifications](#11-email--sms-notifications)
12. [Admin Dashboard](#12-admin-dashboard)
13. [Security & Compliance](#13-security--compliance)
14. [DevOps & Infrastructure](#14-devops--infrastructure)
15. [Cost Estimates](#15-cost-estimates)
16. [Implementation Timeline](#16-implementation-timeline)
17. [Team Requirements](#17-team-requirements)

---

## 1. System Architecture

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  Next.js 15 Frontend (Existing - No Changes Required)           │
└─────────────────────────────────────────────────────────────────┘
                              ↓ HTTPS/REST
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY LAYER                           │
│  - Rate Limiting                                                 │
│  - Request Validation                                            │
│  - JWT Verification                                              │
│  - CORS Handling                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                             │
│  Node.js + Express.js Backend API                                │
│  ┌──────────────┬──────────────┬──────────────┬──────────────┐  │
│  │ Auth Service │ Trading Svc  │ KYC Service  │ AI MRV Svc   │  │
│  └──────────────┴──────────────┴──────────────┴──────────────┘  │
│  ┌──────────────┬──────────────┬──────────────┬──────────────┐  │
│  │ Payment Svc  │ Registry Svc │ Market Data  │ Notification │  │
│  └──────────────┴──────────────┴──────────────┴──────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                       DATA LAYER                                 │
│  PostgreSQL Database (Primary)                                   │
│  Redis Cache (Session & Performance)                             │
│  S3/Cloud Storage (Documents & Files)                            │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                   EXTERNAL INTEGRATIONS                          │
│  ┌──────────────┬──────────────┬──────────────┬──────────────┐  │
│  │ CAD Trust    │ Stripe/      │ OpenAI/      │ Aadhaar/     │  │
│  │ API          │ Razorpay     │ Anthropic    │ PAN APIs     │  │
│  └──────────────┴──────────────┴──────────────┴──────────────┘  │
│  ┌──────────────┬──────────────┬──────────────┬──────────────┐  │
│  │ Verra        │ Gold         │ CCTS         │ Market Data  │  │
│  │ Registry     │ Standard     │ Registry     │ Providers    │  │
│  └──────────────┴──────────────┴──────────────┴──────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Technology Stack

**Backend Framework:**

- Node.js 20+ LTS
- Express.js 4.x
- TypeScript 5.x

**Database:**

- PostgreSQL 15+ (Primary database)
- Redis 7+ (Caching & sessions)

**Authentication:**

- JWT (JSON Web Tokens)
- bcrypt (Password hashing)
- Passport.js (OAuth strategies)

**Payment Processing:**

- Stripe (International)
- Razorpay (India-specific)

**AI Integration:**

- OpenAI API (GPT-4)
- Anthropic Claude API (Alternative)

**File Storage:**

- AWS S3 or Google Cloud Storage

**Email/SMS:**

- SendGrid or AWS SES (Email)
- Twilio or AWS SNS (SMS)

**Monitoring & Logging:**

- Winston (Logging)
- Sentry (Error tracking)
- Prometheus + Grafana (Metrics)

**DevOps:**

- Docker (Containerization)
- Kubernetes or AWS ECS (Orchestration)
- GitHub Actions or GitLab CI (CI/CD)

### 1.3 Deployment Architecture

**Production Environment:**

```
┌─────────────────────────────────────────────────────────────────┐
│                      LOAD BALANCER                               │
│  (AWS ALB / Google Cloud Load Balancer)                          │
└─────────────────────────────────────────────────────────────────┘
                    ↓                    ↓
┌──────────────────────────┐  ┌──────────────────────────┐
│   API Server Instance 1  │  │   API Server Instance 2  │
│   (Auto-scaling)         │  │   (Auto-scaling)         │
└──────────────────────────┘  └──────────────────────────┘
                    ↓                    ↓
┌─────────────────────────────────────────────────────────────────┐
│              PostgreSQL (Primary + Read Replicas)                │
└─────────────────────────────────────────────────────────────────┘
```

**Environments:**

- Development (Local)
- Staging (Pre-production testing)
- Production (Live)

---

## 2. Database Design

### 2.1 Database Schema Overview

The PostgreSQL database will replace localStorage and provide:

- Multi-user support
- Data integrity and relationships
- Transaction support
- Backup and recovery
- Scalability

### 2.2 Core Tables

#### 2.2.1 Users Table

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    organization VARCHAR(255),
    country VARCHAR(100),
    phone VARCHAR(20),

    -- KYC Status
    kyc_status VARCHAR(50) DEFAULT 'not_started'
        CHECK (kyc_status IN ('not_started', 'pending', 'approved', 'rejected')),
    kyc_submitted_at TIMESTAMP,
    kyc_approved_at TIMESTAMP,
    kyc_rejected_reason TEXT,

    -- Account Status
    account_status VARCHAR(50) DEFAULT 'active'
        CHECK (account_status IN ('active', 'suspended', 'deleted')),
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    email_verified_at TIMESTAMP,

    -- Security
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(255),

    -- Consent & Privacy
    consent_given BOOLEAN DEFAULT FALSE,
    consent_date TIMESTAMP,
    privacy_policy_version VARCHAR(20),

    -- API Access
    cad_trust_api_key VARCHAR(255),

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP,

    -- Indexes
    INDEX idx_users_email (email),
    INDEX idx_users_kyc_status (kyc_status),
    INDEX idx_users_created_at (created_at)
);
```

#### 2.2.2 KYC Documents Table

```sql
CREATE TABLE kyc_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Document Details
    document_type VARCHAR(50) NOT NULL
        CHECK (document_type IN ('aadhaar', 'pan', 'passport', 'driving_license', 'selfie', 'address_proof', 'business_registration')),
    document_number VARCHAR(100),

    -- File Storage
    file_url VARCHAR(500) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size INTEGER,
    file_type VARCHAR(100),

    -- Verification
    verification_status VARCHAR(50) DEFAULT 'pending'
        CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    verified_at TIMESTAMP,
    verified_by UUID REFERENCES users(id),
    rejection_reason TEXT,

    -- Metadata
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_kyc_user_id (user_id),
    INDEX idx_kyc_status (verification_status)
);
```

#### 2.2.3 Carbon Credits Table

```sql
CREATE TABLE carbon_credits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Registry Information
    registry_id VARCHAR(100) UNIQUE NOT NULL,
    registry VARCHAR(50) NOT NULL
        CHECK (registry IN ('Verra', 'GoldStandard', 'CCTS')),
    project_uid VARCHAR(255),

    -- Project Details
    project_name VARCHAR(500) NOT NULL,
    project_type VARCHAR(100),
    location VARCHAR(255),
    country VARCHAR(100),
    methodology VARCHAR(255),

    -- Credit Details
    vintage INTEGER NOT NULL,
    issuance_date DATE,
    total_volume DECIMAL(15, 2) NOT NULL,
    available_volume DECIMAL(15, 2) NOT NULL,

    -- Pricing
    base_price_per_tonne DECIMAL(10, 2) NOT NULL,
    current_price_per_tonne DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',

    -- Quality Assessment
    quality_score INTEGER CHECK (quality_score >= 0 AND quality_score <= 100),
    additionality_score INTEGER,
    permanence_score INTEGER,
    leakage_score INTEGER,

    -- Status
    status VARCHAR(50) DEFAULT 'available'
        CHECK (status IN ('available', 'reserved', 'sold', 'retired')),

    -- CAD Trust Integration
    cad_trust_synced BOOLEAN DEFAULT FALSE,
    cad_trust_last_sync TIMESTAMP,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_credits_registry_id (registry_id),
    INDEX idx_credits_registry (registry),
    INDEX idx_credits_status (status),
    INDEX idx_credits_vintage (vintage),
    INDEX idx_credits_quality_score (quality_score)
);
```

#### 2.2.4 Portfolios Table

```sql
CREATE TABLE portfolios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    credit_id UUID NOT NULL REFERENCES carbon_credits(id) ON DELETE RESTRICT,

    -- Purchase Details
    quantity DECIMAL(15, 2) NOT NULL CHECK (quantity > 0),
    purchase_price_per_tonne DECIMAL(10, 2) NOT NULL,
    total_purchase_price DECIMAL(15, 2) NOT NULL,
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Transaction Reference
    transaction_id UUID REFERENCES transactions(id),

    -- Status
    status VARCHAR(50) DEFAULT 'owned'
        CHECK (status IN ('owned', 'sold', 'retired')),
    sold_date TIMESTAMP,
    sold_price_per_tonne DECIMAL(10, 2),

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_portfolio_user_id (user_id),
    INDEX idx_portfolio_credit_id (credit_id),
    INDEX idx_portfolio_status (status),
    INDEX idx_portfolio_purchase_date (purchase_date),

    UNIQUE (user_id, credit_id, status)
);
```

#### 2.2.5 Transactions Table

```sql
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,

    -- Transaction Type
    transaction_type VARCHAR(50) NOT NULL
        CHECK (transaction_type IN ('buy', 'sell', 'deposit', 'withdrawal', 'refund')),

    -- Credit Information (for buy/sell)
    credit_id UUID REFERENCES carbon_credits(id),
    quantity DECIMAL(15, 2),
    price_per_tonne DECIMAL(10, 2),

    -- Financial Details
    amount DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',

    -- Payment Details
    payment_method VARCHAR(50)
        CHECK (payment_method IN ('stripe', 'razorpay', 'bank_transfer', 'wallet')),
    payment_gateway_transaction_id VARCHAR(255),
    payment_status VARCHAR(50) DEFAULT 'pending'
        CHECK (payment_status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),

    -- Status
    transaction_status VARCHAR(50) DEFAULT 'pending'
        CHECK (transaction_status IN ('pending', 'completed', 'failed', 'cancelled')),

    -- Metadata
    metadata JSONB,
    error_message TEXT,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,

    INDEX idx_transactions_user_id (user_id),
    INDEX idx_transactions_type (transaction_type),
    INDEX idx_transactions_status (transaction_status),
    INDEX idx_transactions_payment_status (payment_status),
    INDEX idx_transactions_created_at (created_at)
);
```

#### 2.2.6 Price History Table

```sql
CREATE TABLE price_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    credit_id UUID NOT NULL REFERENCES carbon_credits(id) ON DELETE CASCADE,

    -- Price Data
    price_per_tonne DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',

    -- Market Data
    volume_traded DECIMAL(15, 2),
    high_price DECIMAL(10, 2),
    low_price DECIMAL(10, 2),
    open_price DECIMAL(10, 2),
    close_price DECIMAL(10, 2),

    -- Source
    data_source VARCHAR(100),

    -- Timestamp
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date DATE NOT NULL,

    INDEX idx_price_history_credit_id (credit_id),
    INDEX idx_price_history_date (date),
    INDEX idx_price_history_recorded_at (recorded_at),

    UNIQUE (credit_id, date)
);
```

#### 2.2.7 AI MRV Analyses Table

```sql
CREATE TABLE ai_mrv_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Input
    project_id VARCHAR(255),
    project_description TEXT,
    credit_id UUID REFERENCES carbon_credits(id),

    -- Analysis Results
    researcher_findings JSONB,
    verifier_assessment JSONB,
    compliance_check JSONB,
    final_report JSONB,

    -- Scores
    overall_quality_score INTEGER CHECK (overall_quality_score >= 0 AND overall_quality_score <= 100),
    additionality_score INTEGER,
    permanence_score INTEGER,
    leakage_score INTEGER,

    -- AI Provider
    ai_provider VARCHAR(50) CHECK (ai_provider IN ('openai', 'anthropic')),
    ai_model VARCHAR(100),
    total_tokens_used INTEGER,
    cost_usd DECIMAL(10, 4),

    -- Status
    analysis_status VARCHAR(50) DEFAULT 'pending'
        CHECK (analysis_status IN ('pending', 'processing', 'completed', 'failed')),
    error_message TEXT,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    processing_time_seconds INTEGER,

    INDEX idx_mrv_user_id (user_id),
    INDEX idx_mrv_status (analysis_status),
    INDEX idx_mrv_created_at (created_at)
);
```

#### 2.2.8 Onboarding Progress Table

```sql
CREATE TABLE onboarding_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Registry
    registry VARCHAR(50) NOT NULL
        CHECK (registry IN ('verra', 'goldStandard', 'ccts')),

    -- Progress
    steps_completed JSONB NOT NULL DEFAULT '[]',
    completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),

    -- Submission
    submitted BOOLEAN DEFAULT FALSE,
    submitted_at TIMESTAMP,
    submission_id VARCHAR(255),

    -- Registry Response
    registry_status VARCHAR(50)
        CHECK (registry_status IN ('draft', 'submitted', 'under_review', 'approved', 'rejected')),
    registry_response JSONB,

    -- Documents
    documents JSONB,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_onboarding_user_id (user_id),
    INDEX idx_onboarding_registry (registry),
    INDEX idx_onboarding_status (registry_status),

    UNIQUE (user_id, registry)
);
```

#### 2.2.9 Sessions Table

```sql
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Session Data
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    refresh_token_hash VARCHAR(255),

    -- Device Information
    user_agent TEXT,
    ip_address VARCHAR(45),
    device_type VARCHAR(50),

    -- Status
    is_active BOOLEAN DEFAULT TRUE,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    last_activity_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_sessions_user_id (user_id),
    INDEX idx_sessions_token_hash (token_hash),
    INDEX idx_sessions_expires_at (expires_at)
);
```

#### 2.2.10 Audit Logs Table

```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,

    -- Action Details
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100),
    resource_id UUID,

    -- Request Details
    ip_address VARCHAR(45),
    user_agent TEXT,

    -- Changes
    old_values JSONB,
    new_values JSONB,

    -- Metadata
    metadata JSONB,

    -- Timestamp
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_audit_user_id (user_id),
    INDEX idx_audit_action (action),
    INDEX idx_audit_resource (resource_type, resource_id),
    INDEX idx_audit_created_at (created_at)
);
```

#### 2.2.11 Notifications Table

```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Notification Details
    type VARCHAR(50) NOT NULL
        CHECK (type IN ('email', 'sms', 'in_app', 'push')),
    category VARCHAR(50)
        CHECK (category IN ('transaction', 'kyc', 'onboarding', 'security', 'marketing', 'system')),

    -- Content
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,

    -- Delivery
    delivery_status VARCHAR(50) DEFAULT 'pending'
        CHECK (delivery_status IN ('pending', 'sent', 'delivered', 'failed', 'bounced')),
    sent_at TIMESTAMP,
    delivered_at TIMESTAMP,

    -- Read Status
    read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,

    -- Metadata
    metadata JSONB,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_notifications_user_id (user_id),
    INDEX idx_notifications_type (type),
    INDEX idx_notifications_status (delivery_status),
    INDEX idx_notifications_read (read),
    INDEX idx_notifications_created_at (created_at)
);
```

### 2.3 Database Relationships

```
users (1) ──────────── (N) portfolios
users (1) ──────────── (N) transactions
users (1) ──────────── (N) kyc_documents
users (1) ──────────── (N) ai_mrv_analyses
users (1) ──────────── (N) onboarding_progress
users (1) ──────────── (N) sessions
users (1) ──────────── (N) notifications

carbon_credits (1) ── (N) portfolios
carbon_credits (1) ── (N) transactions
carbon_credits (1) ── (N) price_history
carbon_credits (1) ── (N) ai_mrv_analyses

transactions (1) ───── (1) portfolios
```

### 2.4 Database Indexes Strategy

**Primary Indexes:**

- All primary keys (UUID)
- Foreign keys for relationships
- Unique constraints (email, registry_id, etc.)

**Performance Indexes:**

- User lookups: email, kyc_status
- Credit searches: registry_id, status, vintage
- Transaction queries: user_id, created_at, status
- Price history: credit_id, date
- Audit logs: user_id, action, created_at

### 2.5 Data Migration Strategy

**Phase 1: Schema Creation**

- Create all tables with proper constraints
- Set up indexes
- Configure foreign key relationships

**Phase 2: Data Migration from localStorage**

- Export existing localStorage data
- Transform to match new schema
- Import into PostgreSQL
- Validate data integrity

**Phase 3: Verification**

- Run data consistency checks
- Verify all relationships
- Test queries and performance

---

## 3. API Endpoints

### 3.1 API Design Principles

- RESTful architecture
- JSON request/response format
- JWT authentication for protected routes
- Consistent error handling
- Rate limiting
- API versioning (/api/v1/)

### 3.2 Authentication Endpoints

#### POST /api/v1/auth/signup

**Description:** Register a new user account

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "name": "John Doe",
  "organization": "Green Corp",
  "country": "India"
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "kycStatus": "not_started"
    },
    "token": "jwt_token_here",
    "refreshToken": "refresh_token_here"
  }
}
```

**Validation:**

- Email format validation
- Password strength (min 8 chars, uppercase, lowercase, number, special char)
- Duplicate email check
- Rate limiting: 5 requests per hour per IP

---

#### POST /api/v1/auth/login

**Description:** Authenticate user and get JWT token

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "kycStatus": "approved"
    },
    "token": "jwt_token_here",
    "refreshToken": "refresh_token_here"
  }
}
```

**Error Responses:**

- 401: Invalid credentials
- 403: Account suspended
- 429: Too many login attempts

---

#### POST /api/v1/auth/refresh

**Description:** Refresh JWT token using refresh token

**Request Body:**

```json
{
  "refreshToken": "refresh_token_here"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "token": "new_jwt_token_here",
    "refreshToken": "new_refresh_token_here"
  }
}
```

---

#### POST /api/v1/auth/logout

**Description:** Invalidate current session

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

#### POST /api/v1/auth/forgot-password

**Description:** Request password reset email

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

---

#### POST /api/v1/auth/reset-password

**Description:** Reset password using token from email

**Request Body:**

```json
{
  "token": "reset_token_from_email",
  "newPassword": "NewSecurePassword123!"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Password reset successful"
}
```

---

### 3.3 User Profile Endpoints

#### GET /api/v1/users/me

**Description:** Get current user profile

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "organization": "Green Corp",
    "country": "India",
    "kycStatus": "approved",
    "accountStatus": "active",
    "emailVerified": true,
    "consentGiven": true,
    "createdAt": "2026-01-15T10:30:00Z"
  }
}
```

---

#### PUT /api/v1/users/me

**Description:** Update user profile

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Request Body:**

```json
{
  "name": "John Smith",
  "organization": "Green Energy Corp",
  "phone": "+91-9876543210",
  "cadTrustApiKey": "optional_api_key"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Smith",
    "organization": "Green Energy Corp",
    "phone": "+91-9876543210"
  }
}
```

---

#### POST /api/v1/users/me/change-password

**Description:** Change user password

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Request Body:**

```json
{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewPassword456!"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

### 3.4 KYC Endpoints

#### POST /api/v1/kyc/documents

**Description:** Upload KYC document

**Headers:**

```
Authorization: Bearer jwt_token_here
Content-Type: multipart/form-data
```

**Request Body (Form Data):**

```
documentType: "aadhaar"
documentNumber: "1234-5678-9012"
file: [binary file data]
```

**Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "documentType": "aadhaar",
    "documentNumber": "1234-****-9012",
    "fileName": "aadhaar_front.jpg",
    "verificationStatus": "pending",
    "uploadedAt": "2026-05-01T10:30:00Z"
  }
}
```

---

#### GET /api/v1/kyc/documents

**Description:** Get all uploaded KYC documents

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "documentType": "aadhaar",
      "documentNumber": "1234-****-9012",
      "verificationStatus": "verified",
      "uploadedAt": "2026-05-01T10:30:00Z",
      "verifiedAt": "2026-05-02T14:20:00Z"
    },
    {
      "id": "uuid",
      "documentType": "pan",
      "documentNumber": "ABCDE****F",
      "verificationStatus": "pending",
      "uploadedAt": "2026-05-01T10:35:00Z"
    }
  ]
}
```

---

#### POST /api/v1/kyc/verify/aadhaar

**Description:** Verify Aadhaar number via API

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Request Body:**

```json
{
  "aadhaarNumber": "123456789012",
  "consent": true
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "verified": true,
    "name": "John Doe",
    "dob": "1990-01-15",
    "address": "Redacted for privacy"
  }
}
```

---

#### POST /api/v1/kyc/verify/pan

**Description:** Verify PAN number via API

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Request Body:**

```json
{
  "panNumber": "ABCDE1234F",
  "consent": true
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "verified": true,
    "name": "JOHN DOE",
    "panNumber": "ABCDE1234F"
  }
}
```

---

#### POST /api/v1/kyc/submit

**Description:** Submit KYC for manual review

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "KYC submitted for review",
  "data": {
    "kycStatus": "pending",
    "submittedAt": "2026-05-01T11:00:00Z",
    "estimatedReviewTime": "24-48 hours"
  }
}
```

---

### 3.5 Carbon Credits Endpoints

#### GET /api/v1/credits

**Description:** Get list of available carbon credits with filtering and pagination

**Headers:**

```
Authorization: Bearer jwt_token_here (optional for public credits)
```

**Query Parameters:**

```
?registry=Verra
&vintage=2023
&minQualityScore=80
&minPrice=1000
&maxPrice=5000
&page=1
&limit=20
&sortBy=qualityScore
&sortOrder=desc
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "credits": [
      {
        "id": "uuid",
        "registryId": "VCS-934",
        "registry": "Verra",
        "projectName": "Amazon Rainforest Conservation",
        "location": "Brazil",
        "methodology": "VM0015",
        "vintage": 2023,
        "availableVolume": 10000,
        "pricePerTonne": 2500,
        "qualityScore": 92,
        "status": "available"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

---

#### GET /api/v1/credits/:id

**Description:** Get detailed information about a specific credit

**Headers:**

```
Authorization: Bearer jwt_token_here (optional)
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "registryId": "VCS-934",
    "registry": "Verra",
    "projectUid": "verra-vcs-934",
    "projectName": "Amazon Rainforest Conservation",
    "projectType": "Forestry",
    "location": "Brazil",
    "country": "Brazil",
    "methodology": "VM0015",
    "vintage": 2023,
    "issuanceDate": "2023-06-15",
    "totalVolume": 50000,
    "availableVolume": 10000,
    "basePricePerTonne": 2500,
    "currentPricePerTonne": 2500,
    "currency": "INR",
    "qualityScore": 92,
    "additionalityScore": 90,
    "permanenceScore": 95,
    "leakageScore": 91,
    "status": "available",
    "cadTrustSynced": true,
    "cadTrustLastSync": "2026-05-01T08:00:00Z"
  }
}
```

---

#### GET /api/v1/credits/:id/price-history

**Description:** Get price history for a specific credit

**Headers:**

```
Authorization: Bearer jwt_token_here (optional)
```

**Query Parameters:**

```
?startDate=2026-04-01
&endDate=2026-05-01
&interval=daily
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "creditId": "uuid",
    "registryId": "VCS-934",
    "priceHistory": [
      {
        "date": "2026-04-01",
        "pricePerTonne": 2450,
        "volumeTraded": 150,
        "highPrice": 2480,
        "lowPrice": 2420,
        "openPrice": 2450,
        "closePrice": 2460
      },
      {
        "date": "2026-04-02",
        "pricePerTonne": 2470,
        "volumeTraded": 200,
        "highPrice": 2500,
        "lowPrice": 2450,
        "openPrice": 2460,
        "closePrice": 2470
      }
    ]
  }
}
```

---

#### POST /api/v1/credits/search

**Description:** Search credits by registry ID or project UID (integrates with CAD Trust)

**Headers:**

```
Authorization: Bearer jwt_token_here (optional)
```

**Request Body:**

```json
{
  "query": "VCS-934"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "credit": {
      "id": "uuid",
      "registryId": "VCS-934",
      "projectName": "Amazon Rainforest Conservation",
      "location": "Brazil",
      "methodology": "VM0015",
      "vintage": 2023,
      "qualityScore": 92
    },
    "cadTrustData": {
      "projectId": "verra-vcs-934",
      "projectName": "Amazon Rainforest Conservation",
      "registryOfOrigin": "Verra",
      "projectStatus": "Active",
      "dataSource": "live"
    }
  }
}
```

---

### 3.6 Portfolio Endpoints

#### GET /api/v1/portfolio

**Description:** Get user's portfolio of owned credits

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "portfolio": {
      "credits": [
        {
          "id": "uuid",
          "creditId": "uuid",
          "registryId": "VCS-934",
          "projectName": "Amazon Rainforest Conservation",
          "quantity": 100,
          "purchasePricePerTonne": 2400,
          "totalPurchasePrice": 240000,
          "currentPricePerTonne": 2500,
          "currentValue": 250000,
          "profitLoss": 10000,
          "profitLossPercentage": 4.17,
          "purchaseDate": "2026-04-15T10:30:00Z",
          "status": "owned"
        }
      ],
      "totalValue": 250000,
      "totalVolume": 100,
      "totalInvestment": 240000,
      "totalProfitLoss": 10000,
      "profitLossPercentage": 4.17
    }
  }
}
```

---

#### GET /api/v1/portfolio/history

**Description:** Get portfolio transaction history

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Query Parameters:**

```
?page=1
&limit=20
&startDate=2026-01-01
&endDate=2026-05-01
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "uuid",
        "type": "buy",
        "creditId": "uuid",
        "registryId": "VCS-934",
        "quantity": 100,
        "pricePerTonne": 2400,
        "totalAmount": 240000,
        "transactionDate": "2026-04-15T10:30:00Z",
        "status": "completed"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 5,
      "totalPages": 1
    }
  }
}
```

---

### 3.7 Trading Endpoints

#### POST /api/v1/trading/buy

**Description:** Purchase carbon credits

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Request Body:**

```json
{
  "creditId": "uuid",
  "quantity": 100,
  "paymentMethod": "razorpay"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "transaction": {
      "id": "uuid",
      "type": "buy",
      "creditId": "uuid",
      "quantity": 100,
      "pricePerTonne": 2500,
      "totalAmount": 250000,
      "paymentStatus": "pending",
      "paymentGatewayUrl": "https://razorpay.com/checkout/..."
    }
  }
}
```

**Flow:**

1. Validate credit availability
2. Reserve credit quantity
3. Create transaction record
4. Initiate payment gateway
5. Return payment URL
6. Handle webhook for payment confirmation
7. Update portfolio on success

---

#### POST /api/v1/trading/sell

**Description:** Sell carbon credits from portfolio

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Request Body:**

```json
{
  "portfolioId": "uuid",
  "quantity": 50
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "transaction": {
      "id": "uuid",
      "type": "sell",
      "creditId": "uuid",
      "quantity": 50,
      "pricePerTonne": 2600,
      "totalAmount": 130000,
      "status": "completed",
      "completedAt": "2026-05-01T14:30:00Z"
    }
  }
}
```

---

#### POST /api/v1/trading/payment-webhook

**Description:** Handle payment gateway webhooks (Stripe/Razorpay)

**Headers:**

```
X-Webhook-Signature: signature_from_gateway
```

**Request Body (from payment gateway):**

```json
{
  "event": "payment.success",
  "transactionId": "uuid",
  "paymentGatewayTransactionId": "pay_xyz123",
  "amount": 250000,
  "status": "completed"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Webhook processed"
}
```

**Processing:**

1. Verify webhook signature
2. Find transaction by ID
3. Update transaction status
4. Add credit to user portfolio
5. Update credit available volume
6. Send confirmation email/SMS
7. Create audit log

---

### 3.8 AI MRV Endpoints

#### POST /api/v1/ai-mrv/analyze

**Description:** Analyze carbon project using AI agents

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Request Body:**

```json
{
  "projectId": "VCS-934",
  "projectDescription": "Optional detailed description if projectId not found"
}
```

**Response (202 Accepted):**

```json
{
  "success": true,
  "data": {
    "analysisId": "uuid",
    "status": "processing",
    "message": "Analysis started. Use the analysisId to check status."
  }
}
```

---

#### GET /api/v1/ai-mrv/analyze/:analysisId

**Description:** Get AI MRV analysis status and results

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Response (200 OK - Processing):**

```json
{
  "success": true,
  "data": {
    "analysisId": "uuid",
    "status": "processing",
    "currentAgent": "verifier",
    "progress": 50
  }
}
```

**Response (200 OK - Completed):**

```json
{
  "success": true,
  "data": {
    "analysisId": "uuid",
    "status": "completed",
    "projectId": "VCS-934",
    "researcherFindings": {
      "projectData": {
        "projectName": "Amazon Rainforest Conservation",
        "location": "Brazil",
        "methodology": "VM0015"
      },
      "dataSource": "live"
    },
    "verifierAssessment": {
      "additionalityScore": 90,
      "permanenceScore": 95,
      "leakageScore": 91,
      "notes": "Strong additionality due to baseline scenario..."
    },
    "complianceCheck": {
      "verraCompliant": true,
      "goldStandardCompliant": true,
      "issues": []
    },
    "finalReport": {
      "qualityScore": 92,
      "strengths": [
        "High permanence due to legal protection",
        "Strong community engagement"
      ],
      "weaknesses": ["Limited monitoring frequency"],
      "recommendations": ["Increase monitoring to quarterly intervals"]
    },
    "aiProvider": "openai",
    "aiModel": "gpt-4",
    "totalTokensUsed": 5420,
    "costUsd": 0.27,
    "processingTimeSeconds": 45,
    "completedAt": "2026-05-01T15:30:00Z"
  }
}
```

---

#### GET /api/v1/ai-mrv/history

**Description:** Get user's AI MRV analysis history

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Query Parameters:**

```
?page=1
&limit=20
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "analyses": [
      {
        "id": "uuid",
        "projectId": "VCS-934",
        "qualityScore": 92,
        "status": "completed",
        "createdAt": "2026-05-01T15:00:00Z",
        "completedAt": "2026-05-01T15:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 8,
      "totalPages": 1
    }
  }
}
```

---

### 3.9 Onboarding Endpoints

#### GET /api/v1/onboarding/:registry

**Description:** Get onboarding progress for a specific registry

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Path Parameters:**

- registry: "verra" | "goldStandard" | "ccts"

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "registry": "verra",
    "stepsCompleted": ["create_account", "upload_project_description"],
    "completionPercentage": 40,
    "submitted": false,
    "registryStatus": "draft",
    "documents": [
      {
        "type": "project_description",
        "fileName": "PD_v1.pdf",
        "uploadedAt": "2026-04-20T10:00:00Z"
      }
    ]
  }
}
```

---

#### PUT /api/v1/onboarding/:registry

**Description:** Update onboarding progress

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Request Body:**

```json
{
  "stepsCompleted": [
    "create_account",
    "upload_project_description",
    "submit_methodology"
  ],
  "completionPercentage": 60
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "registry": "verra",
    "stepsCompleted": [
      "create_account",
      "upload_project_description",
      "submit_methodology"
    ],
    "completionPercentage": 60
  }
}
```

---

#### POST /api/v1/onboarding/:registry/submit

**Description:** Submit onboarding to registry

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Request Body:**

```json
{
  "finalDocuments": ["doc_id_1", "doc_id_2"]
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "registry": "verra",
    "submitted": true,
    "submittedAt": "2026-05-01T16:00:00Z",
    "submissionId": "VERRA-SUB-2026-001234",
    "registryStatus": "submitted",
    "estimatedReviewTime": "4-6 weeks"
  }
}
```

---

#### POST /api/v1/onboarding/:registry/documents

**Description:** Upload onboarding document

**Headers:**

```
Authorization: Bearer jwt_token_here
Content-Type: multipart/form-data
```

**Request Body (Form Data):**

```
documentType: "project_description"
file: [binary file data]
```

**Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "documentId": "uuid",
    "documentType": "project_description",
    "fileName": "PD_v1.pdf",
    "fileSize": 2048576,
    "uploadedAt": "2026-05-01T16:30:00Z"
  }
}
```

---

### 3.10 Admin Endpoints

#### GET /api/v1/admin/users

**Description:** Get list of all users (admin only)

**Headers:**

```
Authorization: Bearer admin_jwt_token_here
```

**Query Parameters:**

```
?page=1
&limit=50
&kycStatus=pending
&accountStatus=active
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "uuid",
        "email": "user@example.com",
        "name": "John Doe",
        "kycStatus": "pending",
        "accountStatus": "active",
        "createdAt": "2026-04-01T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 1250,
      "totalPages": 25
    }
  }
}
```

---

#### PUT /api/v1/admin/kyc/:userId/approve

**Description:** Approve user KYC (admin only)

**Headers:**

```
Authorization: Bearer admin_jwt_token_here
```

**Request Body:**

```json
{
  "notes": "All documents verified successfully"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "userId": "uuid",
    "kycStatus": "approved",
    "approvedAt": "2026-05-01T17:00:00Z",
    "approvedBy": "admin_uuid"
  }
}
```

---

#### PUT /api/v1/admin/kyc/:userId/reject

**Description:** Reject user KYC (admin only)

**Headers:**

```
Authorization: Bearer admin_jwt_token_here
```

**Request Body:**

```json
{
  "reason": "Aadhaar document is not clear. Please re-upload."
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "userId": "uuid",
    "kycStatus": "rejected",
    "rejectedAt": "2026-05-01T17:00:00Z",
    "rejectedBy": "admin_uuid",
    "reason": "Aadhaar document is not clear. Please re-upload."
  }
}
```

---

#### GET /api/v1/admin/transactions

**Description:** Get all transactions (admin only)

**Headers:**

```
Authorization: Bearer admin_jwt_token_here
```

**Query Parameters:**

```
?page=1
&limit=50
&status=completed
&startDate=2026-04-01
&endDate=2026-05-01
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "uuid",
        "userId": "uuid",
        "userName": "John Doe",
        "type": "buy",
        "amount": 250000,
        "status": "completed",
        "createdAt": "2026-04-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 3420,
      "totalPages": 69
    },
    "summary": {
      "totalVolume": 85600000,
      "totalTransactions": 3420,
      "averageTransactionSize": 25029
    }
  }
}
```

---

### 3.11 Error Response Format

All API errors follow a consistent format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": {
      "field": "email",
      "value": "invalid-email"
    }
  }
}
```

**Common Error Codes:**

- `VALIDATION_ERROR`: Input validation failed
- `AUTHENTICATION_ERROR`: Invalid or missing JWT token
- `AUTHORIZATION_ERROR`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `CONFLICT`: Resource already exists
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `INTERNAL_SERVER_ERROR`: Server error
- `EXTERNAL_API_ERROR`: External service error (CAD Trust, payment gateway, etc.)

---

## 4. Authentication & Authorization

### 4.1 Authentication Strategy

**JWT (JSON Web Tokens):**

- Access tokens: Short-lived (15 minutes)
- Refresh tokens: Long-lived (7 days)
- Stored in httpOnly cookies or Authorization header
- Signed with RS256 algorithm

**Password Security:**

- bcrypt hashing with salt rounds = 12
- Minimum password requirements:
  - 8 characters minimum
  - At least 1 uppercase letter
  - At least 1 lowercase letter
  - At least 1 number
  - At least 1 special character
- Password history: Prevent reuse of last 5 passwords

**Session Management:**

- Store active sessions in database
- Support multiple concurrent sessions
- Ability to revoke specific sessions
- Automatic session cleanup for expired tokens

### 4.2 OAuth Integration (Future)

**Supported Providers:**

- Google OAuth 2.0
- GitHub OAuth
- LinkedIn OAuth

**Implementation:**

- Passport.js strategies
- Link OAuth accounts to existing users
- Create new users from OAuth profiles

### 4.3 Two-Factor Authentication (2FA)

**TOTP (Time-based One-Time Password):**

- Use speakeasy library
- Generate QR code for authenticator apps
- Backup codes for account recovery
- Optional for users, mandatory for admins

### 4.4 Authorization Levels

**User Roles:**

```typescript
enum UserRole {
  USER = "user", // Regular user
  VERIFIED_USER = "verified_user", // KYC approved user
  ADMIN = "admin", // Platform administrator
  SUPER_ADMIN = "super_admin", // Full system access
}
```

**Permission Matrix:**

| Action                | User | Verified User | Admin | Super Admin |
| --------------------- | ---- | ------------- | ----- | ----------- |
| View credits          | ✅   | ✅            | ✅    | ✅          |
| Buy credits           | ❌   | ✅            | ✅    | ✅          |
| Sell credits          | ❌   | ✅            | ✅    | ✅          |
| Submit KYC            | ✅   | ✅            | ✅    | ✅          |
| Use AI MRV            | ✅   | ✅            | ✅    | ✅          |
| Approve KYC           | ❌   | ❌            | ✅    | ✅          |
| Manage users          | ❌   | ❌            | ✅    | ✅          |
| View all transactions | ❌   | ❌            | ✅    | ✅          |
| System settings       | ❌   | ❌            | ❌    | ✅          |

### 4.5 Rate Limiting

**Per-Endpoint Limits:**

```typescript
const rateLimits = {
  // Authentication
  "/api/v1/auth/signup": { max: 5, window: "1h" },
  "/api/v1/auth/login": { max: 10, window: "15m" },
  "/api/v1/auth/forgot-password": { max: 3, window: "1h" },

  // General API
  "/api/v1/*": { max: 100, window: "15m" },

  // AI MRV (expensive)
  "/api/v1/ai-mrv/analyze": { max: 10, window: "1h" },

  // Admin endpoints
  "/api/v1/admin/*": { max: 1000, window: "15m" },
};
```

**Implementation:**

- Use express-rate-limit middleware
- Store rate limit data in Redis
- Return 429 status code when exceeded
- Include retry-after header

### 4.6 API Key Authentication (Optional)

For programmatic access:

- Generate API keys for verified users
- Store hashed API keys in database
- Support key rotation
- Track API key usage
- Rate limiting per API key

---

## 5. Payment Integration

### 5.1 Payment Gateway Selection

**Primary: Razorpay (India)**

- Best for Indian market
- Supports UPI, cards, net banking, wallets
- Lower fees for domestic transactions
- INR native support

**Secondary: Stripe (International)**

- Global payment support
- Multi-currency support
- Strong fraud detection
- Better for international expansion

### 5.2 Payment Flow

**Buy Credits Flow:**

```
1. User clicks "Buy" on credit
2. Backend creates transaction record (status: pending)
3. Backend reserves credit quantity
4. Backend creates payment intent with gateway
5. Frontend redirects to payment gateway
6. User completes payment
7. Payment gateway sends webhook to backend
8. Backend verifies webhook signature
9. Backend updates transaction (status: completed)
10. Backend adds credit to user portfolio
11. Backend updates credit available volume
12. Backend sends confirmation email/SMS
13. Frontend shows success message
```

**Sell Credits Flow:**

```
1. User clicks "Sell" on portfolio credit
2. Backend validates ownership
3. Backend creates transaction record (status: pending)
4. Backend removes credit from portfolio
5. Backend adds credit back to marketplace
6. Backend initiates payout to user wallet
7. Backend updates transaction (status: completed)
8. Backend sends confirmation email/SMS
9. Frontend shows success message
```

### 5.3 Razorpay Integration

**Setup:**

```typescript
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
```

**Create Order:**

```typescript
const order = await razorpay.orders.create({
  amount: totalAmount * 100, // Amount in paise
  currency: "INR",
  receipt: transactionId,
  notes: {
    userId: user.id,
    creditId: credit.id,
    quantity: quantity,
  },
});
```

**Webhook Handling:**

```typescript
app.post("/api/v1/webhooks/razorpay", async (req, res) => {
  const signature = req.headers["x-razorpay-signature"];
  const body = JSON.stringify(req.body);

  // Verify signature
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(body)
    .digest("hex");

  if (signature !== expectedSignature) {
    return res.status(400).json({ error: "Invalid signature" });
  }

  const event = req.body.event;
  const payload = req.body.payload;

  if (event === "payment.captured") {
    await handlePaymentSuccess(payload);
  } else if (event === "payment.failed") {
    await handlePaymentFailure(payload);
  }

  res.json({ status: "ok" });
});
```

### 5.4 Stripe Integration

**Setup:**

```typescript
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});
```

**Create Payment Intent:**

```typescript
const paymentIntent = await stripe.paymentIntents.create({
  amount: totalAmount * 100, // Amount in cents
  currency: "inr",
  metadata: {
    userId: user.id,
    creditId: credit.id,
    quantity: quantity,
  },
});
```

**Webhook Handling:**

```typescript
app.post("/api/v1/webhooks/stripe", async (req, res) => {
  const signature = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    await handlePaymentSuccess(event.data.object);
  } else if (event.type === "payment_intent.payment_failed") {
    await handlePaymentFailure(event.data.object);
  }

  res.json({ received: true });
});
```

### 5.5 Wallet System

**User Wallet:**

- Store user balance in database
- Support deposits and withdrawals
- Transaction history
- Minimum balance requirements
- Withdrawal limits

**Wallet Table:**

```sql
CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    balance DECIMAL(15, 2) DEFAULT 0 CHECK (balance >= 0),
    currency VARCHAR(10) DEFAULT 'INR',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, currency)
);

CREATE TABLE wallet_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
    transaction_type VARCHAR(50) NOT NULL
        CHECK (transaction_type IN ('deposit', 'withdrawal', 'credit', 'debit')),
    amount DECIMAL(15, 2) NOT NULL,
    balance_after DECIMAL(15, 2) NOT NULL,
    reference_id UUID,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_wallet_transactions_wallet_id (wallet_id),
    INDEX idx_wallet_transactions_created_at (created_at)
);
```

### 5.6 Refund Handling

**Refund Policy:**

- Full refund within 24 hours of purchase
- Partial refund for disputed transactions
- No refund after credit retirement

**Refund Process:**

```typescript
async function processRefund(transactionId: string, reason: string) {
  const transaction = await getTransaction(transactionId);

  // Initiate refund with payment gateway
  if (transaction.paymentMethod === "razorpay") {
    await razorpay.payments.refund(transaction.paymentGatewayTransactionId, {
      amount: transaction.amount * 100,
    });
  } else if (transaction.paymentMethod === "stripe") {
    await stripe.refunds.create({
      payment_intent: transaction.paymentGatewayTransactionId,
    });
  }

  // Update transaction status
  await updateTransaction(transactionId, {
    paymentStatus: "refunded",
    refundReason: reason,
  });

  // Remove credit from portfolio
  await removeFromPortfolio(transaction.userId, transaction.creditId);

  // Return credit to marketplace
  await updateCreditVolume(transaction.creditId, transaction.quantity);

  // Send notification
  await sendRefundNotification(transaction.userId, transaction);
}
```

### 5.7 Payment Security

**PCI DSS Compliance:**

- Never store card details
- Use payment gateway hosted checkout
- Implement 3D Secure authentication
- Regular security audits

**Fraud Prevention:**

- Velocity checks (max transactions per day)
- IP geolocation verification
- Device fingerprinting
- Suspicious activity alerts

---

## 6. KYC Verification System

### 6.1 KYC Requirements

**Individual Users:**

- Aadhaar card (India)
- PAN card (India)
- Selfie for face verification
- Address proof (optional)

**Business Users:**

- Business registration certificate
- GST certificate
- Director's KYC documents
- Bank account proof

### 6.2 Aadhaar Verification API

**Provider Options:**

- Digio
- Signzy
- IDfy
- Karza

**Integration Example (Digio):**

```typescript
import axios from "axios";

async function verifyAadhaar(aadhaarNumber: string, consent: boolean) {
  if (!consent) {
    throw new Error("User consent required for Aadhaar verification");
  }

  const response = await axios.post(
    "https://api.digio.in/v2/client/kyc/aadhaar_verification",
    {
      aadhaar_number: aadhaarNumber,
      consent: "Y",
    },
    {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.DIGIO_CLIENT_ID}:${process.env.DIGIO_CLIENT_SECRET}`,
        ).toString("base64")}`,
        "Content-Type": "application/json",
      },
    },
  );

  return {
    verified: response.data.verified,
    name: response.data.name,
    dob: response.data.dob,
    gender: response.data.gender,
    address: response.data.address,
  };
}
```

**Cost:** ₹5-10 per verification

### 6.3 PAN Verification API

**Provider Options:**

- Digio
- Signzy
- IDfy
- Karza

**Integration Example:**

```typescript
async function verifyPAN(panNumber: string, name: string) {
  const response = await axios.post(
    "https://api.digio.in/v2/client/kyc/pan_verification",
    {
      pan_number: panNumber,
      name: name,
    },
    {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.DIGIO_CLIENT_ID}:${process.env.DIGIO_CLIENT_SECRET}`,
        ).toString("base64")}`,
        "Content-Type": "application/json",
      },
    },
  );

  return {
    verified: response.data.verified,
    name: response.data.name,
    panNumber: response.data.pan_number,
    category: response.data.category,
  };
}
```

**Cost:** ₹5-10 per verification

### 6.4 Face Verification

**Provider Options:**

- AWS Rekognition
- Azure Face API
- Google Cloud Vision
- FaceIO

**Integration Example (AWS Rekognition):**

```typescript
import AWS from "aws-sdk";

const rekognition = new AWS.Rekognition({
  region: "ap-south-1",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

async function compareFaces(selfieUrl: string, aadhaarPhotoUrl: string) {
  const selfieImage = await downloadImage(selfieUrl);
  const aadhaarImage = await downloadImage(aadhaarPhotoUrl);

  const result = await rekognition
    .compareFaces({
      SourceImage: { Bytes: selfieImage },
      TargetImage: { Bytes: aadhaarImage },
      SimilarityThreshold: 90,
    })
    .promise();

  if (result.FaceMatches && result.FaceMatches.length > 0) {
    return {
      matched: true,
      similarity: result.FaceMatches[0].Similarity,
    };
  }

  return {
    matched: false,
    similarity: 0,
  };
}
```

**Cost:** ₹2-5 per comparison

### 6.5 Document Upload & Storage

**File Upload:**

- Max file size: 10MB per document
- Allowed formats: PDF, JPG, PNG
- Virus scanning before storage
- Image compression for optimization

**Storage:**

- AWS S3 or Google Cloud Storage
- Encrypted at rest (AES-256)
- Encrypted in transit (HTTPS)
- Signed URLs for temporary access
- Automatic expiry after KYC approval

**S3 Configuration:**

```typescript
import AWS from "aws-sdk";

const s3 = new AWS.S3({
  region: "ap-south-1",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

async function uploadKYCDocument(
  userId: string,
  documentType: string,
  file: Buffer,
  fileName: string,
) {
  const key = `kyc/${userId}/${documentType}/${Date.now()}_${fileName}`;

  await s3
    .putObject({
      Bucket: process.env.S3_KYC_BUCKET,
      Key: key,
      Body: file,
      ContentType: "application/pdf",
      ServerSideEncryption: "AES256",
      Metadata: {
        userId: userId,
        documentType: documentType,
      },
    })
    .promise();

  return {
    fileUrl: `https://${process.env.S3_KYC_BUCKET}.s3.ap-south-1.amazonaws.com/${key}`,
    key: key,
  };
}

async function getSignedUrl(key: string, expiresIn: number = 3600) {
  return s3.getSignedUrl("getObject", {
    Bucket: process.env.S3_KYC_BUCKET,
    Key: key,
    Expires: expiresIn,
  });
}
```

### 6.6 Manual Review Process

**Review Dashboard:**

- Queue of pending KYC submissions
- Document viewer
- Verification checklist
- Approve/Reject actions
- Notes and comments

**Review Workflow:**

```
1. User submits KYC documents
2. Automated verification (Aadhaar, PAN, Face)
3. If automated verification passes:
   - Auto-approve (optional)
   - OR Queue for manual review
4. Manual reviewer checks:
   - Document quality
   - Information consistency
   - Suspicious patterns
5. Reviewer approves or rejects
6. User receives notification
7. If rejected, user can re-submit
```

**Review SLA:**

- Standard: 24-48 hours
- Priority (paid): 2-4 hours

### 6.7 KYC Compliance

**DPDPA (Digital Personal Data Protection Act) Compliance:**

- Explicit user consent before collection
- Purpose limitation (only for KYC)
- Data minimization
- Right to access and deletion
- Secure storage and transmission
- Breach notification procedures

**AML/CFT Compliance:**

- Customer Due Diligence (CDD)
- Enhanced Due Diligence (EDD) for high-risk users
- Ongoing monitoring
- Suspicious activity reporting
- Record keeping (5 years minimum)

---

## 7. AI Integration

### 7.1 Current State (Demo)

The current AI MRV system is **completely fake** - just if-else statements with hardcoded responses:

```typescript
// Current FAKE implementation
function analyzeProject(projectType: string) {
  if (projectType === "forestry") {
    return { score: 85, findings: "Predefined text..." };
  }
  // No real AI, no learning, no intelligence
}
```

### 7.2 Real AI Implementation

**AI Provider Selection:**

**Option 1: OpenAI (Recommended)**

- Model: GPT-4 or GPT-4 Turbo
- Strengths: Best reasoning, large context window
- Cost: ~$0.03 per 1K tokens (input), ~$0.06 per 1K tokens (output)
- Average analysis cost: ₹2-5 per project

**Option 2: Anthropic Claude**

- Model: Claude 3 Opus or Claude 3.5 Sonnet
- Strengths: Better at long documents, safety-focused
- Cost: ~$0.015 per 1K tokens (input), ~$0.075 per 1K tokens (output)
- Average analysis cost: ₹2-4 per project

**Option 3: Custom Model (Long-term)**

- Train on carbon credit data
- Lower per-analysis cost
- Higher upfront investment (₹10-50 lakhs)
- Requires ML team

### 7.3 AI MRV Architecture

**Multi-Agent System:**

```
┌─────────────────────────────────────────────────────────────┐
│                    Orchestrator                              │
│  (Coordinates agents, manages workflow)                      │
└─────────────────────────────────────────────────────────────┘
         ↓                ↓                ↓                ↓
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  Researcher  │  │  Verifier    │  │  Compliance  │  │   Report     │
│    Agent     │  │    Agent     │  │   Checker    │  │  Generator   │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
```

### 7.4 Agent Implementation

#### 7.4.1 Researcher Agent

**Purpose:** Fetch and analyze project data

**Implementation:**

```typescript
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function researcherAgent(projectId: string, projectDescription?: string) {
  // 1. Fetch project data from CAD Trust API
  let projectData;
  try {
    projectData = await fetchCADTrustProject(projectId);
  } catch (error) {
    // Use provided description if API fails
    projectData = { description: projectDescription };
  }

  // 2. Analyze with GPT-4
  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [
      {
        role: "system",
        content: `You are a carbon credit research analyst. Analyze the following project data and extract key information about:
        - Project type and methodology
        - Geographic location and context
        - Baseline scenario
        - Project activities
        - Monitoring approach
        
        Provide structured analysis in JSON format.`,
      },
      {
        role: "user",
        content: JSON.stringify(projectData),
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.3,
  });

  const analysis = JSON.parse(completion.choices[0].message.content);

  return {
    projectData: projectData,
    analysis: analysis,
    tokensUsed: completion.usage.total_tokens,
    dataSource: projectData.projectId ? "live" : "description",
  };
}
```

#### 7.4.2 Verifier Agent

**Purpose:** Assess additionality, permanence, and leakage

**Implementation:**

```typescript
async function verifierAgent(researcherFindings: any) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [
      {
        role: "system",
        content: `You are a carbon credit verification expert. Assess the project on three key criteria:

        1. ADDITIONALITY (0-100): Would this project happen without carbon finance?
           - Regulatory additionality
           - Financial additionality
           - Barrier analysis
        
        2. PERMANENCE (0-100): How permanent are the emission reductions?
           - Risk of reversal
           - Legal protections
           - Monitoring systems
        
        3. LEAKAGE (0-100): How well does the project prevent leakage?
           - Activity shifting
           - Market leakage
           - Mitigation measures
        
        Provide scores and detailed reasoning in JSON format.`,
      },
      {
        role: "user",
        content: JSON.stringify(researcherFindings),
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.3,
  });

  const assessment = JSON.parse(completion.choices[0].message.content);

  return {
    additionalityScore: assessment.additionality.score,
    permanenceScore: assessment.permanence.score,
    leakageScore: assessment.leakage.score,
    reasoning: assessment,
    tokensUsed: completion.usage.total_tokens,
  };
}
```

#### 7.4.3 Compliance Checker Agent

**Purpose:** Check compliance with registry standards

**Implementation:**

```typescript
async function complianceCheckerAgent(
  researcherFindings: any,
  verifierAssessment: any,
) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [
      {
        role: "system",
        content: `You are a carbon credit compliance expert. Check if the project meets:

        1. VERRA VCS STANDARDS:
           - Approved methodology
           - Validation requirements
           - Monitoring requirements
           - Verification requirements
        
        2. GOLD STANDARD REQUIREMENTS:
           - Sustainable development criteria
           - Stakeholder consultation
           - Safeguarding principles
           - Certification requirements
        
        Identify any compliance issues or gaps. Provide results in JSON format.`,
      },
      {
        role: "user",
        content: JSON.stringify({
          research: researcherFindings,
          verification: verifierAssessment,
        }),
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.3,
  });

  const compliance = JSON.parse(completion.choices[0].message.content);

  return {
    verraCompliant: compliance.verra.compliant,
    goldStandardCompliant: compliance.goldStandard.compliant,
    issues: compliance.issues || [],
    tokensUsed: completion.usage.total_tokens,
  };
}
```

#### 7.4.4 Report Generator Agent

**Purpose:** Synthesize all findings into comprehensive report

**Implementation:**

```typescript
async function reportGeneratorAgent(
  researcherFindings: any,
  verifierAssessment: any,
  complianceCheck: any,
) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [
      {
        role: "system",
        content: `You are a carbon credit quality analyst. Create a comprehensive quality report that includes:

        1. OVERALL QUALITY SCORE (0-100): Weighted average of all assessments
        2. STRENGTHS: Top 3-5 project strengths
        3. WEAKNESSES: Top 3-5 areas of concern
        4. RECOMMENDATIONS: Specific actions to improve quality
        5. INVESTMENT RECOMMENDATION: Buy, Hold, or Avoid with reasoning
        
        Provide a professional, actionable report in JSON format.`,
      },
      {
        role: "user",
        content: JSON.stringify({
          research: researcherFindings,
          verification: verifierAssessment,
          compliance: complianceCheck,
        }),
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.5,
  });

  const report = JSON.parse(completion.choices[0].message.content);

  return {
    qualityScore: report.qualityScore,
    strengths: report.strengths,
    weaknesses: report.weaknesses,
    recommendations: report.recommendations,
    investmentRecommendation: report.investmentRecommendation,
    tokensUsed: completion.usage.total_tokens,
  };
}
```

### 7.5 Orchestrator Implementation

**Coordinates all agents:**

```typescript
async function runAIMRVAnalysis(
  userId: string,
  projectId: string,
  projectDescription?: string,
) {
  // Create analysis record
  const analysis = await db.ai_mrv_analyses.create({
    userId: userId,
    projectId: projectId,
    projectDescription: projectDescription,
    analysisStatus: "processing",
    aiProvider: "openai",
    aiModel: "gpt-4-turbo",
  });

  try {
    let totalTokens = 0;

    // Step 1: Researcher Agent
    const researcherFindings = await researcherAgent(
      projectId,
      projectDescription,
    );
    totalTokens += researcherFindings.tokensUsed;

    await db.ai_mrv_analyses.update(analysis.id, {
      researcherFindings: researcherFindings,
    });

    // Step 2: Verifier Agent
    const verifierAssessment = await verifierAgent(researcherFindings);
    totalTokens += verifierAssessment.tokensUsed;

    await db.ai_mrv_analyses.update(analysis.id, {
      verifierAssessment: verifierAssessment,
      additionalityScore: verifierAssessment.additionalityScore,
      permanenceScore: verifierAssessment.permanenceScore,
      leakageScore: verifierAssessment.leakageScore,
    });

    // Step 3: Compliance Checker Agent
    const complianceCheck = await complianceCheckerAgent(
      researcherFindings,
      verifierAssessment,
    );
    totalTokens += complianceCheck.tokensUsed;

    await db.ai_mrv_analyses.update(analysis.id, {
      complianceCheck: complianceCheck,
    });

    // Step 4: Report Generator Agent
    const finalReport = await reportGeneratorAgent(
      researcherFindings,
      verifierAssessment,
      complianceCheck,
    );
    totalTokens += finalReport.tokensUsed;

    // Calculate cost (GPT-4 Turbo pricing)
    const costUsd = (totalTokens / 1000) * 0.01; // Simplified

    // Update analysis with final results
    await db.ai_mrv_analyses.update(analysis.id, {
      finalReport: finalReport,
      overallQualityScore: finalReport.qualityScore,
      totalTokensUsed: totalTokens,
      costUsd: costUsd,
      analysisStatus: "completed",
      completedAt: new Date(),
      processingTimeSeconds: Math.floor(
        (Date.now() - analysis.createdAt.getTime()) / 1000,
      ),
    });

    return analysis;
  } catch (error) {
    await db.ai_mrv_analyses.update(analysis.id, {
      analysisStatus: "failed",
      errorMessage: error.message,
    });
    throw error;
  }
}
```

### 7.6 RAG (Retrieval Augmented Generation)

**Purpose:** Enhance AI with domain-specific knowledge

**Knowledge Base:**

- Verra VCS methodologies
- Gold Standard requirements
- CCTS guidelines
- Academic papers on carbon credits
- Historical project data

**Implementation:**

```typescript
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";

// 1. Create embeddings for knowledge base
const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY,
});

// 2. Store in vector database (Pinecone)
const vectorStore = await PineconeStore.fromDocuments(documents, embeddings, {
  pineconeIndex: pineconeIndex,
  namespace: "carbon-credits",
});

// 3. Retrieve relevant context for analysis
async function getRelevantContext(query: string) {
  const results = await vectorStore.similaritySearch(query, 5);
  return results.map((doc) => doc.pageContent).join("\n\n");
}

// 4. Use in agent prompts
const context = await getRelevantContext(projectDescription);
const prompt = `Context:\n${context}\n\nProject:\n${projectDescription}`;
```

**Cost:**

- Pinecone: $70/month for 1M vectors
- OpenAI embeddings: $0.0001 per 1K tokens

### 7.7 Cost Optimization

**Strategies:**

1. **Caching:** Cache analysis results for identical projects
2. **Prompt optimization:** Reduce token usage with concise prompts
3. **Model selection:** Use GPT-3.5 for simple tasks, GPT-4 for complex
4. **Batch processing:** Process multiple analyses together
5. **Rate limiting:** Limit analyses per user per day

**Cost Tracking:**

```typescript
// Track AI costs per user
CREATE TABLE ai_usage_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    analysis_id UUID REFERENCES ai_mrv_analyses(id),
    tokens_used INTEGER NOT NULL,
    cost_usd DECIMAL(10, 4) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_ai_usage_user_id (user_id),
    INDEX idx_ai_usage_created_at (created_at)
);

// Monthly cost summary
SELECT
    user_id,
    DATE_TRUNC('month', created_at) as month,
    SUM(tokens_used) as total_tokens,
    SUM(cost_usd) as total_cost_usd
FROM ai_usage_tracking
GROUP BY user_id, month;
```

### 7.8 AI Safety & Monitoring

**Content Filtering:**

- OpenAI moderation API
- Block harmful or inappropriate content
- Log flagged content for review

**Quality Monitoring:**

- Track analysis accuracy
- User feedback on AI outputs
- A/B testing different prompts
- Regular model evaluation

**Error Handling:**

- Retry logic for API failures
- Fallback to simpler models
- Human review for edge cases
- Clear error messages to users

---

## 8. Market Data Integration

### 8.1 Current State (Demo)

Current price data is **completely fake** - hardcoded numbers with random fluctuations:

```typescript
// Current FAKE implementation
const mockPrices = [
  { id: "VCS-934", price: 2500 }, // Fixed price
  { id: "GS-7845", price: 3500 }, // Fixed price
];

// Fake price history
function generatePriceHistory(basePrice) {
  return Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - i * 86400000),
    price: basePrice * (1 + (Math.random() - 0.5) * 0.1), // ±5% random
  }));
}
```

### 8.2 Real Market Data Sources

**Option 1: Carbon Credit Market Data APIs**

**Xpansiv CBL (Chicago)**

- Largest carbon credit exchange
- Real-time pricing data
- Historical data available
- API access: Contact for pricing

**AirCarbon Exchange (Singapore)**

- Digital carbon exchange
- Real-time trading data
- API access: Contact for pricing

**Option 2: Financial Data Providers**

**Bloomberg Terminal**

- Comprehensive carbon market data
- Cost: $24,000/year per terminal
- API access available

**Refinitiv (formerly Thomson Reuters)**

- Carbon market data feeds
- Cost: $10,000-50,000/year
- API access available

**Option 3: Specialized Carbon Data Providers**

**OPIS (Oil Price Information Service)**

- Carbon credit pricing
- Cost: $500-2,000/month
- API access available

**Carbon Pulse**

- Market news and pricing
- Cost: $1,000-3,000/year
- Limited API access

**Option 4: Build Own Data Aggregator**

- Scrape public registry data
- Aggregate from multiple sources
- Calculate synthetic prices
- Cost: 3-6 months development

### 8.3 Market Data API Integration

**Example Integration (Generic):**

```typescript
import axios from "axios";

interface MarketDataProvider {
  fetchCurrentPrice(registryId: string): Promise<number>;
  fetchPriceHistory(
    registryId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<PricePoint[]>;
  fetchMarketDepth(registryId: string): Promise<OrderBook>;
}

class CarbonMarketDataAPI implements MarketDataProvider {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.MARKET_DATA_API_KEY;
    this.baseUrl = process.env.MARKET_DATA_API_URL;
  }

  async fetchCurrentPrice(registryId: string): Promise<number> {
    const response = await axios.get(`${this.baseUrl}/prices/current`, {
      params: { registry_id: registryId },
      headers: { Authorization: `Bearer ${this.apiKey}` },
    });

    return response.data.price;
  }

  async fetchPriceHistory(
    registryId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<PricePoint[]> {
    const response = await axios.get(`${this.baseUrl}/prices/history`, {
      params: {
        registry_id: registryId,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        interval: "daily",
      },
      headers: { Authorization: `Bearer ${this.apiKey}` },
    });

    return response.data.prices.map((p) => ({
      date: new Date(p.date),
      price: p.price,
      volume: p.volume,
      high: p.high,
      low: p.low,
      open: p.open,
      close: p.close,
    }));
  }

  async fetchMarketDepth(registryId: string): Promise<OrderBook> {
    const response = await axios.get(`${this.baseUrl}/market-depth`, {
      params: { registry_id: registryId },
      headers: { Authorization: `Bearer ${this.apiKey}` },
    });

    return {
      bids: response.data.bids,
      asks: response.data.asks,
      spread: response.data.spread,
    };
  }
}
```

### 8.4 Price Update Strategy

**Real-time Updates:**

- WebSocket connection to market data provider
- Push updates to connected clients
- Update database every 5 minutes

**Batch Updates:**

- Scheduled job every 15 minutes
- Fetch prices for all active credits
- Store in price_history table
- Cache in Redis for fast access

**Implementation:**

```typescript
import { CronJob } from "cron";

// Run every 15 minutes
const priceUpdateJob = new CronJob("*/15 * * * *", async () => {
  console.log("Starting price update job...");

  // Get all active credits
  const credits = await db.carbon_credits.findMany({
    where: { status: "available" },
  });

  // Fetch current prices
  for (const credit of credits) {
    try {
      const currentPrice = await marketDataAPI.fetchCurrentPrice(
        credit.registryId,
      );

      // Update credit price
      await db.carbon_credits.update(credit.id, {
        currentPricePerTonne: currentPrice,
        updatedAt: new Date(),
      });

      // Store in price history
      await db.price_history.create({
        creditId: credit.id,
        pricePerTonne: currentPrice,
        date: new Date(),
        dataSource: "market_api",
      });

      // Cache in Redis
      await redis.set(
        `price:${credit.id}`,
        currentPrice,
        "EX",
        900, // 15 minutes
      );
    } catch (error) {
      console.error(`Failed to update price for ${credit.registryId}:`, error);
    }
  }

  console.log("Price update job completed");
});

priceUpdateJob.start();
```

### 8.5 Synthetic Price Generation (Fallback)

If real market data is unavailable, generate synthetic prices based on:

- Project quality score
- Vintage year
- Project type
- Geographic location
- Historical trends

```typescript
function generateSyntheticPrice(credit: CarbonCredit): number {
  // Base price by registry
  const basePrices = {
    Verra: 2000,
    GoldStandard: 2500,
    CCTS: 1800,
  };

  let price = basePrices[credit.registry];

  // Adjust for quality score
  price *= 0.7 + (credit.qualityScore / 100) * 0.6;

  // Adjust for vintage (newer = higher)
  const vintageAdjustment = (credit.vintage - 2015) * 50;
  price += vintageAdjustment;

  // Adjust for project type
  const typeMultipliers = {
    Forestry: 1.2,
    "Renewable Energy": 1.0,
    "Energy Efficiency": 0.9,
    Cookstoves: 0.8,
  };
  price *= typeMultipliers[credit.projectType] || 1.0;

  // Add some randomness (±5%)
  price *= 0.95 + Math.random() * 0.1;

  return Math.round(price);
}
```

### 8.6 Market Analytics

**Provide users with:**

- Price trends and charts
- Volume analysis
- Market sentiment indicators
- Comparative analysis across registries
- Price predictions (ML-based)

**Analytics Dashboard:**

```typescript
async function getMarketAnalytics(timeframe: string = "30d") {
  const analytics = {
    // Average prices by registry
    averagePrices: await db.query(`
      SELECT 
        c.registry,
        AVG(ph.price_per_tonne) as avg_price,
        MIN(ph.price_per_tonne) as min_price,
        MAX(ph.price_per_tonne) as max_price
      FROM price_history ph
      JOIN carbon_credits c ON ph.credit_id = c.id
      WHERE ph.date >= NOW() - INTERVAL '${timeframe}'
      GROUP BY c.registry
    `),

    // Trading volume
    tradingVolume: await db.query(`
      SELECT 
        DATE_TRUNC('day', created_at) as date,
        SUM(quantity) as volume,
        COUNT(*) as transactions
      FROM transactions
      WHERE transaction_type = 'buy'
        AND created_at >= NOW() - INTERVAL '${timeframe}'
      GROUP BY date
      ORDER BY date
    `),

    // Top performing credits
    topPerformers: await db.query(`
      SELECT 
        c.registry_id,
        c.project_name,
        (ph_latest.price_per_tonne - ph_earliest.price_per_tonne) / ph_earliest.price_per_tonne * 100 as price_change_pct
      FROM carbon_credits c
      JOIN LATERAL (
        SELECT price_per_tonne
        FROM price_history
        WHERE credit_id = c.id
        ORDER BY date DESC
        LIMIT 1
      ) ph_latest ON true
      JOIN LATERAL (
        SELECT price_per_tonne
        FROM price_history
        WHERE credit_id = c.id
          AND date >= NOW() - INTERVAL '${timeframe}'
        ORDER BY date ASC
        LIMIT 1
      ) ph_earliest ON true
      ORDER BY price_change_pct DESC
      LIMIT 10
    `),
  };

  return analytics;
}
```

---

## 9. Registry Integration

### 9.1 Current State (Demo)

Current onboarding is **completely fake** - just a checklist in localStorage:

```typescript
// Current FAKE implementation
function handleSubmit() {
  if (allStepsComplete) {
    toast.success("Submitted!"); // Fake success
    showSuccessAnimation();
    // Nothing actually submitted to any registry
  }
}
```

### 9.2 Registry APIs

**Verra Registry:**

- API Status: Limited public API
- Access: Requires partnership agreement
- Capabilities: Project search, credit issuance tracking
- Documentation: https://registry.verra.org/app/search/VCS
- Cost: Contact Verra for pricing

**Gold Standard Registry:**

- API Status: Public API available
- Access: API key required
- Capabilities: Project data, credit tracking
- Documentation: https://registry.goldstandard.org/
- Cost: Free for basic access

**CCTS (India):**

- API Status: Under development
- Access: Government approval required
- Capabilities: TBD
- Documentation: https://ccts.gov.in/
- Cost: TBD

### 9.3 Registry Integration Strategy

**Phase 1: Read-Only Integration**

- Fetch project data
- Verify credit authenticity
- Track credit status
- Display registry information

**Phase 2: Submission Integration**

- Submit project documentation
- Track submission status
- Receive approval notifications
- Handle rejections and resubmissions

**Phase 3: Full Integration**

- Automated credit issuance
- Real-time status updates
- Blockchain integration
- Retirement tracking

### 9.4 Verra Integration

**Project Submission Workflow:**

```typescript
interface VerraSubmission {
  projectDescription: string;
  methodology: string;
  projectType: string;
  location: string;
  estimatedReductions: number;
  documents: {
    projectDescription: string; // PDF URL
    monitoringPlan: string;
    validationReport: string;
  };
}

async function submitToVerra(submission: VerraSubmission) {
  // 1. Validate all required documents
  validateDocuments(submission.documents);

  // 2. Create submission package
  const submissionPackage = {
    project_name: submission.projectDescription,
    methodology: submission.methodology,
    project_type: submission.projectType,
    location: submission.location,
    estimated_annual_reductions: submission.estimatedReductions,
    documents: submission.documents,
  };

  // 3. Submit to Verra API (if available)
  // Note: Actual API may require different format
  const response = await axios.post(
    "https://registry.verra.org/api/v1/projects/submit",
    submissionPackage,
    {
      headers: {
        Authorization: `Bearer ${process.env.VERRA_API_KEY}`,
        "Content-Type": "application/json",
      },
    },
  );

  // 4. Store submission record
  await db.onboarding_progress.update({
    registry: "verra",
    submitted: true,
    submittedAt: new Date(),
    submissionId: response.data.submission_id,
    registryStatus: "submitted",
  });

  // 5. Set up webhook for status updates
  await registerWebhook(response.data.submission_id);

  return {
    submissionId: response.data.submission_id,
    status: "submitted",
    estimatedReviewTime: "4-6 weeks",
  };
}
```

**Status Tracking:**

```typescript
async function checkVerraSubmissionStatus(submissionId: string) {
  const response = await axios.get(
    `https://registry.verra.org/api/v1/projects/${submissionId}/status`,
    {
      headers: {
        Authorization: `Bearer ${process.env.VERRA_API_KEY}`,
      },
    },
  );

  // Update database
  await db.onboarding_progress.update({
    registryStatus: response.data.status,
    registryResponse: response.data,
  });

  // Notify user if status changed
  if (response.data.status === "approved") {
    await sendNotification(userId, {
      type: "email",
      subject: "Verra Project Approved!",
      message: `Your project ${submissionId} has been approved by Verra.`,
    });
  }

  return response.data;
}
```

### 9.5 Gold Standard Integration

**Project Submission:**

```typescript
async function submitToGoldStandard(submission: any) {
  const response = await axios.post(
    "https://api.goldstandard.org/v1/projects",
    {
      project: {
        name: submission.projectDescription,
        methodology: submission.methodology,
        country: submission.location,
        project_type: submission.projectType,
        estimated_emission_reductions: submission.estimatedReductions,
      },
      documents: submission.documents,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GOLD_STANDARD_API_KEY}`,
        "Content-Type": "application/json",
      },
    },
  );

  return {
    submissionId: response.data.project_id,
    status: "submitted",
  };
}
```

### 9.6 Document Management

**Required Documents by Registry:**

**Verra VCS:**

- Project Description (PD)
- Monitoring Plan
- Validation Report
- Verification Report
- Monitoring Reports

**Gold Standard:**

- Project Design Document (PDD)
- Stakeholder Consultation Report
- Sustainable Development Assessment
- Validation Report
- Monitoring Reports

**CCTS:**

- Project Proposal
- Baseline Study
- Monitoring Methodology
- Validation Certificate
- Annual Monitoring Reports

**Document Generation:**

```typescript
import PDFDocument from "pdfkit";

async function generateProjectDescription(projectData: any): Promise<Buffer> {
  const doc = new PDFDocument();
  const buffers: Buffer[] = [];

  doc.on("data", buffers.push.bind(buffers));

  // Title Page
  doc.fontSize(20).text("Project Description", { align: "center" });
  doc.moveDown();

  // Project Information
  doc.fontSize(14).text("1. Project Information");
  doc.fontSize(12).text(`Project Name: ${projectData.name}`);
  doc.text(`Location: ${projectData.location}`);
  doc.text(`Methodology: ${projectData.methodology}`);
  doc.moveDown();

  // Baseline Scenario
  doc.fontSize(14).text("2. Baseline Scenario");
  doc.fontSize(12).text(projectData.baselineScenario);
  doc.moveDown();

  // Project Activities
  doc.fontSize(14).text("3. Project Activities");
  doc.fontSize(12).text(projectData.projectActivities);
  doc.moveDown();

  // Monitoring Plan
  doc.fontSize(14).text("4. Monitoring Plan");
  doc.fontSize(12).text(projectData.monitoringPlan);

  doc.end();

  return new Promise((resolve) => {
    doc.on("end", () => {
      resolve(Buffer.concat(buffers));
    });
  });
}
```

### 9.7 Webhook Handling

**Registry Status Updates:**

```typescript
app.post("/api/v1/webhooks/verra", async (req, res) => {
  const signature = req.headers["x-verra-signature"];

  // Verify webhook signature
  const isValid = verifyWebhookSignature(
    req.body,
    signature,
    process.env.VERRA_WEBHOOK_SECRET,
  );

  if (!isValid) {
    return res.status(401).json({ error: "Invalid signature" });
  }

  const { submission_id, status, message } = req.body;

  // Update database
  await db.onboarding_progress.updateBySubmissionId(submission_id, {
    registryStatus: status,
    registryResponse: req.body,
  });

  // Get user
  const onboarding =
    await db.onboarding_progress.findBySubmissionId(submission_id);

  // Send notification
  await sendNotification(onboarding.userId, {
    type: "email",
    category: "onboarding",
    title: `Verra Submission Update: ${status}`,
    message: message,
  });

  res.json({ received: true });
});
```

---

## 10. File Storage

### 10.1 Storage Requirements

**File Types:**

- KYC documents (PDF, JPG, PNG)
- Onboarding documents (PDF, DOCX)
- Project photos (JPG, PNG)
- Monitoring reports (PDF, Excel)
- User avatars (JPG, PNG)

**Storage Needs:**

- Secure storage (encryption at rest)
- Access control (signed URLs)
- Backup and redundancy
- CDN for fast delivery
- Automatic cleanup of expired files

### 10.2 AWS S3 Configuration

**Bucket Structure:**

```
carbon-trade-x-production/
├── kyc/
│   ├── {userId}/
│   │   ├── aadhaar/
│   │   ├── pan/
│   │   └── selfie/
├── onboarding/
│   ├── {userId}/
│   │   ├── {registry}/
│   │   │   ├── project-description.pdf
│   │   │   └── monitoring-plan.pdf
├── avatars/
│   └── {userId}.jpg
└── temp/
    └── {uploadId}/
```

**S3 Setup:**

```typescript
import AWS from "aws-sdk";

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// Bucket configuration
const bucketConfig = {
  Bucket: process.env.S3_BUCKET_NAME,
  ACL: "private",
  ServerSideEncryption: "AES256",
  LifecycleConfiguration: {
    Rules: [
      {
        Id: "DeleteTempFiles",
        Prefix: "temp/",
        Status: "Enabled",
        Expiration: {
          Days: 1,
        },
      },
      {
        Id: "TransitionOldKYC",
        Prefix: "kyc/",
        Status: "Enabled",
        Transitions: [
          {
            Days: 90,
            StorageClass: "GLACIER",
          },
        ],
      },
    ],
  },
};
```

### 10.3 File Upload Implementation

**Multipart Upload:**

```typescript
import multer from "multer";
import { v4 as uuidv4 } from "uuid";

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"));
    }
  },
});

// Upload endpoint
app.post(
  "/api/v1/upload",
  authenticateMiddleware,
  upload.single("file"),
  async (req, res) => {
    try {
      const file = req.file;
      const { documentType, category } = req.body;

      // Generate unique file key
      const fileKey = `${category}/${req.user.id}/${documentType}/${uuidv4()}_${file.originalname}`;

      // Upload to S3
      await s3
        .putObject({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: fileKey,
          Body: file.buffer,
          ContentType: file.mimetype,
          ServerSideEncryption: "AES256",
          Metadata: {
            userId: req.user.id,
            documentType: documentType,
            uploadedAt: new Date().toISOString(),
          },
        })
        .promise();

      // Generate signed URL for access
      const signedUrl = s3.getSignedUrl("getObject", {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileKey,
        Expires: 3600, // 1 hour
      });

      res.json({
        success: true,
        data: {
          fileKey: fileKey,
          fileName: file.originalname,
          fileSize: file.size,
          fileType: file.mimetype,
          url: signedUrl,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: "UPLOAD_ERROR",
          message: error.message,
        },
      });
    }
  },
);
```

### 10.4 File Download with Signed URLs

```typescript
async function getFileUrl(
  fileKey: string,
  expiresIn: number = 3600,
): Promise<string> {
  return s3.getSignedUrl("getObject", {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileKey,
    Expires: expiresIn,
  });
}

// API endpoint
app.get("/api/v1/files/:fileKey", authenticateMiddleware, async (req, res) => {
  try {
    const { fileKey } = req.params;

    // Verify user has access to this file
    const hasAccess = await verifyFileAccess(req.user.id, fileKey);
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        error: { code: "FORBIDDEN", message: "Access denied" },
      });
    }

    // Generate signed URL
    const url = await getFileUrl(fileKey);

    res.json({
      success: true,
      data: { url },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: "DOWNLOAD_ERROR", message: error.message },
    });
  }
});
```

### 10.5 Image Processing

**Resize and optimize images:**

```typescript
import sharp from "sharp";

async function processImage(buffer: Buffer, options: any): Promise<Buffer> {
  return sharp(buffer)
    .resize(options.width, options.height, {
      fit: "cover",
      position: "center",
    })
    .jpeg({ quality: 80 })
    .toBuffer();
}

// Process avatar upload
app.post(
  "/api/v1/upload/avatar",
  authenticateMiddleware,
  upload.single("avatar"),
  async (req, res) => {
    const file = req.file;

    // Process image
    const processedImage = await processImage(file.buffer, {
      width: 200,
      height: 200,
    });

    // Upload to S3
    const fileKey = `avatars/${req.user.id}.jpg`;
    await s3
      .putObject({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileKey,
        Body: processedImage,
        ContentType: "image/jpeg",
        CacheControl: "max-age=31536000",
      })
      .promise();

    res.json({
      success: true,
      data: {
        avatarUrl: `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${fileKey}`,
      },
    });
  },
);
```

### 10.6 Virus Scanning

**ClamAV Integration:**

```typescript
import NodeClam from "clamscan";

const clamscan = await new NodeClam().init({
  clamdscan: {
    host: process.env.CLAMAV_HOST,
    port: 3310,
  },
});

async function scanFile(buffer: Buffer): Promise<boolean> {
  const { isInfected, viruses } = await clamscan.scanStream(buffer);

  if (isInfected) {
    console.error("Virus detected:", viruses);
    return false;
  }

  return true;
}

// Use in upload middleware
app.post(
  "/api/v1/upload",
  authenticateMiddleware,
  upload.single("file"),
  async (req, res) => {
    // Scan file for viruses
    const isSafe = await scanFile(req.file.buffer);
    if (!isSafe) {
      return res.status(400).json({
        success: false,
        error: {
          code: "VIRUS_DETECTED",
          message: "File contains malicious content",
        },
      });
    }

    // Continue with upload...
  },
);
```

---

## 11. Email & SMS Notifications

### 11.1 Notification Types

**Email Notifications:**

- Welcome email (signup)
- Email verification
- Password reset
- KYC status updates
- Transaction confirmations
- Onboarding status updates
- AI MRV analysis completed
- Security alerts
- Monthly statements

**SMS Notifications:**

- OTP for 2FA
- Transaction confirmations
- Security alerts
- KYC approval/rejection

### 11.2 Email Service Integration

**Option 1: SendGrid (Recommended)**

- Reliable delivery
- Template management
- Analytics and tracking
- Cost: $15-90/month

**Option 2: AWS SES**

- Lower cost
- Good for high volume
- Requires warm-up period
- Cost: $0.10 per 1,000 emails

**SendGrid Implementation:**

```typescript
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmail(to: string, templateId: string, data: any) {
  const msg = {
    to: to,
    from: {
      email: "noreply@carbontradex.com",
      name: "Carbon Trade X",
    },
    templateId: templateId,
    dynamicTemplateData: data,
  };

  try {
    await sgMail.send(msg);

    // Log notification
    await db.notifications.create({
      userId: data.userId,
      type: "email",
      category: data.category,
      title: data.subject,
      message: data.message,
      deliveryStatus: "sent",
      sentAt: new Date(),
    });
  } catch (error) {
    console.error("Email send failed:", error);

    // Log failure
    await db.notifications.create({
      userId: data.userId,
      type: "email",
      deliveryStatus: "failed",
      metadata: { error: error.message },
    });
  }
}
```

**Email Templates:**

```typescript
const emailTemplates = {
  WELCOME: "d-abc123",
  EMAIL_VERIFICATION: "d-def456",
  PASSWORD_RESET: "d-ghi789",
  KYC_APPROVED: "d-jkl012",
  KYC_REJECTED: "d-mno345",
  TRANSACTION_CONFIRMATION: "d-pqr678",
  AI_MRV_COMPLETED: "d-stu901",
};

// Send welcome email
await sendEmail(user.email, emailTemplates.WELCOME, {
  userId: user.id,
  category: "system",
  subject: "Welcome to Carbon Trade X",
  name: user.name,
  verificationLink: `https://carbontradex.com/verify-email?token=${token}`,
});
```

### 11.3 SMS Service Integration

**Option 1: Twilio**

- Global coverage
- Reliable delivery
- Cost: $0.0075 per SMS (India)

**Option 2: AWS SNS**

- Lower cost
- Good integration with AWS
- Cost: $0.00645 per SMS (India)

**Twilio Implementation:**

```typescript
import twilio from "twilio";

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

async function sendSMS(to: string, message: string) {
  try {
    const result = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to,
    });

    // Log notification
    await db.notifications.create({
      type: "sms",
      deliveryStatus: "sent",
      sentAt: new Date(),
      metadata: { sid: result.sid },
    });
  } catch (error) {
    console.error("SMS send failed:", error);

    await db.notifications.create({
      type: "sms",
      deliveryStatus: "failed",
      metadata: { error: error.message },
    });
  }
}

// Send OTP
const otp = generateOTP();
await sendSMS(
  user.phone,
  `Your Carbon Trade X OTP is: ${otp}. Valid for 10 minutes.`,
);
```

### 11.4 Notification Preferences

**User Preferences:**

```sql
CREATE TABLE notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Email preferences
    email_transactions BOOLEAN DEFAULT TRUE,
    email_kyc_updates BOOLEAN DEFAULT TRUE,
    email_onboarding BOOLEAN DEFAULT TRUE,
    email_marketing BOOLEAN DEFAULT FALSE,

    -- SMS preferences
    sms_transactions BOOLEAN DEFAULT TRUE,
    sms_security BOOLEAN DEFAULT TRUE,

    -- In-app preferences
    in_app_all BOOLEAN DEFAULT TRUE,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE (user_id)
);
```

**Check preferences before sending:**

```typescript
async function sendNotification(userId: string, notification: any) {
  const prefs = await db.notification_preferences.findByUserId(userId);

  // Check if user wants this type of notification
  if (
    notification.type === "email" &&
    notification.category === "transaction"
  ) {
    if (!prefs.email_transactions) {
      return; // User opted out
    }
  }

  // Send notification...
}
```

### 11.5 Notification Queue

**Use Bull Queue for reliable delivery:**

```typescript
import Queue from "bull";

const notificationQueue = new Queue("notifications", {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

// Add to queue
await notificationQueue.add(
  "send-email",
  {
    to: user.email,
    templateId: emailTemplates.TRANSACTION_CONFIRMATION,
    data: transactionData,
  },
  {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
  },
);

// Process queue
notificationQueue.process("send-email", async (job) => {
  await sendEmail(job.data.to, job.data.templateId, job.data.data);
});
```

---

## 12. Admin Dashboard

### 12.1 Admin Features

**User Management:**

- View all users
- Search and filter users
- View user details
- Suspend/activate accounts
- Reset passwords
- View user activity logs

**KYC Management:**

- Review pending KYC submissions
- View uploaded documents
- Approve/reject KYC
- Add review notes
- Track review metrics

**Transaction Management:**

- View all transactions
- Search and filter transactions
- Refund transactions
- View transaction details
- Export transaction reports

**Credit Management:**

- Add new credits
- Update credit information
- Manage credit availability
- Set pricing
- View credit analytics

**System Monitoring:**

- API usage metrics
- Error logs
- Performance metrics
- User activity
- Revenue analytics

### 12.2 Admin Dashboard Implementation

**Admin Routes:**

```typescript
// Admin middleware
function adminMiddleware(req, res, next) {
  if (!req.user || !["admin", "super_admin"].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      error: { code: "FORBIDDEN", message: "Admin access required" },
    });
  }
  next();
}

// Admin routes
app.use("/api/v1/admin", authenticateMiddleware, adminMiddleware);

// User management
app.get("/api/v1/admin/users", getUsersHandler);
app.get("/api/v1/admin/users/:id", getUserDetailsHandler);
app.put("/api/v1/admin/users/:id/suspend", suspendUserHandler);
app.put("/api/v1/admin/users/:id/activate", activateUserHandler);

// KYC management
app.get("/api/v1/admin/kyc/pending", getPendingKYCHandler);
app.get("/api/v1/admin/kyc/:userId", getKYCDetailsHandler);
app.put("/api/v1/admin/kyc/:userId/approve", approveKYCHandler);
app.put("/api/v1/admin/kyc/:userId/reject", rejectKYCHandler);

// Transaction management
app.get("/api/v1/admin/transactions", getTransactionsHandler);
app.get("/api/v1/admin/transactions/:id", getTransactionDetailsHandler);
app.post("/api/v1/admin/transactions/:id/refund", refundTransactionHandler);

// Analytics
app.get("/api/v1/admin/analytics/overview", getAnalyticsOverviewHandler);
app.get("/api/v1/admin/analytics/revenue", getRevenueAnalyticsHandler);
app.get("/api/v1/admin/analytics/users", getUserAnalyticsHandler);
```

**Analytics Dashboard:**

```typescript
async function getAnalyticsOverview() {
  const [
    totalUsers,
    activeUsers,
    totalTransactions,
    totalRevenue,
    pendingKYC,
    avgTransactionValue,
  ] = await Promise.all([
    db.users.count(),
    db.users.count({
      where: { lastLoginAt: { gte: new Date(Date.now() - 30 * 86400000) } },
    }),
    db.transactions.count({ where: { transactionStatus: "completed" } }),
    db.transactions.sum("amount", {
      where: { transactionStatus: "completed" },
    }),
    db.users.count({ where: { kycStatus: "pending" } }),
    db.transactions.avg("amount", {
      where: { transactionStatus: "completed" },
    }),
  ]);

  return {
    users: {
      total: totalUsers,
      active: activeUsers,
      growth: await calculateGrowthRate("users", 30),
    },
    transactions: {
      total: totalTransactions,
      revenue: totalRevenue,
      avgValue: avgTransactionValue,
      growth: await calculateGrowthRate("transactions", 30),
    },
    kyc: {
      pending: pendingKYC,
      avgReviewTime: await calculateAvgKYCReviewTime(),
    },
  };
}
```

### 12.3 Admin Audit Logging

**Log all admin actions:**

```typescript
async function logAdminAction(
  adminId: string,
  action: string,
  resourceType: string,
  resourceId: string,
  oldValues?: any,
  newValues?: any,
) {
  await db.audit_logs.create({
    userId: adminId,
    action: action,
    resourceType: resourceType,
    resourceId: resourceId,
    oldValues: oldValues,
    newValues: newValues,
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"],
  });
}

// Example usage
app.put("/api/v1/admin/kyc/:userId/approve", async (req, res) => {
  const { userId } = req.params;

  // Get old status
  const user = await db.users.findById(userId);
  const oldStatus = user.kycStatus;

  // Update status
  await db.users.update(userId, { kycStatus: "approved" });

  // Log action
  await logAdminAction(
    req.user.id,
    "kyc_approved",
    "user",
    userId,
    { kycStatus: oldStatus },
    { kycStatus: "approved" },
  );

  res.json({ success: true });
});
```

---

## 13. Security & Compliance

### 13.1 Security Best Practices

**Input Validation:**

```typescript
import { body, param, query, validationResult } from "express-validator";

// Validation middleware
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid input",
        details: errors.array(),
      },
    });
  }
  next();
};

// Example: Validate signup request
app.post(
  "/api/v1/auth/signup",
  [
    body("email").isEmail().normalizeEmail(),
    body("password")
      .isLength({ min: 8 })
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/),
    body("name").trim().isLength({ min: 2, max: 100 }),
    validateRequest,
  ],
  signupHandler,
);
```

**SQL Injection Prevention:**

```typescript
// Use parameterized queries
const user = await db.query("SELECT * FROM users WHERE email = $1", [email]);

// Use ORM (Prisma, TypeORM, Sequelize)
const user = await prisma.user.findUnique({
  where: { email: email },
});
```

**XSS Prevention:**

```typescript
import helmet from "helmet";
import xss from "xss-clean";

app.use(helmet());
app.use(xss());

// Sanitize user input
import DOMPurify from "isomorphic-dompurify";

function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input);
}
```

**CSRF Protection:**

```typescript
import csrf from "csurf";

const csrfProtection = csrf({ cookie: true });

app.use(csrfProtection);

app.get("/api/v1/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});
```

**Rate Limiting:**

```typescript
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

app.use("/api/", limiter);

// Stricter limits for sensitive endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
});

app.use("/api/v1/auth/login", authLimiter);
```

### 13.2 Data Encryption

**Encryption at Rest:**

- Database: PostgreSQL with encryption enabled
- S3: Server-side encryption (AES-256)
- Backups: Encrypted backups

**Encryption in Transit:**

- HTTPS/TLS 1.3 for all API endpoints
- Certificate from Let's Encrypt or AWS Certificate Manager
- HSTS (HTTP Strict Transport Security)

**Sensitive Data Encryption:**

```typescript
import crypto from "crypto";

const algorithm = "aes-256-gcm";
const key = Buffer.from(process.env.ENCRYPTION_KEY, "hex");

function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag();

  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
}

function decrypt(encryptedText: string): string {
  const [ivHex, authTagHex, encrypted] = encryptedText.split(":");

  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");
  const decipher = crypto.createDecipheriv(algorithm, key, iv);

  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

// Encrypt sensitive fields before storing
user.aadhaarNumber = encrypt(aadhaarNumber);
await db.users.update(user);

// Decrypt when needed
const aadhaarNumber = decrypt(user.aadhaarNumber);
```

### 13.3 DPDPA Compliance

**Digital Personal Data Protection Act (India) Requirements:**

**1. Consent Management:**

```typescript
interface ConsentRecord {
  userId: string;
  purpose: string;
  dataCategories: string[];
  consentGiven: boolean;
  consentDate: Date;
  expiryDate?: Date;
  withdrawnDate?: Date;
}

async function recordConsent(
  userId: string,
  purpose: string,
  dataCategories: string[],
) {
  await db.consent_records.create({
    userId: userId,
    purpose: purpose,
    dataCategories: dataCategories,
    consentGiven: true,
    consentDate: new Date(),
  });
}

async function withdrawConsent(userId: string, purpose: string) {
  await db.consent_records.update({
    where: { userId: userId, purpose: purpose },
    data: {
      consentGiven: false,
      withdrawnDate: new Date(),
    },
  });
}
```

**2. Right to Access:**

```typescript
app.get("/api/v1/users/me/data", authenticateMiddleware, async (req, res) => {
  const userId = req.user.id;

  // Collect all user data
  const userData = {
    profile: await db.users.findById(userId),
    kycDocuments: await db.kyc_documents.findMany({ where: { userId } }),
    transactions: await db.transactions.findMany({ where: { userId } }),
    portfolio: await db.portfolios.findMany({ where: { userId } }),
    aiAnalyses: await db.ai_mrv_analyses.findMany({ where: { userId } }),
    onboardingProgress: await db.onboarding_progress.findMany({
      where: { userId },
    }),
    notifications: await db.notifications.findMany({ where: { userId } }),
  };

  res.json({
    success: true,
    data: userData,
  });
});
```

**3. Right to Deletion:**

```typescript
app.delete("/api/v1/users/me", authenticateMiddleware, async (req, res) => {
  const userId = req.user.id;

  // Delete user data
  await db.transaction(async (tx) => {
    // Delete related records
    await tx.kyc_documents.deleteMany({ where: { userId } });
    await tx.portfolios.deleteMany({ where: { userId } });
    await tx.transactions.updateMany({
      where: { userId },
      data: { userId: null }, // Anonymize instead of delete for audit
    });
    await tx.ai_mrv_analyses.deleteMany({ where: { userId } });
    await tx.onboarding_progress.deleteMany({ where: { userId } });
    await tx.notifications.deleteMany({ where: { userId } });
    await tx.sessions.deleteMany({ where: { userId } });

    // Delete user
    await tx.users.delete({ where: { id: userId } });
  });

  // Delete files from S3
  await deleteUserFiles(userId);

  res.json({
    success: true,
    message: "Account deleted successfully",
  });
});
```

**4. Data Breach Notification:**

```typescript
async function notifyDataBreach(affectedUsers: string[], breachDetails: any) {
  // Notify affected users
  for (const userId of affectedUsers) {
    await sendEmail(userId, emailTemplates.DATA_BREACH, {
      breachDate: breachDetails.date,
      dataAffected: breachDetails.dataCategories,
      actionsTaken: breachDetails.remediation,
    });
  }

  // Notify authorities (if required)
  if (affectedUsers.length > 500) {
    await notifyDataProtectionAuthority(breachDetails);
  }

  // Log breach
  await db.security_incidents.create({
    type: "data_breach",
    affectedUsers: affectedUsers.length,
    details: breachDetails,
    reportedAt: new Date(),
  });
}
```

### 13.4 PCI DSS Compliance

**Payment Card Industry Data Security Standard:**

**Requirements:**

1. Never store full card numbers
2. Never store CVV/CVC
3. Use payment gateway hosted checkout
4. Implement 3D Secure
5. Regular security audits
6. Secure network architecture
7. Access control
8. Monitoring and logging

**Implementation:**

```typescript
// Use payment gateway (Stripe/Razorpay) for card processing
// Never handle card data directly

// Store only payment gateway tokens
interface PaymentMethod {
  userId: string;
  paymentGateway: "stripe" | "razorpay";
  paymentMethodId: string; // Gateway token
  last4: string; // Last 4 digits only
  brand: string; // Visa, Mastercard, etc.
  expiryMonth: number;
  expiryYear: number;
}

// All card processing happens on gateway side
const paymentIntent = await stripe.paymentIntents.create({
  amount: amount,
  currency: "inr",
  payment_method: paymentMethodId,
  confirm: true,
});
```

### 13.5 Security Monitoring

**Sentry Integration:**

```typescript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

// Error handling middleware
app.use(Sentry.Handlers.errorHandler());

// Capture exceptions
try {
  await riskyOperation();
} catch (error) {
  Sentry.captureException(error);
  throw error;
}
```

**Security Alerts:**

```typescript
async function detectSuspiciousActivity(userId: string, action: string) {
  const recentActions = await db.audit_logs.findMany({
    where: {
      userId: userId,
      action: action,
      createdAt: { gte: new Date(Date.now() - 3600000) }, // Last hour
    },
  });

  // Alert if too many actions
  if (recentActions.length > 10) {
    await sendSecurityAlert(userId, {
      type: "suspicious_activity",
      action: action,
      count: recentActions.length,
      timeframe: "1 hour",
    });

    // Temporarily lock account
    await db.users.update(userId, {
      accountStatus: "suspended",
      suspensionReason: "Suspicious activity detected",
    });
  }
}
```

---

## 14. DevOps & Infrastructure

### 14.1 Infrastructure Architecture

**Production Environment:**

```
┌─────────────────────────────────────────────────────────────┐
│                    CloudFlare CDN                            │
│  (DDoS protection, SSL, Caching)                             │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                  AWS Application Load Balancer               │
│  (SSL termination, Health checks, Auto-scaling)              │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────┐
│              ECS/Kubernetes Cluster                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ API Server 1 │  │ API Server 2 │  │ API Server 3 │       │
│  │ (Container)  │  │ (Container)  │  │ (Container)  │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└──────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────┐
│                    Data Layer                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ PostgreSQL   │  │ Redis Cache  │  │ S3 Storage   │       │
│  │ (RDS)        │  │ (ElastiCache)│  │              │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└──────────────────────────────────────────────────────────────┘
```

### 14.2 Docker Configuration

**Dockerfile:**

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Production image
FROM node:20-alpine

WORKDIR /app

# Copy built files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

USER nodejs

EXPOSE 3000

CMD ["node", "dist/server.js"]
```

**docker-compose.yml (Development):**

```yaml
version: "3.8"

services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:password@db:5432/carbontradex
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    volumes:
      - ./src:/app/src

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=carbontradex
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### 14.3 CI/CD Pipeline

**GitHub Actions Workflow:**

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_DB: test_db
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run tests
        run: npm test
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db

      - name: Build
        run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v3

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ap-south-1

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1

      - name: Build and push Docker image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: carbon-trade-x-api
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG

      - name: Deploy to ECS
        run: |
          aws ecs update-service \
            --cluster carbon-trade-x-cluster \
            --service carbon-trade-x-api \
            --force-new-deployment
```

### 14.4 Database Migrations

**Prisma Migrations:**

```typescript
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([email])
}

// Run migrations
// npm run prisma migrate dev --name init
// npm run prisma migrate deploy (production)
```

### 14.5 Monitoring & Logging

**Prometheus Metrics:**

```typescript
import promClient from "prom-client";

const register = new promClient.Registry();

// Default metrics
promClient.collectDefaultMetrics({ register });

// Custom metrics
const httpRequestDuration = new promClient.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  registers: [register],
});

// Middleware to track metrics
app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDuration
      .labels(
        req.method,
        req.route?.path || req.path,
        res.statusCode.toString(),
      )
      .observe(duration);
  });

  next();
});

// Metrics endpoint
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});
```

**Winston Logging:**

```typescript
import winston from "winston";

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  );
}

// Usage
logger.info("User logged in", { userId: user.id });
logger.error("Payment failed", { error: error.message, transactionId: txId });
```

### 14.6 Backup Strategy

**Database Backups:**

```bash
# Automated daily backups
0 2 * * * pg_dump -h localhost -U postgres carbontradex | gzip > /backups/carbontradex_$(date +\%Y\%m\%d).sql.gz

# Retention: 7 daily, 4 weekly, 12 monthly
# Upload to S3
aws s3 cp /backups/carbontradex_$(date +\%Y\%m\%d).sql.gz s3://carbontradex-backups/daily/
```

**S3 Versioning:**

- Enable versioning on all S3 buckets
- Lifecycle policy to move old versions to Glacier
- Cross-region replication for disaster recovery

---

## 15. Cost Estimates

### 15.1 Development Costs

| Phase                              | Duration         | Team                          | Cost (₹)                   | Cost (USD)             |
| ---------------------------------- | ---------------- | ----------------------------- | -------------------------- | ---------------------- |
| **Phase 1: Backend Foundation**    | 2-3 months       | 2-3 Backend Devs              | 500,000 - 1,000,000        | $6,000 - $12,000       |
| **Phase 2: Payment Integration**   | 1-2 months       | 1-2 Backend Devs + Compliance | 300,000 - 800,000          | $3,600 - $9,600        |
| **Phase 3: KYC System**            | 1-2 months       | 2 Backend Devs + Compliance   | 400,000 - 1,000,000        | $4,800 - $12,000       |
| **Phase 4: Real AI Integration**   | 2-3 months       | 2 AI/ML Engineers             | 600,000 - 1,500,000        | $7,200 - $18,000       |
| **Phase 5: Market Data**           | 1-2 months       | 1-2 Backend Devs              | 300,000 - 600,000          | $3,600 - $7,200        |
| **Phase 6: Registry Integration**  | 3-4 months       | 3-4 Devs + PM                 | 800,000 - 2,000,000        | $9,600 - $24,000       |
| **Phase 7: Security & Compliance** | Ongoing          | Security Consultant + DevOps  | 500,000 - 1,500,000/year   | $6,000 - $18,000/year  |
| **TOTAL**                          | **10-16 months** | **7-10 people**               | **₹3,400,000 - 8,400,000** | **$40,800 - $100,800** |

### 15.2 Infrastructure Costs (Monthly)

| Service           | Provider              | Specification          | Cost (₹/month)        | Cost (USD/month)  |
| ----------------- | --------------------- | ---------------------- | --------------------- | ----------------- |
| **Compute**       | AWS ECS/EC2           | 3x t3.medium instances | 15,000 - 30,000       | $180 - $360       |
| **Database**      | AWS RDS PostgreSQL    | db.t3.medium, 100GB    | 20,000 - 40,000       | $240 - $480       |
| **Cache**         | AWS ElastiCache Redis | cache.t3.medium        | 10,000 - 20,000       | $120 - $240       |
| **Storage**       | AWS S3                | 500GB + requests       | 5,000 - 15,000        | $60 - $180        |
| **CDN**           | CloudFlare            | Pro plan               | 1,600                 | $20               |
| **Load Balancer** | AWS ALB               | Standard               | 2,000 - 5,000         | $24 - $60         |
| **Monitoring**    | Sentry + Datadog      | Standard plans         | 10,000 - 25,000       | $120 - $300       |
| **Email**         | SendGrid              | 100K emails/month      | 6,000 - 15,000        | $75 - $180        |
| **SMS**           | Twilio                | 10K SMS/month          | 5,000 - 15,000        | $60 - $180        |
| **Backups**       | AWS S3 Glacier        | 1TB                    | 1,000 - 3,000         | $12 - $36         |
| **Domain & SSL**  | Various               | -                      | 1,000 - 2,000         | $12 - $24         |
| **TOTAL**         |                       |                        | **₹76,600 - 170,000** | **$923 - $2,040** |

### 15.3 Third-Party Service Costs (Monthly)

| Service               | Purpose            | Cost (₹/month)             | Cost (USD/month)  |
| --------------------- | ------------------ | -------------------------- | ----------------- |
| **Payment Gateway**   | Stripe/Razorpay    | 2.9% + ₹2 per transaction  | Variable          |
| **KYC Verification**  | Digio/Signzy       | ₹5-20 per verification     | Variable          |
| **AI API**            | OpenAI GPT-4       | ₹2-5 per analysis          | Variable          |
| **Market Data API**   | Carbon market data | 40,000 - 160,000           | $480 - $1,920     |
| **Face Verification** | AWS Rekognition    | ₹2-5 per comparison        | Variable          |
| **Document Storage**  | AWS S3             | Included in infrastructure | -                 |
| **TOTAL (Fixed)**     |                    | **₹40,000 - 160,000**      | **$480 - $1,920** |

**Variable Costs (Transaction-based):**

- Payment processing: 2.9% + ₹2 per transaction
- KYC verification: ₹5-20 per user
- AI analysis: ₹2-5 per project
- Face verification: ₹2-5 per verification

**Example Monthly Variable Costs (1000 users, 500 transactions):**

- Payment fees: ₹125,000 (assuming avg ₹5,000 per transaction)
- KYC: ₹10,000 (100 new users)
- AI: ₹5,000 (1000 analyses)
- Face verification: ₹500 (100 verifications)
- **Total Variable: ₹140,500**

### 15.4 Team Costs (Monthly)

| Role                         | Salary Range (₹/month) | Count   | Total (₹/month)          |
| ---------------------------- | ---------------------- | ------- | ------------------------ |
| **Senior Backend Developer** | 150,000 - 250,000      | 2       | 300,000 - 500,000        |
| **Frontend Developer**       | 100,000 - 180,000      | 1       | 100,000 - 180,000        |
| **AI/ML Engineer**           | 180,000 - 300,000      | 1       | 180,000 - 300,000        |
| **DevOps Engineer**          | 120,000 - 200,000      | 1       | 120,000 - 200,000        |
| **QA Engineer**              | 80,000 - 120,000       | 1       | 80,000 - 120,000         |
| **Product Manager**          | 150,000 - 250,000      | 1       | 150,000 - 250,000        |
| **Security Consultant**      | 100,000 - 150,000      | 0.5     | 50,000 - 75,000          |
| **TOTAL**                    |                        | **7.5** | **₹980,000 - 1,625,000** |

### 15.5 First Year Total Cost

**One-Time Costs:**

- Development: ₹3,400,000 - 8,400,000
- Security audit: ₹200,000 - 500,000
- Legal & compliance setup: ₹300,000 - 800,000
- **Total One-Time: ₹3,900,000 - 9,700,000**

**Recurring Costs (12 months):**

- Infrastructure: ₹919,200 - 2,040,000
- Third-party services (fixed): ₹480,000 - 1,920,000
- Third-party services (variable): ₹1,686,000 (estimated)
- Team salaries: ₹11,760,000 - 19,500,000
- **Total Recurring: ₹14,845,200 - 25,146,000**

**GRAND TOTAL (First Year):**

```
₹18,745,200 - 34,846,000
($225,000 - $418,000 USD)
```

### 15.6 Cost Optimization Strategies

**Infrastructure:**

- Use reserved instances (30-50% savings)
- Implement auto-scaling (pay only for what you use)
- Use spot instances for non-critical workloads
- Optimize database queries to reduce compute needs
- Implement caching aggressively

**Third-Party Services:**

- Negotiate volume discounts
- Use free tiers where available
- Implement rate limiting to control AI costs
- Cache market data to reduce API calls
- Batch KYC verifications

**Team:**

- Hire remote developers (lower costs)
- Use contractors for specialized tasks
- Outsource non-core functions
- Cross-train team members

**Estimated Savings: 20-30% of total costs**

---

## 16. Implementation Timeline

### 16.1 Detailed Timeline

**Month 1-2: Backend Foundation**

- Week 1-2: Setup infrastructure (AWS, databases, CI/CD)
- Week 3-4: Implement authentication system
- Week 5-6: Build core API endpoints
- Week 7-8: Database migrations, testing

**Deliverables:**

- ✅ Working authentication (signup, login, JWT)
- ✅ User management APIs
- ✅ Database schema implemented
- ✅ CI/CD pipeline operational

---

**Month 3: Payment Integration**

- Week 1-2: Integrate Razorpay/Stripe
- Week 3: Implement transaction flow
- Week 4: Testing and security audit

**Deliverables:**

- ✅ Payment gateway integrated
- ✅ Buy/sell transactions working
- ✅ Webhook handling
- ✅ Transaction history

---

**Month 4: KYC System**

- Week 1: Integrate Aadhaar/PAN APIs
- Week 2: Implement document upload
- Week 3: Face verification integration
- Week 4: Admin review dashboard

**Deliverables:**

- ✅ KYC document upload
- ✅ Automated verification
- ✅ Manual review system
- ✅ Status notifications

---

**Month 5-6: Real AI Integration**

- Week 1-2: OpenAI API integration
- Week 3-4: Implement multi-agent system
- Week 5-6: RAG implementation
- Week 7-8: Testing and optimization

**Deliverables:**

- ✅ Real AI MRV analysis
- ✅ Multi-agent orchestration
- ✅ Knowledge base (RAG)
- ✅ Cost optimization

---

**Month 7: Market Data Integration**

- Week 1-2: Integrate market data API
- Week 3: Implement price updates
- Week 4: Analytics dashboard

**Deliverables:**

- ✅ Real-time price data
- ✅ Price history tracking
- ✅ Market analytics

---

**Month 8-10: Registry Integration**

- Week 1-4: Verra API integration
- Week 5-8: Gold Standard integration
- Week 9-10: CCTS integration (if available)
- Week 11-12: Document generation

**Deliverables:**

- ✅ Registry submission workflows
- ✅ Status tracking
- ✅ Document management
- ✅ Webhook handling

---

**Month 11-12: Security & Polish**

- Week 1-2: Security audit
- Week 3-4: Penetration testing
- Week 5-6: Performance optimization
- Week 7-8: Bug fixes and polish

**Deliverables:**

- ✅ Security audit passed
- ✅ Performance optimized
- ✅ All bugs fixed
- ✅ Production ready

---

### 16.2 Milestone-Based Timeline

| Milestone                    | Target Date | Dependencies | Success Criteria           |
| ---------------------------- | ----------- | ------------ | -------------------------- |
| **M1: Backend MVP**          | Month 2     | None         | Auth + Core APIs working   |
| **M2: Payments Live**        | Month 3     | M1           | Real transactions possible |
| **M3: KYC Operational**      | Month 4     | M1           | Users can verify identity  |
| **M4: Real AI**              | Month 6     | M1           | AI analysis working        |
| **M5: Market Data**          | Month 7     | M1           | Real prices displayed      |
| **M6: Registry Integration** | Month 10    | M3, M4       | Can submit to registries   |
| **M7: Production Launch**    | Month 12    | All          | All features live          |

### 16.3 Critical Path

**Must-Have for Launch:**

1. Authentication system ✅
2. Payment processing ✅
3. KYC verification ✅
4. Basic trading functionality ✅
5. Security audit passed ✅

**Nice-to-Have (Can Launch Without):**

1. Real AI (can use rule-based initially)
2. Market data API (can use synthetic prices)
3. Full registry integration (can be manual initially)

**Post-Launch:**

1. Advanced analytics
2. Mobile app
3. Additional registries
4. International expansion

---

## 17. Team Requirements

### 17.1 Core Team Structure

**Phase 1 (Months 1-4): Foundation Team**

- 2x Senior Backend Developers
- 1x DevOps Engineer
- 1x Product Manager
- **Total: 4 people**

**Phase 2 (Months 5-8): Expansion Team**

- Add 1x AI/ML Engineer
- Add 1x Frontend Developer (for admin dashboard)
- Add 1x QA Engineer
- **Total: 7 people**

**Phase 3 (Months 9-12): Full Team**

- Add 1x Security Consultant (part-time)
- Add 1x Technical Writer (part-time)
- **Total: 8-9 people**

### 17.2 Role Descriptions

**Senior Backend Developer (2)**

- **Responsibilities:**
  - Design and implement REST APIs
  - Database schema design
  - Integration with third-party services
  - Code reviews
  - Performance optimization
- **Skills Required:**
  - Node.js, TypeScript, Express.js
  - PostgreSQL, Redis
  - AWS services
  - API design
  - 5+ years experience
- **Salary:** ₹150,000 - 250,000/month

---

**AI/ML Engineer (1)**

- **Responsibilities:**
  - Integrate OpenAI/Anthropic APIs
  - Implement RAG system
  - Optimize AI costs
  - Build multi-agent orchestration
  - Monitor AI quality
- **Skills Required:**
  - Python, TypeScript
  - OpenAI API, LangChain
  - Vector databases (Pinecone)
  - Prompt engineering
  - 3+ years experience
- **Salary:** ₹180,000 - 300,000/month

---

**DevOps Engineer (1)**

- **Responsibilities:**
  - Setup and maintain infrastructure
  - CI/CD pipelines
  - Monitoring and logging
  - Database backups
  - Security hardening
- **Skills Required:**
  - AWS (ECS, RDS, S3, CloudWatch)
  - Docker, Kubernetes
  - GitHub Actions
  - Terraform
  - 4+ years experience
- **Salary:** ₹120,000 - 200,000/month

---

**Frontend Developer (1)**

- **Responsibilities:**
  - Build admin dashboard
  - Enhance existing frontend
  - API integration
  - Responsive design
- **Skills Required:**
  - React, Next.js, TypeScript
  - Tailwind CSS
  - REST API integration
  - 3+ years experience
- **Salary:** ₹100,000 - 180,000/month

---

**QA Engineer (1)**

- **Responsibilities:**
  - Write and execute test plans
  - Automated testing
  - Bug tracking
  - Performance testing
  - Security testing
- **Skills Required:**
  - Jest, Playwright
  - API testing (Postman)
  - Load testing (k6)
  - 2+ years experience
- **Salary:** ₹80,000 - 120,000/month

---

**Product Manager (1)**

- **Responsibilities:**
  - Define product roadmap
  - Prioritize features
  - Coordinate with team
  - Stakeholder communication
  - User research
- **Skills Required:**
  - Product management
  - Agile methodologies
  - Technical background
  - 4+ years experience
- **Salary:** ₹150,000 - 250,000/month

---

**Security Consultant (0.5 FTE)**

- **Responsibilities:**
  - Security audits
  - Penetration testing
  - Compliance review
  - Security training
- **Skills Required:**
  - Security auditing
  - OWASP Top 10
  - PCI DSS, DPDPA
  - 5+ years experience
- **Salary:** ₹100,000 - 150,000/month (part-time)

---

### 17.3 Hiring Strategy

**Phase 1: Core Team (Month 0-1)**

1. Hire Product Manager first
2. Hire 2 Senior Backend Developers
3. Hire DevOps Engineer

**Phase 2: Expansion (Month 4-5)**

1. Hire AI/ML Engineer
2. Hire Frontend Developer
3. Hire QA Engineer

**Phase 3: Specialists (Month 8-9)**

1. Contract Security Consultant
2. Contract Technical Writer

**Hiring Channels:**

- LinkedIn
- AngelList
- Naukri.com
- Referrals
- Tech communities

**Interview Process:**

1. Resume screening
2. Technical assessment (coding test)
3. Technical interview (2 rounds)
4. Cultural fit interview
5. Reference checks
6. Offer

---

## 18. Risk Assessment & Mitigation

### 18.1 Technical Risks

| Risk                            | Probability | Impact   | Mitigation                                         |
| ------------------------------- | ----------- | -------- | -------------------------------------------------- |
| **Third-party API downtime**    | Medium      | High     | Implement fallback mechanisms, caching             |
| **Database performance issues** | Medium      | High     | Proper indexing, query optimization, read replicas |
| **Security breach**             | Low         | Critical | Regular audits, penetration testing, monitoring    |
| **AI cost overruns**            | High        | Medium   | Implement rate limiting, caching, cost monitoring  |
| **Payment gateway issues**      | Low         | High     | Multiple gateway support, robust error handling    |
| **Scalability problems**        | Medium      | High     | Load testing, auto-scaling, performance monitoring |

### 18.2 Business Risks

| Risk                            | Probability | Impact | Mitigation                                                |
| ------------------------------- | ----------- | ------ | --------------------------------------------------------- |
| **Regulatory changes**          | Medium      | High   | Stay updated, flexible architecture, legal counsel        |
| **Market competition**          | High        | Medium | Focus on unique features, quality, user experience        |
| **User adoption**               | Medium      | High   | Marketing, user feedback, iterative improvements          |
| **Budget overruns**             | Medium      | High   | Detailed planning, milestone-based funding, cost tracking |
| **Team attrition**              | Medium      | Medium | Competitive salaries, good culture, documentation         |
| **Registry API unavailability** | High        | Medium | Manual workflows as backup, multiple registry support     |

### 18.3 Mitigation Strategies

**Technical:**

- Comprehensive testing (unit, integration, e2e)
- Monitoring and alerting
- Regular backups
- Disaster recovery plan
- Code reviews
- Security audits

**Business:**

- Phased rollout
- Beta testing program
- User feedback loops
- Flexible architecture
- Strong documentation
- Knowledge sharing

---

## 19. Success Metrics

### 19.1 Technical Metrics

**Performance:**

- API response time: < 200ms (p95)
- Database query time: < 50ms (p95)
- Page load time: < 2 seconds
- Uptime: 99.9%

**Quality:**

- Test coverage: > 80%
- Bug density: < 1 bug per 1000 lines of code
- Security vulnerabilities: 0 critical, < 5 high

**Scalability:**

- Support 10,000 concurrent users
- Handle 1,000 transactions per minute
- Database: 1M+ records

### 19.2 Business Metrics

**User Metrics:**

- Monthly Active Users (MAU)
- User retention rate
- KYC completion rate
- Average session duration

**Transaction Metrics:**

- Transaction volume
- Transaction value
- Average transaction size
- Transaction success rate

**Revenue Metrics:**

- Monthly Recurring Revenue (MRR)
- Customer Acquisition Cost (CAC)
- Lifetime Value (LTV)
- Revenue per user

### 19.3 Launch Criteria

**Must-Have:**

- ✅ All core features implemented
- ✅ Security audit passed
- ✅ Performance benchmarks met
- ✅ 80%+ test coverage
- ✅ Zero critical bugs
- ✅ Documentation complete
- ✅ Monitoring in place
- ✅ Backup system operational

**Nice-to-Have:**

- ✅ Mobile responsive
- ✅ Admin dashboard
- ✅ Analytics dashboard
- ✅ Email templates
- ✅ User onboarding flow

---

## 20. Conclusion

### 20.1 Summary

This backend requirements document provides a comprehensive roadmap to transform Carbon Trade X from a demo MVP (20% real, 80% simulated) into a production-ready platform. The implementation will:

**Replace Dummy Features:**

- ❌ localStorage → ✅ PostgreSQL database
- ❌ Fake AI → ✅ Real OpenAI/Anthropic integration
- ❌ No auth → ✅ JWT authentication system
- ❌ No payments → ✅ Stripe/Razorpay integration
- ❌ Fake KYC → ✅ Real Aadhaar/PAN verification
- ❌ Hardcoded prices → ✅ Real market data
- ❌ Fake onboarding → ✅ Real registry integration

**Deliver Production Features:**

- ✅ Multi-user support with authentication
- ✅ Real payment processing
- ✅ KYC verification system
- ✅ AI-powered project analysis
- ✅ Live market data
- ✅ Registry submission workflows
- ✅ Admin dashboard
- ✅ Security & compliance

### 20.2 Investment Required

**Total First Year Cost:**

```
Development:     ₹3,400,000 - 8,400,000
Infrastructure:  ₹919,200 - 2,040,000
Services:        ₹2,166,000 (fixed + variable)
Team:            ₹11,760,000 - 19,500,000
-------------------------------------------
TOTAL:           ₹18,245,200 - 32,106,000
                 (~$219,000 - $385,000 USD)
```

### 20.3 Timeline

**10-16 months** from start to production launch

**Key Milestones:**

- Month 2: Backend MVP
- Month 3: Payments live
- Month 4: KYC operational
- Month 6: Real AI
- Month 7: Market data
- Month 10: Registry integration
- Month 12: Production launch

### 20.4 Team

**7-9 people** required:

- 2 Senior Backend Developers
- 1 AI/ML Engineer
- 1 DevOps Engineer
- 1 Frontend Developer
- 1 QA Engineer
- 1 Product Manager
- 0.5 Security Consultant
- 0.5 Technical Writer

### 20.5 Next Steps

**Immediate (Week 1-2):**

1. ✅ Review and approve this document
2. ✅ Secure funding
3. ✅ Start hiring core team
4. ✅ Setup development infrastructure

**Short-term (Month 1):**

1. ✅ Complete team hiring
2. ✅ Setup AWS infrastructure
3. ✅ Begin backend development
4. ✅ Setup CI/CD pipeline

**Medium-term (Month 2-6):**

1. ✅ Implement core features
2. ✅ Integrate third-party services
3. ✅ Conduct security audits
4. ✅ Beta testing

**Long-term (Month 7-12):**

1. ✅ Complete all features
2. ✅ Performance optimization
3. ✅ Production deployment
4. ✅ Launch marketing

---

## Appendix

### A. Technology Stack Summary

**Backend:**

- Node.js 20+
- Express.js 4.x
- TypeScript 5.x
- PostgreSQL 15+
- Redis 7+

**Authentication:**

- JWT
- bcrypt
- Passport.js

**Payments:**

- Stripe
- Razorpay

**AI:**

- OpenAI GPT-4
- Anthropic Claude
- LangChain
- Pinecone

**Storage:**

- AWS S3
- AWS RDS
- AWS ElastiCache

**Monitoring:**

- Sentry
- Prometheus
- Grafana
- Winston

**DevOps:**

- Docker
- AWS ECS
- GitHub Actions
- Terraform

### B. API Endpoint Summary

**Total Endpoints:** 50+

**Categories:**

- Authentication: 6 endpoints
- User Profile: 3 endpoints
- KYC: 6 endpoints
- Credits: 4 endpoints
- Portfolio: 2 endpoints
- Trading: 3 endpoints
- AI MRV: 3 endpoints
- Onboarding: 4 endpoints
- Admin: 10+ endpoints
- Webhooks: 3 endpoints

### C. Database Tables Summary

**Total Tables:** 15

**Core Tables:**

- users
- kyc_documents
- carbon_credits
- portfolios
- transactions
- price_history
- ai_mrv_analyses
- onboarding_progress
- sessions
- audit_logs
- notifications
- wallets
- wallet_transactions
- notification_preferences
- consent_records

### D. Third-Party Integrations

**APIs:**

- CAD Trust (existing)
- Stripe/Razorpay (payments)
- Digio/Signzy (KYC)
- OpenAI/Anthropic (AI)
- AWS Rekognition (face verification)
- SendGrid/AWS SES (email)
- Twilio/AWS SNS (SMS)
- Market data provider (TBD)
- Verra Registry (TBD)
- Gold Standard (TBD)
- CCTS (TBD)

### E. Compliance Checklist

- [ ] DPDPA (Digital Personal Data Protection Act)
- [ ] PCI DSS (Payment Card Industry)
- [ ] ISO 27001 (Information Security)
- [ ] SOC 2 (Security & Availability)
- [ ] GDPR (if serving EU users)
- [ ] AML/CFT (Anti-Money Laundering)
- [ ] KYC regulations
- [ ] Carbon credit registry requirements

### F. Documentation Deliverables

- [ ] API documentation (Swagger/OpenAPI)
- [ ] Database schema documentation
- [ ] Deployment guide
- [ ] Admin user guide
- [ ] Developer onboarding guide
- [ ] Security policies
- [ ] Incident response plan
- [ ] Disaster recovery plan
- [ ] User privacy policy
- [ ] Terms of service

---

**Document Version:** 1.0  
**Last Updated:** May 1, 2026  
**Status:** Ready for Review  
**Next Review:** After approval and funding secured

**Prepared By:** Development Team  
**Approved By:** [Pending]  
**Contact:** [Your contact information]

---

**END OF DOCUMENT**
