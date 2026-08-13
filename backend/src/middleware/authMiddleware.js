const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'downloadpulse_jwt_secret_dev_key_2026';

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // If optional/unauthenticated mode, proceed with null userId for backwards compatibility
    req.userId = null;
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Invalid or expired authorization token' });
  }
}

function requireAuth(req, res, next) {
  if (!req.userId) {
    return res.status(401).json({ success: false, error: 'Authentication required' });
  }
  next();
}

module.exports = {
  authMiddleware,
  requireAuth,
  JWT_SECRET
};
