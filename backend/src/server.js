const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const { connectDB } = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// CORS Security Configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-device-token']
}));

app.use(express.json({ limit: '2mb' }));

// Rate Limiters for Security
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30,
  message: { success: false, error: 'Too many authentication attempts. Please try again in 15 minutes.' }
});

const pairingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, error: 'Too many pairing requests. Please try again in 15 minutes.' }
});

// Initialize Database connection
connectDB();

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'DownloadPulse Cloud Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authLimiter, require('./routes/authRoutes'));
app.use('/api/pairing', pairingLimiter, require('./routes/pairingRoutes'));
app.use('/api/activities', require('./routes/activityRoutes'));
app.use('/api/devices', require('./routes/deviceRoutes'));

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('[Unhandled Backend Error]:', err.stack || err.message);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`========================================`);
  console.log(`  DownloadPulse Backend API Running     `);
  console.log(`========================================`);
  console.log(`Server listening on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
