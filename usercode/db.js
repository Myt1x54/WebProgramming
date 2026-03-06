const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/studentDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('✅ Connected to MongoDB successfully!');
}).catch((err) => {
    console.error('❌ MongoDB connection error:', err);
});

const db = mongoose.connection;

db.on('error', (err) => {
    console.error('MongoDB error:', err);
});

db.once('open', function() {
    console.log('MongoDB connection opened');
});

module.exports = db;
