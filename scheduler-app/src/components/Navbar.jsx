import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell } from 'lucide-react';
import { roleBadgeClasses } from '../utils/constants';
import { useAuth } from '../context/AuthContext';
import { useScheduling } from '../context/ScheduleContext';
import NotificationsPanel from './NotificationsPanel';

const Navbar = ({ onMenuClick }) => {
  const { currentUser } = useAuth();
  const { events } = useScheduling();
  const [notifOpen, setNotifOpen] = useState(false);
  const navigate = useNavigate();
  const isStaff = currentUser.role === 'Staff';
  const notifCount = events.filter(e => e.assignedStaff < e.requiredStaff && e.status !== 'completed').length;

  const goToMatch = (eventId) => navigate(`/smart-match?event=${eventId}`);

  return (
    <header className="flex items-center gap-3 px-4 lg:px-6 py-3 bg-white border-b border-stone-200">
      <button onClick={onMenuClick} className="lg:hidden p-1.5 hover:bg-stone-100 rounded-lg transition"><Menu className="w-5 h-5 text-stone-600" /></button>
      <span className="font-bold text-stone-900 lg:hidden">Scheduler</span>
      <div className="ml-auto flex items-center gap-3">
        <span className={`hidden sm:block text-xs font-bold px-2.5 py-1 rounded-full ${roleBadgeClasses[currentUser.role] || roleBadgeClasses.Manager}`}>{currentUser.role}</span>
        {!isStaff && (
          <div className="relative">
            <button onClick={() => setNotifOpen(v => !v)} className="relative p-2 hover:bg-stone-100 rounded-lg transition">
              <Bell className="w-5 h-5 text-stone-600" />
              {notifCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">{notifCount}</span>}
            </button>
            {notifOpen && <NotificationsPanel onClose={() => setNotifOpen(false)} onGoToMatch={(id) => { goToMatch(id); setNotifOpen(false); }} />}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
