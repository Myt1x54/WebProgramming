const express = require('express');
const session = require('express-session');
const db = require('./db');
const User = require('./User');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));

// Session configuration
app.use(session({
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: false
}));

// Authentication Middleware
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.status(401).send('Please login first');
    }
}

// Register Route
app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = new User(username, password);
        const message = await user.register();
        res.send(message);
    } catch (error) {
        console.error('Register error:', error);
        res.status(400).send(error.message || 'Registration failed');
    }
});

// Login Route
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = new User(username, password);
        const result = await user.login();
        
        if (result.success) {
            req.session.user = username;
            res.send(result.message);
        } else {
            res.status(401).send(result.message);
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('Login failed');
    }
});

// Dashboard Route (Protected)
app.get('/dashboard', isAuthenticated, (req, res) => {
    res.send(`Welcome ${req.session.user}`);
});

// Logout Route
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.send('Logout successful');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
