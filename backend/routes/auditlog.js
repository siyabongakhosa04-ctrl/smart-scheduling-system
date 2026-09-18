const express = require('express');
const pool = require('../config/db');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

// GET /api/audit-log  (Admin only)
router.get('/', requireRole('Admin'), async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM audit_log ORDER BY id DESC LIMIT 200');
  res.json(rows);
});

// POST /api/audit-log  { action, detail, user }
router.post('/', async (req, res) => {
  const { action, detail, user } = req.body;
  await pool.query('INSERT INTO audit_log (action, detail, user) VALUES (?, ?, ?)', [action, detail, user]);
  res.status(201).json({ ok: true });
});

module.exports = router;
