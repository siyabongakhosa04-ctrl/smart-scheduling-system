const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const { signToken } = require('../utils/jwt');

const router = express.Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const COMMON_PASSWORDS = new Set(['password','password1','password123','12345678','123456789','qwerty123','letmein','admin123','welcome1','iloveyou','abc12345','111111111','sunshine1']);
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_MS = 30_000;

// In-memory lockout tracker, keyed by email. Fine for a single-server demo;
// a multi-instance deployment would move this to Redis or a DB table.
const loginAttempts = new Map();

const getPasswordIssue = (password) => {
  if (password.length < 8) return 'Password must be 8+ characters with uppercase, lowercase, a number, and a special character.';
  const checks = [/[A-Z]/, /[a-z]/, /[0-9]/, /[^A-Za-z0-9]/];
  if (!checks.every(re => re.test(password))) return 'Password must be 8+ characters with uppercase, lowercase, a number, and a special character.';
  if (COMMON_PASSWORDS.has(password.toLowerCase())) return 'That password is too common — choose something less predictable.';
  return null;
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, role, position, password, confirmPassword } = req.body;
  if (!name || !name.trim()) return res.status(400).json({ error: 'Enter your full name.' });
  if (!email || !EMAIL_RE.test(email.trim())) return res.status(400).json({ error: 'Enter a valid email address.' });
  if (!['Admin', 'Manager', 'Staff'].includes(role)) return res.status(400).json({ error: 'Invalid role.' });
  const passwordIssue = getPasswordIssue(password || '');
  if (passwordIssue) return res.status(400).json({ error: passwordIssue });
  if (password !== confirmPassword) return res.status(400).json({ error: "Passwords don't match." });

  const emailLower = email.trim().toLowerCase();
  const conn = await pool.getConnection();
  try {
    const [existing] = await conn.query('SELECT id FROM users WHERE email = ?', [emailLower]);
    if (existing.length) return res.status(409).json({ error: 'An account with this email already exists.' });

    const passwordHash = await bcrypt.hash(password, 10);

    await conn.beginTransaction();
    let staffId = null;
    if (role === 'Staff') {
      const [staffRows] = await conn.query('SELECT id FROM staff WHERE email = ?', [emailLower]);
      if (staffRows.length) {
        staffId = staffRows[0].id;
      } else {
        const [result] = await conn.query(
          `INSERT INTO staff (name, email, skills, seniority, hours_available, hours_booked, rating, next_available, assigned_events)
           VALUES (?, ?, ?, 'Junior', 20, 0, 4.0, CURDATE(), 0)`,
          [name.trim(), emailLower, JSON.stringify(position ? [position] : [])]
        );
        staffId = result.insertId;
      }
    }

    const [userResult] = await conn.query(
      'INSERT INTO users (name, email, password_hash, role, staff_id) VALUES (?, ?, ?, ?, ?)',
      [name.trim(), emailLower, passwordHash, role, staffId]
    );
    await conn.commit();

    res.json({ ok: true, email: emailLower, id: userResult.insertId });
  } catch (err) {
    await conn.rollback();
    console.error('Register error:', err);
    res.status(500).json({ error: 'Something went wrong creating your account.' });
  } finally {
    conn.release();
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Enter your email and password.' });
  const emailLower = email.trim().toLowerCase();

  const attempt = loginAttempts.get(emailLower) || { count: 0, lockUntil: 0 };
  if (attempt.lockUntil > Date.now()) {
    return res.status(429).json({ error: 'locked', lockedForSeconds: Math.ceil((attempt.lockUntil - Date.now()) / 1000) });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [emailLower]);
    const user = rows[0];
    const valid = user ? await bcrypt.compare(password, user.password_hash) : false;

    if (!valid) {
      const newCount = attempt.count + 1;
      const locked = newCount >= MAX_LOGIN_ATTEMPTS;
      loginAttempts.set(emailLower, { count: locked ? 0 : newCount, lockUntil: locked ? Date.now() + LOCKOUT_MS : 0 });
      if (locked) return res.status(429).json({ error: 'locked', lockedForSeconds: LOCKOUT_MS / 1000, justLocked: true });
      return res.status(401).json({ error: 'invalid', attemptsRemaining: MAX_LOGIN_ATTEMPTS - newCount });
    }

    loginAttempts.delete(emailLower);
    const payload = { id: user.id, name: user.name, email: user.email, role: user.role, staffId: user.staff_id };
    const token = signToken(payload);
    res.json({ ok: true, token, user: payload });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Something went wrong signing you in.' });
  }
});

module.exports = router;
