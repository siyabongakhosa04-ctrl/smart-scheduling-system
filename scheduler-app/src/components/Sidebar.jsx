import { NavLink, useNavigate } from 'react-router-dom';
import { ChefHat, X, LogOut, User } from 'lucide-react';
import { BRAND, roleBadgeClasses, roleAvatarClasses, roleLabels } from '../utils/constants';
import { NAV_BY_ROLE } from '../utils/navigation';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ open, onClose, pendingCount }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const navItems = NAV_BY_ROLE[currentUser.role] || NAV_BY_ROLE.Manager;
  const avatarCls = roleAvatarClasses[currentUser.role] || roleAvatarClasses.Manager;

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={onClose} />}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-stone-200 z-40 flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background:`linear-gradient(135deg, ${BRAND.orange}, ${BRAND.orangeDark})` }}><ChefHat className="w-4 h-4 text-white" /></div>
            <span className="font-bold text-lg" style={{ color: BRAND.green }}>Smart Scheduler</span>
          </div>
          <button onClick={onClose} className="lg:hidden p-1 hover:bg-stone-100 rounded-lg"><X className="w-5 h-5 text-stone-500" /></button>
        </div>
        <div className="px-4 pt-3 pb-1">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${roleBadgeClasses[currentUser.role] || roleBadgeClasses.Manager}`}>{roleLabels[currentUser.role] || currentUser.role}</span>
        </div>
        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
          {navItems.map(({ path, label, icon: Icon }) => (
            <NavLink key={path} to={path} onClick={onClose} className={({ isActive }) => `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${isActive ? 'bg-orange-50 text-orange-700' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'}`}>
              <Icon className="w-5 h-5 shrink-0" />{label}
              {path === '/requests' && pendingCount > 0 && <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{pendingCount}</span>}
            </NavLink>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-stone-100">
          <NavLink to="/profile" onClick={onClose} className="flex items-center gap-3 mb-3 rounded-xl hover:bg-stone-50 p-1.5 -m-1.5 transition">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${avatarCls.bg}`}>
              <span className={`text-xs font-bold ${avatarCls.text}`}>{currentUser.name.split(' ').map(n=>n[0]).join('').slice(0,2)}</span>
            </div>
            <div className="min-w-0 flex-1"><p className="text-sm font-semibold text-stone-900 truncate">{currentUser.name}</p><p className="text-xs text-stone-500">{currentUser.role}</p></div>
            <User className="w-3.5 h-3.5 text-stone-300 shrink-0" />
          </NavLink>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 hover:text-red-700 transition font-medium"><LogOut className="w-4 h-4" />Logout</button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
