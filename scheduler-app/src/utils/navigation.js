import { BarChart3, Calendar, Users, Zap, Bell, DollarSign, TrendingUp, Activity, Search, QrCode } from 'lucide-react';

export const ADMIN_NAV = [
  { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { path: '/schedule', label: 'Schedule', icon: Calendar },
  { path: '/staff', label: 'Staff', icon: Users },
  { path: '/smart-match', label: 'Smart Match', icon: Zap },
  { path: '/requests', label: 'Staff Requests', icon: Bell },
  { path: '/budget', label: 'Budget Tracker', icon: DollarSign },
  { path: '/analytics', label: 'Analytics', icon: TrendingUp },
  { path: '/audit-log', label: 'Audit Log', icon: Activity },
];

export const MANAGER_NAV = [
  { path: '/dashboard', label: 'My Dashboard', icon: BarChart3 },
  { path: '/schedule', label: 'My Events', icon: Calendar },
  { path: '/staff', label: 'My Staff', icon: Users },
  { path: '/requests', label: 'Staff Requests', icon: Bell },
];

export const STAFF_NAV = [
  { path: '/dashboard', label: 'My Dashboard', icon: BarChart3 },
  { path: '/find-events', label: 'Find Events', icon: Search },
  { path: '/checkin', label: 'QR Check-In', icon: QrCode },
];

export const NAV_BY_ROLE = { Admin: ADMIN_NAV, Manager: MANAGER_NAV, Staff: STAFF_NAV };
