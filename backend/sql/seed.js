// Run with: npm run seed
// Populates the same demo data the old localStorage version shipped with.
require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('../config/db');

const DEFAULT_STAFF = [
  { name:'Jennifer Martinez', email:'jennifer.martinez@company.com', skills:['Event Management','Customer Service','Leadership','Budgeting'], seniority:'Senior', hoursAvailable:40, hoursBooked:28, rating:4.9, nextAvailable:'2026-06-14', assignedEvents:3 },
  { name:'Michael Rodriguez', email:'michael.rodriguez@company.com', skills:['Event Management','Logistics','Leadership','Vendor Management'], seniority:'Senior', hoursAvailable:40, hoursBooked:32, rating:4.8, nextAvailable:'2026-06-15', assignedEvents:2 },
  { name:'Sarah Chen', email:'sarah.chen@company.com', skills:['Customer Service','Event Management','Communication','Registration'], seniority:'Senior', hoursAvailable:40, hoursBooked:24, rating:4.7, nextAvailable:'2026-06-14', assignedEvents:2 },
  { name:'David Thompson', email:'david.thompson@company.com', skills:['Tech Support','AV Equipment','Customer Service','Registration'], seniority:'Mid', hoursAvailable:35, hoursBooked:20, rating:4.6, nextAvailable:'2026-06-15', assignedEvents:2 },
  { name:'Lisa Wong', email:'lisa.wong@company.com', skills:['Event Management','Catering Coordination','Customer Service'], seniority:'Mid', hoursAvailable:38, hoursBooked:26, rating:4.5, nextAvailable:'2026-06-14', assignedEvents:3 },
  { name:'James Kumar', email:'james.kumar@company.com', skills:['Customer Service','Registration','Communication'], seniority:'Mid', hoursAvailable:30, hoursBooked:18, rating:4.4, nextAvailable:'2026-06-16', assignedEvents:2 },
  { name:'Emma Johnson', email:'emma.johnson@company.com', skills:['Customer Service','Registration','Event Support'], seniority:'Junior', hoursAvailable:25, hoursBooked:12, rating:4.2, nextAvailable:'2026-06-17', assignedEvents:1 },
  { name:'Alex Patel', email:'alex.patel@company.com', skills:['Event Support','Registration','Logistics Support'], seniority:'Junior', hoursAvailable:20, hoursBooked:8, rating:4.1, nextAvailable:'2026-06-18', assignedEvents:1 },
  { name:'Priya Sharma', email:'priya.sharma@company.com', skills:['Event Management','Communication','Customer Service','AV Equipment'], seniority:'Mid', hoursAvailable:36, hoursBooked:15, rating:4.5, nextAvailable:'2026-06-15', assignedEvents:2 },
  { name:'Tom Nguyen', email:'tom.nguyen@company.com', skills:['Tech Support','AV Equipment','Registration'], seniority:'Junior', hoursAvailable:22, hoursBooked:10, rating:4.0, nextAvailable:'2026-06-18', assignedEvents:1 },
];

