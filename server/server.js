const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require('passport');

// Load environment variables
dotenv.config();

// Import passport configuration
require('./config/passport');

// Import routes
const authRoutes = require('./routes/authRoutes');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

// Import development database
const DevDatabase = require('./dev-db');

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Initialize passport
app.use(passport.initialize());

// Make dev database available globally for development
if (process.env.NODE_ENV === 'development') {
  global.devDb = new DevDatabase();
  console.log('🔧 Using development database (SQLite)');
}

// Routes
app.use('/api/auth', authRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running successfully',
    timestamp: new Date().toISOString(),
    database: process.env.NODE_ENV === 'development' ? 'SQLite (Development)' : 'MongoDB'
  });
});

// Error handling middleware (should be last)
app.use(errorHandler);

// Handle undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Database connection
const connectDB = async () => {
  try {
    // In development mode, use SQLite if MongoDB is not available
    if (process.env.NODE_ENV === 'development' && (!process.env.MONGODB_URI || process.env.MONGODB_URI === 'mongodb://localhost:27017/mern-auth-app')) {
      console.log('🔧 Development mode: Using SQLite database');
      console.log('💡 To use MongoDB, install it locally or set up MongoDB Atlas');
      return;
    }

    // Check if MongoDB URI is provided
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI is not defined in environment variables');
      console.log('Please set MONGODB_URI in your .env file');
      console.log('For development, you can use: MONGODB_URI=mongodb://localhost:27017/mern-auth-app');
      process.exit(1);
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error.message);
    console.log('Make sure MongoDB is running on your system');
    console.log('You can install MongoDB from: https://www.mongodb.com/try/download/community');
    console.log('Or use MongoDB Atlas (cloud): https://www.mongodb.com/atlas');
    process.exit(1);
  }
};

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
  });
};

startServer();

module.exports = app;
