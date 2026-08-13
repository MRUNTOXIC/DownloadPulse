const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/authMiddleware');

// In-Memory User Store Fallback when MongoDB is disconnected
const memoryUsers = new Map();

async function register(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const passwordHash = await bcrypt.hash(password, 10);
    const userId = `usr_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

    try {
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        return res.status(400).json({ success: false, error: 'User with this email already exists' });
      }

      const newUser = await User.create({
        userId,
        email: normalizedEmail,
        passwordHash
      });

      const token = jwt.sign({ userId: newUser.userId, email: newUser.email }, JWT_SECRET, { expiresIn: '30d' });

      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: { userId: newUser.userId, email: newUser.email, token }
      });
    } catch (dbErr) {
      // In-Memory Fallback
      if (memoryUsers.has(normalizedEmail)) {
        return res.status(400).json({ success: false, error: 'User with this email already exists' });
      }

      const memUser = { userId, email: normalizedEmail, passwordHash };
      memoryUsers.set(normalizedEmail, memUser);
      const token = jwt.sign({ userId: memUser.userId, email: memUser.email }, JWT_SECRET, { expiresIn: '30d' });

      return res.status(201).json({
        success: true,
        message: 'User registered successfully (In-Memory)',
        data: { userId: memUser.userId, email: memUser.email, token }
      });
    }
  } catch (error) {
    console.error('[Auth Register Error]:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    try {
      let user = await User.findOne({ email: normalizedEmail });
      if (!user && memoryUsers.has(normalizedEmail)) {
        user = memoryUsers.get(normalizedEmail);
      }

      if (!user) {
        return res.status(401).json({ success: false, error: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(401).json({ success: false, error: 'Invalid email or password' });
      }

      const token = jwt.sign({ userId: user.userId, email: user.email }, JWT_SECRET, { expiresIn: '30d' });

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: { userId: user.userId, email: user.email, token }
      });
    } catch (dbErr) {
      const user = memoryUsers.get(normalizedEmail);
      if (!user) {
        return res.status(401).json({ success: false, error: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(401).json({ success: false, error: 'Invalid email or password' });
      }

      const token = jwt.sign({ userId: user.userId, email: user.email }, JWT_SECRET, { expiresIn: '30d' });

      return res.status(200).json({
        success: true,
        message: 'Login successful (In-Memory)',
        data: { userId: user.userId, email: user.email, token }
      });
    }
  } catch (error) {
    console.error('[Auth Login Error]:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = {
  register,
  login
};
