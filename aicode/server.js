const express = require('express');
const session = require('express-session');
require('dotenv').config();
const connectDB = require('./db');
const User = require('./User');
const { isAuthenticated, validateRegistration, validateLogin } = require('./middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));

// Session configuration with enhanced security
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
}));

// Home Route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Login System API',
        endpoints: {
            register: 'POST /register',
            login: 'POST /login',
            dashboard: 'GET /dashboard',
            logout: 'GET /logout'
        }
    });
});

/**
 * Register Route
 * POST /register
 * Body: { username, password }
 */
app.post('/register', validateRegistration, async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const user = new User(username, password);
        const result = await user.register();
        
        if (result.success) {
            res.status(201).json({
                success: true,
                message: result.message
            });
        } else {
            res.status(400).json({
                success: false,
                message: result.message
            });
        }
    } catch (error) {
        console.error('Register route error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

/**
 * Login Route
 * POST /login
 * Body: { username, password }
 */
app.post('/login', validateLogin, async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const user = new User(username, password);
        const result = await user.login();
        
        if (result.success) {
            // Create session
            req.session.user = username;
            req.session.loginTime = new Date();
            
            res.json({
                success: true,
                message: result.message
            });
        } else {
            res.status(401).json({
                success: false,
                message: result.message
            });
        }
    } catch (error) {
        console.error('Login route error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

/**
 * Dashboard Route (Protected)
 * GET /dashboard
 * Requires authentication
 */
app.get('/dashboard', isAuthenticated, (req, res) => {
    res.json({
        success: true,
        message: `Welcome ${req.session.user}`,
        user: req.session.user,
        loginTime: req.session.loginTime
    });
});

/**
 * Logout Route
 * GET /logout
 * Destroys the session
 */
app.get('/logout', (req, res) => {
    if (req.session.user) {
        const username = req.session.user;
        req.session.destroy((err) => {
            if (err) {
                console.error('Session destruction error:', err);
                res.status(500).json({
                    success: false,
                    message: 'Error logging out'
                });
            } else {
                res.json({
                    success: true,
                    message: 'Logout successful',
                    user: username
                });
            }
        });
    } else {
        res.json({
            success: true,
            message: 'No active session'
        });
    }
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

// Start Server - Connect to MongoDB first
const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
            console.log(`Environment: ${process.env.NODE_ENV}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    process.exit(0);
});
