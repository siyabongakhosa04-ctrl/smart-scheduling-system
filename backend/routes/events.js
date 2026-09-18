const express = require('express');
const pool = require('../config/db');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

const genCheckInCode = () => Array.from({ length: 6 }, () => '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'[Math.floor(Math.random() * 32)]).join('');

const toClient = (row) => ({
  id: row.id,
  name: row.name,
  date: row.date instanceof Date ? row.date.toISOString().slice(0, 10) : row.date,
  time: typeof row.time === 'string' ? row.time.slice(0, 5) : row.time,
  location: row.location,
  status: row.status,
  requiredSkills: typeof row.required_skills === 'string' ? JSON.parse(row.required_skills) : row.required_skills,
  requiredSeniority: row.required_seniority,
  requiredStaff: row.required_staff,
  assignedStaff: row.assigned_staff,
  budget: Number(row.budget),
  spent: Number(row.spent),
  attendees: row.attendees,
  complexity: Number(row.complexity),
  checkInCode: row.check_in_code,
});

router.use(requireAuth);

// GET /api/events
router.get('/', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM events ORDER BY id');
  res.json(rows.map(toClient));
});

// POST /api/events  (Admin only)
router.post('/', requireRole('Admin'), async (req, res) => {
  const d = req.body;
  const checkInCode = genCheckInCode();
  const [result] = await pool.query(
    `INSERT INTO events (name, date, time, location, status, required_skills, required_seniority, required_staff, assigned_staff, budget, spent, attendees, complexity, check_in_code)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?)`,
    [d.name, d.date, d.time, d.location, d.status || 'open', JSON.stringify(d.requiredSkills || []), d.requiredSeniority || 'Mid', d.requiredStaff || 1, d.budget || 0, d.spent || 0, d.attendees || 0, d.complexity ?? 0.5, checkInCode]
  );
  const [rows] = await pool.query('SELECT * FROM events WHERE id = ?', [result.insertId]);
  res.status(201).json(toClient(rows[0]));
});

// PUT /api/events/:id  (Admin only)
router.put('/:id', requireRole('Admin'), async (req, res) => {
  const d = req.body;
  await pool.query(
    `UPDATE events SET name=?, date=?, time=?, location=?, status=?, required_skills=?, required_seniority=?, required_staff=?, budget=?, spent=?, attendees=?, complexity=? WHERE id=?`,
    [d.name, d.date, d.time, d.location, d.status, JSON.stringify(d.requiredSkills || []), d.requiredSeniority, d.requiredStaff, d.budget, d.spent, d.attendees, d.complexity, req.params.id]
  );
  const [rows] = await pool.query('SELECT * FROM events WHERE id = ?', [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: 'Event not found.' });
  res.json(toClient(rows[0]));
});

// DELETE /api/events/:id  (Admin only)
router.delete('/:id', requireRole('Admin'), async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    // Roll back staff hours/assignment counts for anyone assigned to this event
    const [assigned] = await conn.query('SELECT staff_id FROM assignments WHERE event_id = ?', [req.params.id]);
    for (const row of assigned) {
      await conn.query('UPDATE staff SET hours_booked = GREATEST(0, hours_booked - 4), assigned_events = GREATEST(0, assigned_events - 1) WHERE id = ?', [row.staff_id]);
    }
    await conn.query('DELETE FROM events WHERE id = ?', [req.params.id]);
    await conn.commit();
    res.json({ ok: true });
  } catch (err) {
    await conn.rollback();
    console.error('Delete event error:', err);
    res.status(500).json({ error: 'Could not delete event.' });
  } finally {
    conn.release();
  }
});

module.exports = router;
