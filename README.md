# Event Management System

A full-featured Node.js backend project for an Event Management System using Express, MySQL, and Sequelize.

## Features

- JWT-based authentication (login, registration, protected routes)
- Password hashing with bcrypt
- Validation for input data
- Error handling middleware
- Environment variables for DB and JWT secret
- CORS enabled, body-parser for JSON
- Organized in MVC structure
- Swagger API documentation

## Database Schema

The system includes the following models:

- **Users**: userID, userName, userEmail, userPhone, createdAt, userPassword, userRole(admin/user)
- **Activities**: activityID, activityTitle, activityDesc, activityType, activityDate, activityLocation, capacity, status(open/closed/postponed)
- **ActivityPresenters**: presenterID, activityID, presenterName, presenterJob
- **Tickets**: ticketID, ticketName, ticketDesc, ticketNo, price, status(available/reserved/cancelled), userID, activityID

See the [ERD.md](./ERD.md) file for a visual representation of the database schema and relationships.

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)

## Installation

1. Clone the repository

```bash
git clone <repository-url>
cd event-management
```

2. Install dependencies

```bash
npm install
```

3. Configure environment variables

Create a `.env` file in the root directory with the following variables:

```
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=event_management

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=1d
```

4. Create the database

```sql
CREATE DATABASE event_management;
```

5. Seed the database with sample data

```bash
npm run seed
```

## Running the Application

### Development mode

```bash
npm run dev
```

### Production mode

```bash
npm start
```

## API Documentation

Once the server is running, you can access the Swagger API documentation at:

```
http://localhost:3000/api-docs
```

## API Endpoints

### Users
- POST /api/users/register → Register new user
- POST /api/users/login → Login user and return JWT
- GET /api/users/profile → Get logged-in user profile (protected)
- PUT /api/users/:id → Update user data (admin or self)
- DELETE /api/users/:id → Delete user (admin only)
- GET /api/users/ → List all users (admin only)

### Activities
- POST /api/activities → Create new activity (admin)
- GET /api/activities → List all activities
- GET /api/activities/:id → Get single activity details
- PUT /api/activities/:id → Update activity (admin)
- DELETE /api/activities/:id → Delete activity (admin)
- GET /api/activities/search?type=&date= → Search/filter activities by type/date

### ActivityPresenters
- POST /api/activities/:activityID/presenters → Add presenter to activity (admin)
- GET /api/activities/:activityID/presenters → List presenters for activity
- PUT /api/presenters/:id → Update presenter info (admin)
- DELETE /api/presenters/:id → Remove presenter (admin)

### Tickets
- POST /api/tickets → Create ticket (admin)
- GET /api/tickets → List all tickets
- GET /api/tickets/:id → Get ticket details
- PUT /api/tickets/:id → Update ticket info (admin)
- DELETE /api/tickets/:id → Delete ticket (admin)
- POST /api/tickets/:id/reserve → Reserve ticket (user)
- POST /api/tickets/:id/cancel → Cancel reservation (user)
