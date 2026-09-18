import { Star, Clock } from 'lucide-react';
import Modal from '../Modal';
import { StatusBadge, SeniorityBadge } from '../Badges';
import { useScheduling } from '../../context/ScheduleContext';
import { formatDate } from '../../utils/helpers';

const StaffProfileModal = ({ staff, onClose }) => {
  const { events, assignments } = useScheduling();
  const staffEvents = assignments.filter(a=>a.staffId===staff.id).map(a=>events.find(e=>e.id===a.eventId)).filter(Boolean);
  const util = Math.round((staff.hoursBooked/staff.hoursAvailable)*100);
  return (
    <Modal title="Staff Profile" onClose={onClose} wide>
      <div className="space-y-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shrink-0">
            <span className="text-2xl font-black text-white">{staff.name.split(' ').map(n=>n[0]).join('').slice(0,2)}</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-900">{staff.name}</h2>
            <p className="text-stone-500 text-sm">{staff.email}</p>
            <div className="flex items-center gap-2 mt-1"><SeniorityBadge seniority={staff.seniority} /><span className="flex items-center gap-1 text-sm font-bold text-stone-800"><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />{staff.rating}</span></div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[{ label:'Hours Available', value:`${staff.hoursAvailable}h`, color:'text-orange-600', bg:'bg-orange-50' },{ label:'Hours Booked', value:`${staff.hoursBooked}h`, color:'text-amber-600', bg:'bg-amber-50' },{ label:'Utilization', value:`${util}%`, color:util>90?'text-red-600':'text-green-600', bg:util>90?'bg-red-50':'bg-green-50' }].map(({ label, value, color, bg }) => (
            <div key={label} className={`${bg} rounded-xl p-3 text-center`}><p className="text-xs text-stone-500 mb-1">{label}</p><p className={`font-bold text-lg ${color}`}>{value}</p></div>
          ))}
        </div>
        <div>
          <div className="flex items-center justify-between mb-1"><p className="text-xs font-semibold text-stone-600 uppercase tracking-wide">Workload</p><span className="text-xs text-stone-500">{util}%</span></div>
          <div className="h-2.5 bg-stone-100 rounded-full overflow-hidden"><div className={`h-full rounded-full ${util>90?'bg-red-500':util>75?'bg-amber-500':'bg-green-500'}`} style={{ width:`${util}%` }} /></div>
        </div>
        <div><p className="text-xs font-semibold text-stone-600 mb-2 uppercase tracking-wide">Skills ({staff.skills.length})</p><div className="flex flex-wrap gap-1.5">{staff.skills.map(sk=><span key={sk} className="bg-orange-50 text-orange-700 text-xs px-2.5 py-1 rounded-full font-medium border border-orange-100">{sk}</span>)}</div></div>
        <div className="bg-stone-50 rounded-xl p-3 flex items-center gap-2"><Clock className="w-4 h-4 text-green-500" /><span className="text-sm text-stone-700">Next available: <strong>{formatDate(staff.nextAvailable)}</strong></span></div>
        <div>
          <p className="text-xs font-semibold text-stone-600 mb-2 uppercase tracking-wide">Assigned Events ({staffEvents.length})</p>
          {staffEvents.length===0 ? <p className="text-sm text-stone-400 italic">No events assigned.</p> : (
            <div className="space-y-2">{staffEvents.map(ev => (
              <div key={ev.id} className="flex items-center justify-between bg-stone-50 rounded-xl p-3">
                <div><p className="text-sm font-semibold text-stone-900">{ev.name}</p><p className="text-xs text-stone-500">{formatDate(ev.date)} · {ev.location}</p></div>
                <StatusBadge status={ev.status} />
              </div>
            ))}</div>
          )}
        </div>
      </div>
    </Modal>
  );
};


export default StaffProfileModal;
