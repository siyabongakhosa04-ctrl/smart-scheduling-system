import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { BRAND } from '../utils/constants';
import { formatDate, algo } from '../utils/helpers';
import { useScheduling } from '../context/ScheduleContext';
import { StatusBadge } from '../components/Badges';

const SmartMatch = () => {
  const { events, staffMembers, assignments, assignStaff, unassignStaff, getConflicts } = useScheduling();
  const [searchParams] = useSearchParams();
  const preselectedEventId = searchParams.get('event') ? Number(searchParams.get('event')) : null;
  const [selectedEventId, setSelectedEventId] = useState(preselectedEventId || (events[0]?.id ?? null));
  useEffect(() => { if (preselectedEventId) setSelectedEventId(preselectedEventId); }, [preselectedEventId]);
  const selectedEvent = events.find(e => e.id === selectedEventId);
  const ranked = useMemo(() => {
    if (!selectedEvent) return [];
    return [...staffMembers].map(s => ({ ...s, score: algo.totalScore(s, selectedEvent), breakdown: algo.breakdown(s, selectedEvent), assigned: assignments.some(a => a.staffId === s.id && a.eventId === selectedEvent.id), conflicts: getConflicts(s.id, selectedEvent) })).sort((a, b) => b.score - a.score);
  }, [selectedEvent, staffMembers, assignments, getConflicts]);
  const scoreColor = (s) => s >= 80 ? 'text-green-600 bg-green-50' : s >= 60 ? 'text-amber-600 bg-amber-50' : 'text-red-600 bg-red-50';

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-display font-bold" style={{ color:BRAND.green }}>Smart Match</h2>
      <div><label className="block text-xs font-semibold text-stone-600 mb-1.5">Select Event</label><select className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white" value={selectedEventId ?? ''} onChange={e=>setSelectedEventId(Number(e.target.value))}>{events.map(ev=><option key={ev.id} value={ev.id}>{ev.name}</option>)}</select></div>
      {selectedEvent && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-1"><span className="font-bold text-stone-900">{selectedEvent.name}</span><StatusBadge status={selectedEvent.status} /></div>
          <p className="text-xs text-stone-500">{formatDate(selectedEvent.date)} · {selectedEvent.location}</p>
          <p className="text-xs text-stone-600 mt-1">Staff: <strong>{selectedEvent.assignedStaff}/{selectedEvent.requiredStaff}</strong> · Seniority: <strong>{selectedEvent.requiredSeniority}</strong></p>
          <div className="flex flex-wrap gap-1 mt-2">{selectedEvent.requiredSkills.map(sk=><span key={sk} className="bg-white border border-orange-200 text-orange-700 text-xs px-2 py-0.5 rounded">{sk}</span>)}</div>
        </div>
      )}
      <div className="space-y-3">{ranked.map((s,i)=>(
        <div key={s.id} className={`bg-white rounded-xl p-5 border shadow-sm transition ${s.assigned?'border-green-300 bg-green-50/30':'border-stone-200 hover:shadow-md'}`}>
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3"><span className="text-xs font-bold text-stone-400 w-5">#{i+1}</span><div><h3 className="font-bold text-stone-900">{s.name}</h3><p className="text-xs text-stone-500">{s.seniority} · ⭐ {s.rating}</p></div></div>
            <div className="flex items-center gap-2">
              <span className={`text-lg font-black px-3 py-1 rounded-lg ${scoreColor(s.score)}`}>{s.score}</span>
              {s.assigned?<button onClick={()=>unassignStaff(s.id,selectedEvent.id)} className="text-xs bg-red-100 text-red-700 px-3 py-1.5 rounded-lg font-semibold hover:bg-red-200 transition">Unassign</button>:<button onClick={()=>assignStaff(s.id,selectedEvent.id)} disabled={s.conflicts.length>0} className="text-xs bg-[#F0812E] text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-[#D96A1F] transition disabled:opacity-40 disabled:cursor-not-allowed">Assign</button>}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs mb-3">
            {[{ label:'Skill Match', val:s.breakdown.skillMatch },{ label:'Availability', val:s.breakdown.availability },{ label:'Workload', val:s.breakdown.workloadBalance }].map(({ label, val })=>(
              <div key={label} className="bg-stone-50 rounded-lg p-2"><p className="text-stone-500 mb-1">{label}</p><div className="h-1.5 bg-stone-200 rounded-full"><div className="h-full bg-orange-500 rounded-full" style={{ width:`${val}%` }} /></div><p className="font-semibold text-stone-700 mt-1">{val}%</p></div>
            ))}
          </div>
          <div className="flex flex-wrap gap-1">{s.skills.map(sk=><span key={sk} className={`text-xs px-2 py-0.5 rounded ${selectedEvent?.requiredSkills.includes(sk)?'bg-orange-100 text-orange-700 font-semibold':'bg-stone-100 text-stone-500'}`}>{sk}</span>)}</div>
          {s.conflicts.length>0&&<div className="mt-2 flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5"><AlertTriangle className="w-3.5 h-3.5" />Conflict: {s.conflicts.map(c=>c.name).join(', ')}</div>}
          {s.assigned&&<div className="mt-2 flex items-center gap-1.5 text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-1.5"><CheckCircle className="w-3.5 h-3.5" />Assigned to this event</div>}
        </div>
      ))}</div>
    </div>
  );
};

export default SmartMatch;
