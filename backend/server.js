require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const staffRoutes = require('./routes/staff');
const assignmentRoutes = require('./routes/assignments');
const requestRoutes = require('./routes/requests');
const checkinRoutes = require('./routes/checkins');
const auditLogRoutes = require('./routes/auditlog');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000' }));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Scheduling System Backend is running!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/checkins', checkinRoutes);
app.use('/api/audit-log', auditLogRoutes);

// Fallback error handler — keeps a thrown error from crashing the process
// and always returns JSON instead of an HTML stack trace.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Unexpected server error.' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
