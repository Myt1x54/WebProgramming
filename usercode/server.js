const express = require('express');
const session = require('express-session');
const db = require('./db');
const User = require('./User');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: false
}));

function isAuthenticated(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.status(401).send('Please login first');
    }
}

app.post('/register', async (req, res) => {
    try {
        console.log('📝 Register request received:', req.body);
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).send('Username and password are required');
        }
        
        const user = new User(username, password);
        const message = await user.register();
        console.log('✅ Registration successful:', username);
        res.send(message);
    } catch (error) {
        console.error('❌ Register error:', error.message);
        res.status(400).send(error.message || 'Registration failed');
    }
});

app.post('/login', async (req, res) => {
    try {
        console.log('🔑 Login request received:', req.body.username);
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).send('Username and password are required');
        }
        
        const user = new User(username, password);
        const result = await user.login();
        
        if (result.success) {
            req.session.user = username;
            console.log('✅ Login successful:', username);
            res.send(result.message);
        } else {
            console.log('❌ Login failed:', username);
            res.status(401).send(result.message);
        }
    } catch (error) {
        console.error('❌ Login error:', error.message);
        res.status(500).send('Login failed');
    }
});

app.get('/dashboard', isAuthenticated, (req, res) => {
    res.send(`Welcome ${req.session.user}`);
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.send('Logout successful');
});

app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`📂 Serving static files from 'public' directory`);
    console.log(`🔗 Open http://localhost:${PORT} in your browser\n`);
});
