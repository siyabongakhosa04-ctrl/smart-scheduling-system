import { useNavigate } from 'react-router-dom';
import { LogOut, Mail, Shield, Briefcase } from 'lucide-react';
import { BRAND, roleBadgeClasses, roleAvatarClasses } from '../utils/constants';
import { useAuth } from '../context/AuthContext';
import { useScheduling } from '../context/ScheduleContext';

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const { staffMembers } = useScheduling();
  const navigate = useNavigate();
  const avatarCls = roleAvatarClasses[currentUser.role] || roleAvatarClasses.Manager;
  const myStaffRecord = currentUser.staffId ? staffMembers.find(s => s.id === currentUser.staffId) : null;

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="space-y-6 max-w-xl">
      <h2 className="text-3xl font-display font-bold" style={{ color:BRAND.green }}>Profile</h2>

      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${avatarCls.bg}`}>
            <span className={`text-xl font-black ${avatarCls.text}`}>{currentUser.name.split(' ').map(n=>n[0]).join('').slice(0,2)}</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-stone-900">{currentUser.name}</h3>
            <span className={`inline-block mt-1 text-xs font-bold px-2.5 py-1 rounded-full ${roleBadgeClasses[currentUser.role] || roleBadgeClasses.Manager}`}>{currentUser.role}</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 text-sm">
            <Mail className="w-4 h-4 text-stone-400 shrink-0" />
            <div><p className="text-xs text-stone-500">Email</p><p className="font-semibold text-stone-900">{currentUser.email}</p></div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Shield className="w-4 h-4 text-stone-400 shrink-0" />
            <div><p className="text-xs text-stone-500">Role</p><p className="font-semibold text-stone-900">{currentUser.role}</p></div>
          </div>
          {myStaffRecord && (
            <div className="flex items-center gap-3 text-sm">
              <Briefcase className="w-4 h-4 text-stone-400 shrink-0" />
              <div><p className="text-xs text-stone-500">Position</p><p className="font-semibold text-stone-900">{myStaffRecord.skills[0] || '—'}</p></div>
            </div>
          )}
        </div>
      </div>

      <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-red-600 bg-white border border-red-200 hover:bg-red-50 transition">
        <LogOut className="w-4 h-4" />Log out
      </button>
    </div>
  );
};

export default Profile;
