const express = require('express');
const pool = require('../config/db');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);

const toClient = (row) => ({
  id: row.id,
  staffId: row.staff_id,
  eventId: row.event_id,
  staffName: row.staff_name,
  status: row.status,
  requestedAt: row.requested_at,
});

// GET /api/requests
router.get('/', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM requests ORDER BY id DESC');
  res.json(rows.map(toClient));
});

// POST /api/requests  { staffId, eventId, staffName }  (Staff)
router.post('/', requireRole('Staff'), async (req, res) => {
  const { staffId, eventId, staffName } = req.body;
  const [existing] = await pool.query("SELECT id FROM requests WHERE staff_id=? AND event_id=? AND status='pending'", [staffId, eventId]);
  if (existing.length) return res.json({ ok: true, alreadyRequested: true });
  const [result] = await pool.query('INSERT INTO requests (staff_id, event_id, staff_name) VALUES (?, ?, ?)', [staffId, eventId, staffName]);
  const [rows] = await pool.query('SELECT * FROM requests WHERE id = ?', [result.insertId]);
  res.status(201).json(toClient(rows[0]));
});

// DELETE /api/requests/:id  (Staff, cancelling their own pending request)
router.delete('/:id', async (req, res) => {
  await pool.query('DELETE FROM requests WHERE id = ?', [req.params.id]);
  res.json({ ok: true });
});

// PATCH /api/requests/:id/approve  (Admin/Manager)
router.patch('/:id/approve', requireRole('Admin', 'Manager'), async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query('SELECT * FROM requests WHERE id = ?', [req.params.id]);
    const request = rows[0];
    if (!request) return res.status(404).json({ error: 'Request not found.' });

    await conn.beginTransaction();
    const [staffRows] = await conn.query('SELECT id FROM staff WHERE id = ?', [request.staff_id]);
    const [eventRows] = await conn.query('SELECT id FROM events WHERE id = ?', [request.event_id]);
    if (staffRows.length && eventRows.length) {
      const [existingAssignment] = await conn.query('SELECT id FROM assignments WHERE staff_id=? AND event_id=?', [request.staff_id, request.event_id]);
      if (!existingAssignment.length) {
        await conn.query('INSERT INTO assignments (staff_id, event_id) VALUES (?, ?)', [request.staff_id, request.event_id]);
        await conn.query('UPDATE events SET assigned_staff = LEAST(required_staff, assigned_staff + 1) WHERE id = ?', [request.event_id]);
        await conn.query('UPDATE staff SET hours_booked = LEAST(hours_available, hours_booked + 4), assigned_events = assigned_events + 1 WHERE id = ?', [request.staff_id]);
      }
    }
    await conn.query("UPDATE requests SET status='approved' WHERE id=?", [req.params.id]);
    await conn.commit();
    res.json({ ok: true, staffLinked: staffRows.length > 0, eventLinked: eventRows.length > 0 });
  } catch (err) {
    await conn.rollback();
    console.error('Approve request error:', err);
    res.status(500).json({ error: 'Could not approve request.' });
  } finally {
    conn.release();
  }
});

// PATCH /api/requests/:id/decline  (Admin/Manager)
router.patch('/:id/decline', requireRole('Admin', 'Manager'), async (req, res) => {
  await pool.query("UPDATE requests SET status='declined' WHERE id=?", [req.params.id]);
  res.json({ ok: true });
});

module.exports = router;
