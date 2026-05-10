const app = require('../backend/src/app');
const connectDB = require('../backend/src/config/db');

// Vercel serverless function handler
module.exports = async (req, res) => {
  try {
    // Ensure database connection
    await connectDB();
    
    // Hand off the request to the Express app
    return app(req, res);
  } catch (error) {
    console.error('Serverless Function Error:', error);
    res.status(500).json({ 
      message: 'Internal Server Error', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};
