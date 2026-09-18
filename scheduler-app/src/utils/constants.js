// Brand tokens, seed data, and shared enums for Smart Scheduler.

export const BRAND = {
  cream: '#FDF1E0',
  creamSoft: '#FBE7CE',
  orange: '#F0812E',
  orangeDark: '#D96A1F',
  green: '#1E3A1E',
  greenSoft: '#2D4A2D',
  badgeGreen: '#DCEEDC',
  badgePeach: '#FBDCC4',
  badgeYellow: '#FCEBBB',
  text: '#2D2A26',
  textMuted: '#6B675F',
};


export const HERO_IMAGE = '/hero-buffet.jpg';

export const DEMO_USERS = [
  { email: 'admin@scheduler.com', password: 'admin123', name: 'Admin User', role: 'Admin' },
  { email: 'manager@scheduler.com', password: 'manager123', name: 'Event Manager', role: 'Manager' },
  { email: 'staff@scheduler.com', password: 'staff123', name: 'Jennifer Martinez', role: 'Staff', staffId: 1 },
];

export const DEFAULT_EVENTS = [
  { id:1, name:'Summer Tech Conference 2026', date:'2026-07-15', time:'09:00', location:'Downtown Convention Center', status:'open', requiredSkills:['Event Management','Tech Support','Customer Service'], requiredSeniority:'Senior', requiredStaff:10, assignedStaff:0, budget:25000, spent:0, attendees:600, complexity:0.9 },
  { id:2, name:'Executive Gala Dinner', date:'2026-06-28', time:'18:30', location:'The Grand Ballroom Hotel', status:'scheduled', requiredSkills:['Event Management','Customer Service','Catering Coordination'], requiredSeniority:'Senior', requiredStaff:8, assignedStaff:4, budget:18000, spent:6000, attendees:150, complexity:0.85 },
  { id:3, name:'Product Launch Event', date:'2026-06-21', time:'14:00', location:'Office Auditorium', status:'open', requiredSkills:['Event Management','Tech Support','Customer Service'], requiredSeniority:'Mid', requiredStaff:6, assignedStaff:2, budget:8000, spent:1500, attendees:200, complexity:0.65 },
  { id:4, name:'Corporate Team Building Day', date:'2026-07-08', time:'10:00', location:'Riverside Park', status:'open', requiredSkills:['Event Management','Customer Service','Logistics'], requiredSeniority:'Mid', requiredStaff:5, assignedStaff:1, budget:6000, spent:800, attendees:120, complexity:0.6 },
  { id:5, name:'Client Appreciation Lunch', date:'2026-06-30', time:'12:00', location:'Downtown Restaurant', status:'scheduled', requiredSkills:['Event Management','Customer Service'], requiredSeniority:'Mid', requiredStaff:4, assignedStaff:3, budget:4000, spent:2500, attendees:50, complexity:0.5 },
  { id:6, name:'Staff Orientation Session', date:'2026-06-24', time:'09:00', location:'Conference Room A', status:'open', requiredSkills:['Customer Service','Registration'], requiredSeniority:'Junior', requiredStaff:2, assignedStaff:0, budget:500, spent:0, attendees:15, complexity:0.3 },
  { id:7, name:'Monthly Team Meeting', date:'2026-06-27', time:'14:00', location:'Main Office', status:'in-progress', requiredSkills:['Customer Service'], requiredSeniority:'Junior', requiredStaff:2, assignedStaff:2, budget:300, spent:200, attendees:30, complexity:0.2 },
  { id:8, name:'Client Webinar Series', date:'2026-07-05', time:'15:00', location:'Virtual Event', status:'open', requiredSkills:['Tech Support','Customer Service'], requiredSeniority:'Mid', requiredStaff:3, assignedStaff:1, budget:2000, spent:400, attendees:250, complexity:0.4 },
  { id:9, name:'Annual Awards Ceremony', date:'2026-08-10', time:'19:00', location:'City Grand Hall', status:'open', requiredSkills:['Event Management','Catering Coordination','Customer Service','AV Equipment'], requiredSeniority:'Senior', requiredStaff:12, assignedStaff:0, budget:32000, spent:0, attendees:500, complexity:0.95 },
  { id:10, name:'Charity Fundraiser Gala', date:'2026-07-25', time:'17:00', location:'Rooftop Venue', status:'open', requiredSkills:['Event Management','Catering Coordination','Customer Service'], requiredSeniority:'Mid', requiredStaff:7, assignedStaff:2, budget:15000, spent:3000, attendees:300, complexity:0.75 },
  { id:11, name:'New Employee Onboarding', date:'2026-06-23', time:'09:00', location:'HR Training Room', status:'scheduled', requiredSkills:['Registration','Customer Service'], requiredSeniority:'Junior', requiredStaff:2, assignedStaff:1, budget:400, spent:100, attendees:20, complexity:0.25 },
  { id:12, name:'Quarterly Business Review', date:'2026-07-01', time:'10:00', location:'Board Room', status:'open', requiredSkills:['Event Management','Communication'], requiredSeniority:'Senior', requiredStaff:3, assignedStaff:0, budget:2500, spent:0, attendees:40, complexity:0.55 },
];


