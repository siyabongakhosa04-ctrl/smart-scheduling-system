const express = require('express');
const pool = require('../config/db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

// GET /api/checkins
router.get('/', async (req, res) => {
  const [rows] = await pool.query('SELECT staff_id AS staffId, event_id AS eventId, time FROM checkins');
  res.json(rows);
});

// POST /api/checkins  { staffId, eventId, code }
router.post('/', async (req, res) => {
  const { staffId, eventId, code } = req.body;
  const [eventRows] = await pool.query('SELECT check_in_code FROM events WHERE id = ?', [eventId]);
  if (!eventRows.length) return res.status(404).json({ error: 'Event not found.' });

  const [assigned] = await pool.query('SELECT id FROM assignments WHERE staff_id=? AND event_id=?', [staffId, eventId]);
  if (!assigned.length) return res.status(403).json({ error: "You're not assigned to this event." });

  const [already] = await pool.query('SELECT id FROM checkins WHERE staff_id=? AND event_id=?', [staffId, eventId]);
  if (already.length) return res.status(409).json({ error: 'Already checked in.' });

  if (String(code).trim().toUpperCase() !== eventRows[0].check_in_code) {
    return res.status(400).json({ error: 'Invalid check-in code.' });
  }

  await pool.query('INSERT INTO checkins (staff_id, event_id) VALUES (?, ?)', [staffId, eventId]);
  res.status(201).json({ ok: true });
});

module.exports = router;
