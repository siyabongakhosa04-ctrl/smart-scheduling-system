const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET = process.env.JWT_SECRET || 'dev-secret-change-this-in-production';

const signToken = (payload) => jwt.sign(payload, SECRET, { expiresIn: '7d' });
const verifyToken = (token) => jwt.verify(token, SECRET);

module.exports = { signToken, verifyToken };
