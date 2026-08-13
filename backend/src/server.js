const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Database connection
connectDB();

// API Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'DownloadPulse Backend API',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/activities', require('./routes/activityRoutes'));
app.use('/api/devices', require('./routes/deviceRoutes'));

// Start Server
app.listen(PORT, () => {
  console.log(`========================================`);
  console.log(`  DownloadPulse Backend API Running     `);
  console.log(`========================================`);
  console.log(`Server listening on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
