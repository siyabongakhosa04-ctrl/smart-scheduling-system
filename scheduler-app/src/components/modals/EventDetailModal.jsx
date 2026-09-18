import { MapPin, CheckCircle, QrCode, Zap } from 'lucide-react';
import Modal from '../Modal';
import { StatusBadge, SeniorityBadge } from '../Badges';
import { QRCodeSVG } from '../QRCode';
import { useScheduling } from '../../context/ScheduleContext';
import { BRAND } from '../../utils/constants';
import { formatDate } from '../../utils/helpers';

const EventDetailModal = ({ event, onClose, onGoToMatch }) => {
  const { staffMembers, assignments, checkIns } = useScheduling();
  const assignedStaff = assignments.filter(a=>a.eventId===event.id).map(a=>staffMembers.find(s=>s.id===a.staffId)).filter(Boolean);
  const checkedInIds = new Set(checkIns.filter(c=>c.eventId===event.id).map(c=>c.staffId));
  const budgetPct = event.budget>0?Math.round((event.spent/event.budget)*100):0;
  const fillPct = event.requiredStaff>0?Math.round((event.assignedStaff/event.requiredStaff)*100):0;
  return (
    <Modal title="Event Details" onClose={onClose} wide>
      <div className="space-y-5">
        <div className="flex items-start justify-between">
          <div><h2 className="text-xl font-bold text-stone-900">{event.name}</h2><p className="text-stone-500 text-sm mt-1 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{event.location}</p></div>
          <StatusBadge status={event.status} />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[{ label:'Date', value:formatDate(event.date) },{ label:'Time', value:event.time },{ label:'Attendees', value:event.attendees.toLocaleString() },{ label:'Complexity', value:`${Math.round(event.complexity*100)}%` }].map(({ label, value }) => (
            <div key={label} className="bg-stone-50 rounded-xl p-3 text-center"><p className="text-xs text-stone-500 mb-1">{label}</p><p className="font-bold text-stone-900 text-sm">{value}</p></div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-orange-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2"><span className="text-xs font-semibold text-orange-700 uppercase tracking-wide">Staff Fill</span><span className="text-xs font-bold text-orange-900">{event.assignedStaff}/{event.requiredStaff}</span></div>
            <div className="h-2 bg-orange-200 rounded-full overflow-hidden"><div className="h-full bg-orange-500 rounded-full" style={{ width:`${fillPct}%` }} /></div>
            <p className="text-xs text-orange-600 mt-1">{fillPct}% filled</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2"><span className="text-xs font-semibold text-green-700 uppercase tracking-wide">Budget</span><span className="text-xs font-bold text-green-900">{budgetPct}% used</span></div>
            <div className="h-2 bg-green-200 rounded-full overflow-hidden"><div className="h-full bg-green-500 rounded-full" style={{ width:`${budgetPct}%` }} /></div>
            <p className="text-xs text-green-600 mt-1">R{event.spent.toLocaleString()} of R{event.budget.toLocaleString()}</p>
          </div>
        </div>
        <div><p className="text-xs font-semibold text-stone-600 mb-2 uppercase tracking-wide">Required Skills</p><div className="flex flex-wrap gap-1.5">{event.requiredSkills.map(sk=><span key={sk} className="bg-stone-100 text-stone-700 text-xs px-2.5 py-1 rounded-full font-medium">{sk}</span>)}</div></div>
        <div>
          <p className="text-xs font-semibold text-stone-600 mb-2 uppercase tracking-wide">Assigned Staff ({assignedStaff.length}) · {checkedInIds.size} checked in</p>
          {assignedStaff.length===0 ? <p className="text-sm text-stone-400 italic">No staff assigned yet.</p> : (
            <div className="space-y-2">{assignedStaff.map(s => (
              <div key={s.id} className="flex items-center gap-3 bg-stone-50 rounded-xl p-3">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0"><span className="text-xs font-bold text-orange-700">{s.name.split(' ').map(n=>n[0]).join('').slice(0,2)}</span></div>
                <div className="flex-1 min-w-0"><p className="text-sm font-semibold text-stone-900">{s.name}</p><p className="text-xs text-stone-500">{s.seniority} · ⭐ {s.rating}</p></div>
                {checkedInIds.has(s.id) ? <span className="text-xs font-bold text-green-700 bg-green-100 px-2.5 py-1 rounded-full flex items-center gap-1"><CheckCircle className="w-3 h-3" />Checked in</span> : <SeniorityBadge seniority={s.seniority} />}
              </div>
            ))}</div>
          )}
        </div>
        <div className="bg-white border border-stone-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3"><QrCode className="w-4 h-4" style={{ color:BRAND.orange }} /><span className="text-xs font-semibold text-stone-600 uppercase tracking-wide">QR Check-In</span></div>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="border border-stone-200 rounded-lg p-2 shrink-0"><QRCodeSVG value={`SCHED-CHECKIN:${event.id}:${event.checkInCode}`} size={110} /></div>
            <div>
              <p className="text-xs text-stone-500 mb-1">Staff scan this — or enter the code manually:</p>
              <p className="font-mono font-bold text-lg tracking-widest text-stone-900">{event.checkInCode}</p>
              <p className="text-xs text-stone-400 mt-1">Only staff assigned to this event can check in.</p>
            </div>
          </div>
        </div>
        {event.assignedStaff < event.requiredStaff && (
          <button onClick={() => { onGoToMatch(event.id); onClose(); }} className="w-full bg-amber-500 text-white py-2.5 rounded-xl font-semibold hover:bg-amber-600 transition text-sm flex items-center justify-center gap-2">
            <Zap className="w-4 h-4" /> Smart Match Staff for This Event
          </button>
        )}
      </div>
    </Modal>
  );
};


export default EventDetailModal;
