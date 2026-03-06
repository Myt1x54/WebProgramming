# Task 3: Login System Implementation

This project contains two implementations of a login system using Express.js, MongoDB (Mongoose), and sessions.

## Project Structure

```
Task3/
├── usercode/          # Student written code (simple version)
│   ├── server.js
│   ├── User.js
│   ├── db.js
│   ├── package.json
│   └── .gitignore
├── aicode/            # AI generated code (advanced version)
│   ├── server.js
│   ├── User.js
│   ├── db.js
│   ├── middleware.js
│   ├── package.json
│   ├── .env
│   ├── .gitignore
│   └── README.md
├── COMPARISON_REPORT.md
└── README.md
```

## Features

Both implementations include:
- User registration
- User login with session management
- Protected dashboard route
- Logout functionality
- MongoDB integration with Mongoose

## Key Differences

### Student Code (usercode/)
- Simple and straightforward implementation
- Basic session handling
- **Plain text password storage** (for learning purposes only)
- Minimal dependencies
- Easy to understand for beginners

### AI Code (aicode/)
- Production-ready implementation
- **Password hashing with bcrypt**
- Input validation with express-validator
- Comprehensive error handling
- Environment variables for configuration
- Modular code structure
- Well-documented

## Installation

### For usercode:
```bash
cd usercode
npm install
node server.js
```

### For aicode:
```bash
cd aicode
npm install
# Create .env file with your configuration
node server.js
```

## MongoDB Setup

Make sure MongoDB is running on your system:
```bash
# Start MongoDB service
mongod
```

The application will create a database named `studentDB` with a `users` collection.

## API Endpoints

Both implementations support the same endpoints:

- `POST /register` - Register a new user
- `POST /login` - Login with username and password
- `GET /dashboard` - Access protected dashboard (requires authentication)
- `GET /logout` - Logout and destroy session

## Testing the API

You can test the endpoints using curl, Postman, or any HTTP client.

### Register a user:
```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'
```

### Login:
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}' \
  -c cookies.txt
```

### Access Dashboard:
```bash
curl http://localhost:3000/dashboard -b cookies.txt
```

### Logout:
```bash
curl http://localhost:3000/logout -b cookies.txt
```

## Git Commits

This project was developed with proper version control. View commit history:

```bash
git log --oneline
```

Commits made:
1. Initial project setup with Express server
2. Added MongoDB connection using Mongoose
3. Created User class with register method
4. Implemented login route with session
5. Added dashboard protected route
6. Implemented logout functionality

## Comparison Report

See [COMPARISON_REPORT.md](COMPARISON_REPORT.md) for a detailed comparison between student code and AI-generated code.

## Important Notes

⚠️ **Security Warning:** The student code (usercode/) stores passwords in plain text and is meant for learning purposes only. Never use it in production!

✅ **Recommendation:** For any real-world application, use the AI code approach with password hashing, validation, and proper error handling.

## Requirements Met

- ✅ Express.js server
- ✅ MongoDB with Mongoose
- ✅ express-session for session management
- ✅ JavaScript Class (User class)
- ✅ Register route
- ✅ Login route with session creation
- ✅ Protected dashboard route
- ✅ Logout route
- ✅ Authentication middleware
- ✅ Git commits with proper messages
- ✅ Comparison report

## Branch

This project is on the `task3` branch.

```bash
git branch
# * task3
```

## Author

Created for Web Programming Course - Task 3

Date: March 6, 2026
