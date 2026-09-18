import { MapPin, CheckCircle } from 'lucide-react';
import { BRAND } from '../utils/constants';
import { formatDate } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import { useScheduling } from '../context/ScheduleContext';
import { StatusBadge, ProgressBar } from '../components/Badges';

const FindEvents = () => {
  const { currentUser } = useAuth();
  const { events, assignments, requests, requestEvent, cancelRequest } = useScheduling();
  const myAssignedIds = new Set(assignments.filter(a=>a.staffId===currentUser.staffId).map(a=>a.eventId));
  const openEvents = events.filter(e => e.status !== 'completed');
  return (
    <div className="space-y-6">
      <div><h2 className="text-3xl font-display font-bold" style={{ color:BRAND.green }}>Find Events</h2><p className="text-stone-500 text-sm mt-0.5">Request to work an event — a manager will approve or decline.</p></div>
      <div className="space-y-3">
        {openEvents.map(ev => {
          const assigned = myAssignedIds.has(ev.id);
          const myReq = requests.find(r => r.staffId===currentUser.staffId && r.eventId===ev.id && r.status==='pending');
          const full = ev.assignedStaff >= ev.requiredStaff;
          return (
            <div key={ev.id} className="bg-white rounded-xl p-5 border border-stone-200 shadow-sm">
              <div className="flex items-start justify-between mb-2 gap-3">
                <div><h3 className="font-bold text-stone-900">{ev.name}</h3><p className="text-xs text-stone-500 mt-0.5 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{ev.location}</p></div>
                <StatusBadge status={ev.status} />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-3">
                <div><span className="text-stone-500">Date</span><p className="font-semibold text-stone-900 mt-0.5">{formatDate(ev.date)}</p></div>
                <div><span className="text-stone-500">Time</span><p className="font-semibold text-stone-900 mt-0.5">{ev.time}</p></div>
                <div><span className="text-stone-500">Staff</span><p className="font-semibold text-stone-900 mt-0.5">{ev.assignedStaff}/{ev.requiredStaff}</p></div>
                <div><span className="text-stone-500">Skills</span><p className="font-semibold text-stone-900 mt-0.5 truncate">{ev.requiredSkills.join(', ')||'—'}</p></div>
              </div>
              <div className="flex items-center justify-between">
                <ProgressBar value={ev.assignedStaff} max={ev.requiredStaff} />
                <div className="ml-4 shrink-0">
                  {assigned ? (
                    <span className="text-xs font-bold text-green-700 bg-green-50 px-3 py-1.5 rounded-full flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" />Assigned</span>
                  ) : myReq ? (
                    <button onClick={()=>cancelRequest(myReq.id)} className="text-xs font-semibold text-stone-600 border border-stone-200 px-3 py-1.5 rounded-full hover:bg-stone-50 transition">Requested — cancel</button>
                  ) : full ? (
                    <span className="text-xs font-semibold text-stone-400 px-3 py-1.5">Fully staffed</span>
                  ) : (
                    <button onClick={()=>requestEvent(currentUser.staffId, ev.id, currentUser.name)} className="text-xs font-bold text-white px-3 py-1.5 rounded-full transition" style={{ background:BRAND.orange }}>Request to work</button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


export default FindEvents;
