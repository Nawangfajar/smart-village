// middlewares/authMiddleware.js

const jwt = require('jsonwebtoken');

// Gunakan nilai rahasia dari .env, atau fallback ke 'secretkey'
const jwtSecret = process.env.JWT_SECRET || 'secretkey';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer <token>

  if (!token) {
    return res.status(401).json({ message: 'Token tidak ditemukan' });
  }

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token tidak valid' });
    }

    req.user = user; // simpan data user di request
    next();
  });
};

module.exports = authenticateToken;
