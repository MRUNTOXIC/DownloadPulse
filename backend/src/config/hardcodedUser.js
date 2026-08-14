const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/authMiddleware');

const HARDCODED_USER = {
  userId: 'usr_hardcoded_user_001',
  email: 'meetjabhanputra2112@gmail.com',
  name: 'Meet Jobanputra',
  picture: 'https://lh3.googleusercontent.com/a/default-user',
  provider: 'google'
};

const HARDCODED_USER_TOKEN = jwt.sign(
  {
    userId: HARDCODED_USER.userId,
    email: HARDCODED_USER.email,
    name: HARDCODED_USER.name
  },
  JWT_SECRET,
  { expiresIn: '365d' }
);

async function seedHardcodedUser() {
  try {
    await User.findOneAndUpdate(
      { email: HARDCODED_USER.email },
      HARDCODED_USER,
      { upsert: true, new: true }
    );
    console.log(`[Seed User] Hardcoded User Active: ${HARDCODED_USER.name} (${HARDCODED_USER.email})`);
  } catch (e) {
    console.log(`[Seed User] Hardcoded User initialized in memory`);
  }
}

module.exports = {
  HARDCODED_USER,
  HARDCODED_USER_TOKEN,
  seedHardcodedUser
};
