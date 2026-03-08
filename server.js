const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sbstocks';
mongoose.connect(uri)
  .then(() => console.log('MongoDB connection established successfully!'))
  .catch((err) => console.error('MongoDB connection failed:', err.message));

// Test Route
app.get('/', (req, res) => {
    res.send('SB Stocks API is running...');
});

// Auth Routes
app.use('/api/auth', require('./routes/authRoutes'));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));