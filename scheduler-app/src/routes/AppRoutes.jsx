import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { ScheduleProvider } from '../context/ScheduleContext';
import { RequireAuth, RequireRole } from './RouteGuards';

import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Schedule from '../pages/Schedule';
import StaffPage from '../pages/StaffPage';
import SmartMatch from '../pages/SmartMatch';
import Requests from '../pages/Requests';
import Budget from '../pages/Budget';
import Analytics from '../pages/Analytics';
import AuditLog from '../pages/AuditLog';
import Profile from '../pages/Profile';
import FindEvents from '../pages/FindEvents';
import CheckIn from '../pages/CheckIn';

const AppRoutes = () => (
  <Routes>
    {/* Public */}
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />

    {/* Authenticated — shared dashboard shell (sidebar + navbar).
        ScheduleProvider mounts fresh here (not at the app root) so it always
        loads the latest localStorage state written during sign-up/login. */}
    <Route element={<RequireAuth><ScheduleProvider><DashboardLayout /></ScheduleProvider></RequireAuth>}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />

      {/* Admin + Manager */}
      <Route path="/schedule" element={<RequireRole roles={['Admin', 'Manager']}><Schedule /></RequireRole>} />
      <Route path="/staff" element={<RequireRole roles={['Admin', 'Manager']}><StaffPage /></RequireRole>} />
      <Route path="/requests" element={<RequireRole roles={['Admin', 'Manager']}><Requests /></RequireRole>} />

      {/* Admin only */}
      <Route path="/smart-match" element={<RequireRole roles={['Admin']}><SmartMatch /></RequireRole>} />
      <Route path="/budget" element={<RequireRole roles={['Admin']}><Budget /></RequireRole>} />
      <Route path="/analytics" element={<RequireRole roles={['Admin']}><Analytics /></RequireRole>} />
      <Route path="/audit-log" element={<RequireRole roles={['Admin']}><AuditLog /></RequireRole>} />

      {/* Staff only */}
      <Route path="/find-events" element={<RequireRole roles={['Staff']}><FindEvents /></RequireRole>} />
      <Route path="/checkin" element={<RequireRole roles={['Staff']}><CheckIn /></RequireRole>} />
    </Route>
  </Routes>
);

export default AppRoutes;
