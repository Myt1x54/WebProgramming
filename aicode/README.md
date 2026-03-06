# Login System - AI Code Version

## Features
- User registration with password hashing (bcrypt)
- Secure login with session management
- Protected dashboard route
- Input validation
- Error handling
- Environment variables for configuration
- MongoDB integration with Mongoose

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file in the root directory:

```
MONGODB_URI=mongodb://localhost:27017/studentDB
PORT=3000
SESSION_SECRET=your-secret-key-here
NODE_ENV=development
```

## Running the Application

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

## API Endpoints

### POST /register
Register a new user

**Body:**
```json
{
  "username": "testuser",
  "password": "password123"
}
```

### POST /login
Login with username and password

**Body:**
```json
{
  "username": "testuser",
  "password": "password123"
}
```

### GET /dashboard
Protected route - requires authentication

### GET /logout
Logout and destroy session

## Security Features
- Password hashing with bcrypt
- Input validation with express-validator
- Secure session configuration
- HTTP-only cookies
- Environment-based configuration
