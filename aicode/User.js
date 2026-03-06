const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

/**
 * User Schema with validation
 */
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const UserModel = mongoose.model('User', userSchema);

/**
 * User Class with enhanced security and error handling
 */
class User {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }

    /**
     * Register a new user with password hashing
     * @returns {Object} - Success message or error
     */
    async register() {
        try {
            // Check if user already exists
            const existingUser = await UserModel.findOne({ username: this.username });
            if (existingUser) {
                return {
                    success: false,
                    message: 'Username already exists'
                };
            }

            // Hash password before saving
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(this.password, saltRounds);

            // Create new user
            const newUser = new UserModel({
                username: this.username,
                password: hashedPassword
            });

            await newUser.save();
            
            return {
                success: true,
                message: 'User registered successfully'
            };
        } catch (error) {
            console.error('Registration error:', error);
            return {
                success: false,
                message: 'Error registering user: ' + error.message
            };
        }
    }

    /**
     * Login user with password verification
     * @returns {Object} - Success status and message
     */
    async login() {
        try {
            // Find user by username
            const user = await UserModel.findOne({ username: this.username });
            
            if (!user) {
                return {
                    success: false,
                    message: 'Invalid username or password'
                };
            }

            // Compare password with hashed password
            const isPasswordValid = await bcrypt.compare(this.password, user.password);
            
            if (isPasswordValid) {
                return {
                    success: true,
                    message: 'Login successful',
                    user: {
                        username: user.username,
                        createdAt: user.createdAt
                    }
                };
            } else {
                return {
                    success: false,
                    message: 'Invalid username or password'
                };
            }
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                message: 'Error during login: ' + error.message
            };
        }
    }

    /**
     * Static method to find user by username
     * @param {String} username 
     * @returns {Object} - User object or null
     */
    static async findByUsername(username) {
        try {
            return await UserModel.findOne({ username });
        } catch (error) {
            console.error('Error finding user:', error);
            return null;
        }
    }
}

module.exports = User;