const DEFAULT_EVENTS = [
  { name:'Summer Tech Conference 2026', date:'2026-07-15', time:'09:00', location:'Downtown Convention Center', status:'open', requiredSkills:['Event Management','Tech Support','Customer Service'], requiredSeniority:'Senior', requiredStaff:10, assignedStaff:0, budget:25000, spent:0, attendees:600, complexity:0.9 },
  { name:'Executive Gala Dinner', date:'2026-06-28', time:'18:30', location:'The Grand Ballroom Hotel', status:'scheduled', requiredSkills:['Event Management','Customer Service','Catering Coordination'], requiredSeniority:'Senior', requiredStaff:8, assignedStaff:4, budget:18000, spent:6000, attendees:150, complexity:0.85 },
  { name:'Product Launch Event', date:'2026-06-21', time:'14:00', location:'Office Auditorium', status:'open', requiredSkills:['Event Management','Tech Support','Customer Service'], requiredSeniority:'Mid', requiredStaff:6, assignedStaff:2, budget:8000, spent:1500, attendees:200, complexity:0.65 },
  { name:'Corporate Team Building Day', date:'2026-07-08', time:'10:00', location:'Riverside Park', status:'open', requiredSkills:['Event Management','Customer Service','Logistics'], requiredSeniority:'Mid', requiredStaff:5, assignedStaff:1, budget:6000, spent:800, attendees:120, complexity:0.6 },
  { name:'Client Appreciation Lunch', date:'2026-06-30', time:'12:00', location:'Downtown Restaurant', status:'scheduled', requiredSkills:['Event Management','Customer Service'], requiredSeniority:'Mid', requiredStaff:4, assignedStaff:3, budget:4000, spent:2500, attendees:50, complexity:0.5 },
  { name:'Staff Orientation Session', date:'2026-06-24', time:'09:00', location:'Conference Room A', status:'open', requiredSkills:['Customer Service','Registration'], requiredSeniority:'Junior', requiredStaff:2, assignedStaff:0, budget:500, spent:0, attendees:15, complexity:0.3 },
  { name:'Monthly Team Meeting', date:'2026-06-27', time:'14:00', location:'Main Office', status:'in-progress', requiredSkills:['Customer Service'], requiredSeniority:'Junior', requiredStaff:2, assignedStaff:2, budget:300, spent:200, attendees:30, complexity:0.2 },
  { name:'Client Webinar Series', date:'2026-07-05', time:'15:00', location:'Virtual Event', status:'open', requiredSkills:['Tech Support','Customer Service'], requiredSeniority:'Mid', requiredStaff:3, assignedStaff:1, budget:2000, spent:400, attendees:250, complexity:0.4 },
  { name:'Annual Awards Ceremony', date:'2026-08-10', time:'19:00', location:'City Grand Hall', status:'open', requiredSkills:['Event Management','Catering Coordination','Customer Service','AV Equipment'], requiredSeniority:'Senior', requiredStaff:12, assignedStaff:0, budget:32000, spent:0, attendees:500, complexity:0.95 },
  { name:'Charity Fundraiser Gala', date:'2026-07-25', time:'17:00', location:'Rooftop Venue', status:'open', requiredSkills:['Event Management','Catering Coordination','Customer Service'], requiredSeniority:'Mid', requiredStaff:7, assignedStaff:2, budget:15000, spent:3000, attendees:300, complexity:0.75 },
  { name:'New Employee Onboarding', date:'2026-06-23', time:'09:00', location:'HR Training Room', status:'scheduled', requiredSkills:['Registration','Customer Service'], requiredSeniority:'Junior', requiredStaff:2, assignedStaff:1, budget:400, spent:100, attendees:20, complexity:0.25 },
  { name:'Quarterly Business Review', date:'2026-07-01', time:'10:00', location:'Board Room', status:'open', requiredSkills:['Event Management','Communication'], requiredSeniority:'Senior', requiredStaff:3, assignedStaff:0, budget:2500, spent:0, attendees:40, complexity:0.55 },
];

const genCheckInCode = () => Array.from({ length: 6 }, () => '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'[Math.floor(Math.random() * 32)]).join('');

async function seed() {
  const conn = await pool.getConnection();
  try {
    console.log('Seeding staff...');
    const staffIds = {};
    for (const s of DEFAULT_STAFF) {
      const [result] = await conn.query(
        `INSERT INTO staff (name, email, skills, seniority, hours_available, hours_booked, rating, next_available, assigned_events)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [s.name, s.email, JSON.stringify(s.skills), s.seniority, s.hoursAvailable, s.hoursBooked, s.rating, s.nextAvailable, s.assignedEvents]
      );
      staffIds[s.email] = result.insertId;
    }

    console.log('Seeding events...');
    for (const e of DEFAULT_EVENTS) {
      await conn.query(
        `INSERT INTO events (name, date, time, location, status, required_skills, required_seniority, required_staff, assigned_staff, budget, spent, attendees, complexity, check_in_code)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [e.name, e.date, e.time, e.location, e.status, JSON.stringify(e.requiredSkills), e.requiredSeniority, e.requiredStaff, e.assignedStaff, e.budget, e.spent, e.attendees, e.complexity, genCheckInCode()]
      );
    }

    console.log('Seeding demo accounts (admin123 / manager123 / staff123)...');
    const demoUsers = [
      { name: 'Admin User', email: 'admin@scheduler.com', password: 'Admin123!', role: 'Admin', staffId: null },
      { name: 'Event Manager', email: 'manager@scheduler.com', password: 'Manager123!', role: 'Manager', staffId: null },
      { name: 'Jennifer Martinez', email: 'staff@scheduler.com', password: 'Staff123!', role: 'Staff', staffId: staffIds['jennifer.martinez@company.com'] },
    ];
    for (const u of demoUsers) {
      const hash = await bcrypt.hash(u.password, 10);
      await conn.query('INSERT INTO users (name, email, password_hash, role, staff_id) VALUES (?, ?, ?, ?, ?)', [u.name, u.email, hash, u.role, u.staffId]);
    }

    console.log('Done. Demo logins:');
    console.log('  admin@scheduler.com / Admin123!');
    console.log('  manager@scheduler.com / Manager123!');
    console.log('  staff@scheduler.com / Staff123!');
    console.log('(Note: these are now real bcrypt-hashed passwords in MySQL, stronger than the demo credentials the old localStorage version used.)');
  } finally {
    conn.release();
    pool.end();
  }
}

seed().catch(err => { console.error('Seed failed:', err); process.exit(1); });