export const DEFAULT_STAFF = [
  { id:1, name:'Jennifer Martinez', email:'jennifer.martinez@company.com', skills:['Event Management','Customer Service','Leadership','Budgeting'], seniority:'Senior', hoursAvailable:40, hoursBooked:28, rating:4.9, nextAvailable:'2026-06-14', assignedEvents:3 },
  { id:2, name:'Michael Rodriguez', email:'michael.rodriguez@company.com', skills:['Event Management','Logistics','Leadership','Vendor Management'], seniority:'Senior', hoursAvailable:40, hoursBooked:32, rating:4.8, nextAvailable:'2026-06-15', assignedEvents:2 },
  { id:3, name:'Sarah Chen', email:'sarah.chen@company.com', skills:['Customer Service','Event Management','Communication','Registration'], seniority:'Senior', hoursAvailable:40, hoursBooked:24, rating:4.7, nextAvailable:'2026-06-14', assignedEvents:2 },
  { id:4, name:'David Thompson', email:'david.thompson@company.com', skills:['Tech Support','AV Equipment','Customer Service','Registration'], seniority:'Mid', hoursAvailable:35, hoursBooked:20, rating:4.6, nextAvailable:'2026-06-15', assignedEvents:2 },
  { id:5, name:'Lisa Wong', email:'lisa.wong@company.com', skills:['Event Management','Catering Coordination','Customer Service'], seniority:'Mid', hoursAvailable:38, hoursBooked:26, rating:4.5, nextAvailable:'2026-06-14', assignedEvents:3 },
  { id:6, name:'James Kumar', email:'james.kumar@company.com', skills:['Customer Service','Registration','Communication'], seniority:'Mid', hoursAvailable:30, hoursBooked:18, rating:4.4, nextAvailable:'2026-06-16', assignedEvents:2 },
  { id:7, name:'Emma Johnson', email:'emma.johnson@company.com', skills:['Customer Service','Registration','Event Support'], seniority:'Junior', hoursAvailable:25, hoursBooked:12, rating:4.2, nextAvailable:'2026-06-17', assignedEvents:1 },
  { id:8, name:'Alex Patel', email:'alex.patel@company.com', skills:['Event Support','Registration','Logistics Support'], seniority:'Junior', hoursAvailable:20, hoursBooked:8, rating:4.1, nextAvailable:'2026-06-18', assignedEvents:1 },
  { id:9, name:'Priya Sharma', email:'priya.sharma@company.com', skills:['Event Management','Communication','Customer Service','AV Equipment'], seniority:'Mid', hoursAvailable:36, hoursBooked:15, rating:4.5, nextAvailable:'2026-06-15', assignedEvents:2 },
  { id:10, name:'Tom Nguyen', email:'tom.nguyen@company.com', skills:['Tech Support','AV Equipment','Registration'], seniority:'Junior', hoursAvailable:22, hoursBooked:10, rating:4.0, nextAvailable:'2026-06-18', assignedEvents:1 },
];

// Ensures a Staff-role user (demo or self-registered via sign up) always has a
// real entry in the staff roster, so their requests/assignments can resolve to
// a name, skills, etc. elsewhere in the app. Runs at login time.

export const ALL_SKILLS = ['Event Management','Tech Support','Customer Service','Logistics','Catering Coordination','Registration','AV Equipment','Communication','Leadership','Budgeting','Vendor Management','Event Support','Logistics Support'];
export const SENIORITY_LEVELS = ['Junior','Mid','Senior','Lead'];
export const STATUS_OPTIONS = ['open','scheduled','in-progress','completed'];

export const STAFF_POSITIONS = ['Waiter / Server', 'Usher', 'Driver', 'Event Coordinator', 'Kitchen Staff', 'Bartender', 'Security', 'AV Technician'];

export const statusClasses = { open:'bg-red-100 text-red-800 border-red-200', scheduled:'bg-orange-100 text-orange-800 border-orange-200', 'in-progress':'bg-yellow-100 text-yellow-800 border-yellow-200', completed:'bg-green-100 text-green-800 border-green-200' };
export const seniorityClasses = { Junior:'bg-green-100 text-green-800', Mid:'bg-orange-100 text-orange-800', Senior:'bg-emerald-100 text-emerald-800', Lead:'bg-amber-100 text-amber-800' };
export const requestStatusClasses = { pending:'bg-amber-100 text-amber-800 border-amber-200', approved:'bg-green-100 text-green-800 border-green-200', declined:'bg-red-100 text-red-800 border-red-200' };

export const roleBadgeClasses = { Admin:'bg-orange-100 text-orange-700', Manager:'bg-green-100 text-green-700', Staff:'bg-teal-100 text-teal-700' };
export const roleAvatarClasses = { Admin:{ bg:'bg-orange-100', text:'text-orange-700' }, Manager:{ bg:'bg-green-100', text:'text-green-700' }, Staff:{ bg:'bg-teal-100', text:'text-teal-700' } };
export const roleLabels = { Admin:'⚡ Admin Access', Manager:'👤 Manager Access', Staff:'🧑‍🍳 Staff Access' };
