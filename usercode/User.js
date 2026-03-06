const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

const UserModel = mongoose.model('User', userSchema);

class User {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }

    async register() {
        try {
            const newUser = new UserModel({
                username: this.username,
                password: this.password
            });
            await newUser.save();
            return 'User registered successfully';
        } catch (error) {
            if (error.code === 11000) {
                throw new Error('Username already exists');
            }
            throw error;
        }
    }

    async login() {
        const user = await UserModel.findOne({
            username: this.username,
            password: this.password
        });
        if (user) {
            return { success: true, message: 'Login successful' };
        } else {
            return { success: false, message: 'Invalid credentials' };
        }
    }
}

module.exports = User;
