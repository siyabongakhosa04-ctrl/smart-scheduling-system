const express = require('express');
const pool = require('../config/db');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);

// GET /api/assignments
router.get('/', async (req, res) => {
  const [rows] = await pool.query('SELECT staff_id AS staffId, event_id AS eventId FROM assignments');
  res.json(rows);
});

// POST /api/assignments  { staffId, eventId }  (Admin/Manager)
router.post('/', requireRole('Admin', 'Manager'), async (req, res) => {
  const { staffId, eventId } = req.body;
  const conn = await pool.getConnection();
  try {
    const [existing] = await conn.query('SELECT id FROM assignments WHERE staff_id = ? AND event_id = ?', [staffId, eventId]);
    if (existing.length) return res.json({ ok: true, alreadyAssigned: true });

    await conn.beginTransaction();
    await conn.query('INSERT INTO assignments (staff_id, event_id) VALUES (?, ?)', [staffId, eventId]);
    await conn.query('UPDATE events SET assigned_staff = LEAST(required_staff, assigned_staff + 1) WHERE id = ?', [eventId]);
    await conn.query('UPDATE staff SET hours_booked = LEAST(hours_available, hours_booked + 4), assigned_events = assigned_events + 1 WHERE id = ?', [staffId]);
    await conn.commit();
    res.status(201).json({ ok: true });
  } catch (err) {
    await conn.rollback();
    console.error('Assign error:', err);
    res.status(500).json({ error: 'Could not assign staff to event.' });
  } finally {
    conn.release();
  }
});

// DELETE /api/assignments  { staffId, eventId }  (Admin/Manager)
router.delete('/', requireRole('Admin', 'Manager'), async (req, res) => {
  const { staffId, eventId } = req.body;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query('DELETE FROM assignments WHERE staff_id = ? AND event_id = ?', [staffId, eventId]);
    await conn.query('UPDATE events SET assigned_staff = GREATEST(0, assigned_staff - 1) WHERE id = ?', [eventId]);
    await conn.query('UPDATE staff SET hours_booked = GREATEST(0, hours_booked - 4), assigned_events = GREATEST(0, assigned_events - 1) WHERE id = ?', [staffId]);
    await conn.commit();
    res.json({ ok: true });
  } catch (err) {
    await conn.rollback();
    console.error('Unassign error:', err);
    res.status(500).json({ error: 'Could not unassign staff.' });
  } finally {
    conn.release();
  }
});

module.exports = router;
