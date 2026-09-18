const express = require('express');
const pool = require('../config/db');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

const toClient = (row) => ({
  id: row.id,
  name: row.name,
  email: row.email,
  skills: typeof row.skills === 'string' ? JSON.parse(row.skills) : row.skills,
  seniority: row.seniority,
  hoursAvailable: row.hours_available,
  hoursBooked: row.hours_booked,
  rating: Number(row.rating),
  nextAvailable: row.next_available instanceof Date ? row.next_available.toISOString().slice(0, 10) : row.next_available,
  assignedEvents: row.assigned_events,
});

router.use(requireAuth);

// GET /api/staff
router.get('/', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM staff ORDER BY id');
  res.json(rows.map(toClient));
});

// POST /api/staff  (Admin only)
router.post('/', requireRole('Admin'), async (req, res) => {
  const d = req.body;
  try {
    const [result] = await pool.query(
      `INSERT INTO staff (name, email, skills, seniority, hours_available, hours_booked, rating, next_available, assigned_events)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)`,
      [d.name, d.email, JSON.stringify(d.skills || []), d.seniority || 'Mid', d.hoursAvailable || 40, d.hoursBooked || 0, d.rating || 4.0, d.nextAvailable || null]
    );
    const [rows] = await pool.query('SELECT * FROM staff WHERE id = ?', [result.insertId]);
    res.status(201).json(toClient(rows[0]));
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'A staff member with this email already exists.' });
    console.error('Create staff error:', err);
    res.status(500).json({ error: 'Could not add staff member.' });
  }
});

// PUT /api/staff/:id  (Admin only)
router.put('/:id', requireRole('Admin'), async (req, res) => {
  const d = req.body;
  await pool.query(
    `UPDATE staff SET name=?, email=?, skills=?, seniority=?, hours_available=?, hours_booked=?, rating=?, next_available=? WHERE id=?`,
    [d.name, d.email, JSON.stringify(d.skills || []), d.seniority, d.hoursAvailable, d.hoursBooked, d.rating, d.nextAvailable || null, req.params.id]
  );
  const [rows] = await pool.query('SELECT * FROM staff WHERE id = ?', [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: 'Staff member not found.' });
  res.json(toClient(rows[0]));
});

// DELETE /api/staff/:id  (Admin only)
router.delete('/:id', requireRole('Admin'), async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [assigned] = await conn.query('SELECT event_id FROM assignments WHERE staff_id = ?', [req.params.id]);
    for (const row of assigned) {
      await conn.query('UPDATE events SET assigned_staff = GREATEST(0, assigned_staff - 1) WHERE id = ?', [row.event_id]);
    }
    await conn.query('DELETE FROM staff WHERE id = ?', [req.params.id]);
    await conn.commit();
    res.json({ ok: true });
  } catch (err) {
    await conn.rollback();
    console.error('Delete staff error:', err);
    res.status(500).json({ error: 'Could not remove staff member.' });
  } finally {
    conn.release();
  }
});

module.exports = router;
