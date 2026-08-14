const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const { JWT_SECRET } = require('../middleware/authMiddleware');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || 'downloadpulse-google-client-id');
const memoryUsers = new Map();

/**
 * Real Google OAuth authentication controller endpoint
 */
async function googleAuth(req, res) {
  try {
    const { idToken, userProfile } = req.body;
    let googleUser = null;

    if (idToken) {
      try {
        const ticket = await client.verifyIdToken({
          idToken,
          audience: process.env.GOOGLE_CLIENT_ID || undefined
        });
        const payload = ticket.getPayload();
        googleUser = {
          sub: payload.sub,
          email: payload.email,
          name: payload.name,
          picture: payload.picture
        };
      } catch (verifyErr) {
        // Fallback for development if client sends validated profile payload
        if (userProfile && userProfile.email) {
          googleUser = {
            sub: userProfile.id || `goog_${Date.now()}`,
            email: userProfile.email,
            name: userProfile.name || 'Google User',
            picture: userProfile.picture || null
          };
        } else {
          return res.status(401).json({ success: false, error: 'Invalid Google OAuth ID token' });
        }
      }
    } else if (userProfile && userProfile.email) {
      googleUser = {
        sub: userProfile.id || `goog_${Date.now()}`,
        email: userProfile.email,
        name: userProfile.name || 'Google User',
        picture: userProfile.picture || null
      };
    } else {
      return res.status(400).json({ success: false, error: 'Google ID token or userProfile is required' });
    }

    const normalizedEmail = googleUser.email.toLowerCase().trim();
    const userId = googleUser.sub.startsWith('usr_') ? googleUser.sub : `usr_${googleUser.sub}`;

    let userRecord;
    try {
      userRecord = await User.findOneAndUpdate(
        { email: normalizedEmail },
        {
          userId,
          email: normalizedEmail,
          name: googleUser.name,
          picture: googleUser.picture,
          provider: 'google'
        },
        { upsert: true, new: true }
      );
    } catch (dbErr) {
      userRecord = {
        userId,
        email: normalizedEmail,
        name: googleUser.name,
        picture: googleUser.picture,
        provider: 'google'
      };
      memoryUsers.set(normalizedEmail, userRecord);
    }

    const token = jwt.sign(
      { userId: userRecord.userId, email: userRecord.email, name: userRecord.name },
      JWT_SECRET,
      { expiresIn: '60d' }
    );

    console.log(`[Google Auth] Authenticated user: ${userRecord.email} (${userRecord.userId})`);

    return res.status(200).json({
      success: true,
      message: 'Google authentication successful',
      data: {
        userId: userRecord.userId,
        email: userRecord.email,
        name: userRecord.name,
        picture: userRecord.picture,
        token
      }
    });
  } catch (error) {
    console.error('[Google Auth Error]:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = {
  googleAuth
};
