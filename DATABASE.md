# Database Design and Features

## Overview

The booking-fincart system uses PostgreSQL as its primary database. The system is designed to facilitate service booking between users and service providers. The database schema consists of several interconnected entities that manage users, roles, providers, services, time slots, and bookings.

## Entity Relationship Diagram

```
┌─────────┐       ┌─────────┐       ┌──────────┐       ┌──────────┐       ┌───────────┐
│  Roles  │◄─────┤  Users  │◄─────┤ Providers │◄─────┤ Services  │◄─────┤ TimeSlots  │
└─────────┘       └─────────┘       └──────────┘       └──────────┘       └─────┬─────┘
                      │                                                         │
                      │                                                         │
                      ▼                                                         ▼
                 ┌─────────┐                                              ┌─────────┐
                 │ Bookings │◄───────────────────────────────────────────┤ Bookings │
                 └─────────┘                                              └─────────┘
```

## Entities

### 1. Roles

Defines user roles in the system.

| Column      | Type         | Description                       |
|-------------|--------------|-----------------------------------|
| id          | INT          | Primary key                       |
| name        | VARCHAR      | Role name (user or provider)      |
| description | VARCHAR      | Role description                  |
| createdAt   | TIMESTAMP    | Record creation timestamp         |
| updatedAt   | TIMESTAMP    | Record update timestamp           |

### 2. Users

Stores user information for both regular users and service providers.

| Column      | Type         | Description                       |
|-------------|--------------|-----------------------------------|
| id          | INT          | Primary key                       |
| email       | VARCHAR      | User email (unique)               |
| firstName   | VARCHAR      | User's first name                 |
| lastName    | VARCHAR      | User's last name                  |
| password    | VARCHAR      | Hashed password                   |
| phone       | VARCHAR      | User's phone number (optional)    |
| isActive    | BOOLEAN      | Account status                    |
| roleId      | INT          | Foreign key to Roles              |
| createdAt   | TIMESTAMP    | Record creation timestamp         |
| updatedAt   | TIMESTAMP    | Record update timestamp           |

### 3. Providers

Extended information for users who are service providers.

| Column        | Type         | Description                       |
|---------------|--------------|-----------------------------------|
| id            | INT          | Primary key                       |
| userId        | INT          | Foreign key to Users              |
| bio           | TEXT         | Provider biography                |
| specialization| VARCHAR      | Provider's area of expertise      |
| experience    | VARCHAR      | Provider's experience details     |
| profileImage  | VARCHAR      | URL to profile image              |
| isVerified    | BOOLEAN      | Verification status               |
| createdAt     | TIMESTAMP    | Record creation timestamp         |
| updatedAt     | TIMESTAMP    | Record update timestamp           |

### 4. Services

Services offered by providers.

| Column      | Type         | Description                       |
|-------------|--------------|-----------------------------------|
| id          | INT          | Primary key                       |
| providerId  | INT          | Foreign key to Providers          |
| title       | VARCHAR      | Service title                     |
| description | TEXT         | Service description               |
| price       | DECIMAL      | Service price                     |
| category    | VARCHAR      | Service category                  |
| image       | VARCHAR      | URL to service image              |
| isActive    | BOOLEAN      | Service availability status       |
| duration    | INT          | Service duration in minutes       |
| createdAt   | TIMESTAMP    | Record creation timestamp         |
| updatedAt   | TIMESTAMP    | Record update timestamp           |

### 5. TimeSlots

Available time slots for services.

| Column      | Type         | Description                       |
|-------------|--------------|-----------------------------------|
| id          | INT          | Primary key                       |
| serviceId   | INT          | Foreign key to Services           |
| startTime   | TIMESTAMP    | Start time of the slot            |
| endTime     | TIMESTAMP    | End time of the slot              |
| isAvailable | BOOLEAN      | Availability status               |
| createdAt   | TIMESTAMP    | Record creation timestamp         |
| updatedAt   | TIMESTAMP    | Record update timestamp           |

### 6. Bookings

Records of service bookings.

| Column        | Type         | Description                       |
|---------------|--------------|-----------------------------------|
| id            | INT          | Primary key                       |
| userId        | INT          | Foreign key to Users              |
| timeSlotId    | INT          | Foreign key to TimeSlots          |
| status        | ENUM         | Booking status                    |
| notes         | TEXT         | Additional booking notes          |
| totalAmount   | DECIMAL      | Total booking amount              |
| paymentStatus | ENUM         | Payment status                    |
| createdAt     | TIMESTAMP    | Record creation timestamp         |
| updatedAt     | TIMESTAMP    | Record update timestamp           |

## Key Features

1. **User Role Management**: Separate roles for regular users and service providers
2. **Provider Profiles**: Extended profiles for service providers with specializations and verification
3. **Service Catalog**: Detailed service listings with pricing and duration
4. **Time Slot Management**: Flexible scheduling system for service availability
5. **Booking System**: Complete booking flow with status tracking
6. **Payment Tracking**: Payment status monitoring for bookings

## Database Relationships

- A User has one Role
- A User can be a Provider (if they have the provider role)
- A Provider can offer multiple Services
- Each Service has multiple TimeSlots
- Users can make Bookings for specific TimeSlots
- Each Booking is associated with a User and a TimeSlot

## Indexes and Performance Considerations

- Indexes on foreign keys for optimized joins
- Composite index on `serviceId` and `startTime` for efficient time slot queries
- Unique constraint on user email for preventing duplicate accounts
