// Load environment variables
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./src/routes');
const { errorHandler } = require('./src/middleware/error');
const { initializeDatabase } = require('./src/config/database');

const app = express();

// CORS configuration
app.use(cors({
  origin: '*', // Allow all domains
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/api', routes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.use('/', (req, res, next) => {
  res.json({ status: 'OK', message: 'Server is running finally!!!' });
});

// Error handling middleware
app.use(errorHandler);

// Initialize database and start server
const startServer = async () => {
  try {
    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
