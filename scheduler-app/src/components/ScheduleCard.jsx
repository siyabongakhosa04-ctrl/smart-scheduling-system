import { Eye, Edit2, Trash2 } from 'lucide-react';
import { StatusBadge, SeniorityBadge, ProgressBar } from './Badges';
import { formatDate } from '../utils/helpers';

/**
 * event: the event record
 * onView / onEdit / onDelete: optional — omit any to hide that action (read-only card for Managers/Dashboard)
 * index: used to stagger the entrance animation in a list
 */
const ScheduleCard = ({ event, onView, onEdit, onDelete, index = 0 }) => (
  <div className="list-item-in bg-white rounded-xl p-5 border border-stone-200 shadow-sm hover:shadow-md transition" style={{ animationDelay: `${Math.min(index, 8) * 35}ms` }}>
    <div className="flex items-start justify-between mb-3">
      <div><h3 className="font-bold text-stone-900">{event.name}</h3><p className="text-xs text-stone-500 mt-0.5">{event.location}</p></div>
      <div className="flex items-center gap-2">
        <StatusBadge status={event.status} />
        {onView && <button onClick={() => onView(event)} className="p-1.5 hover:bg-orange-50 rounded-lg transition"><Eye className="w-4 h-4 text-orange-500" /></button>}
        {onEdit && <button onClick={() => onEdit(event)} className="p-1.5 hover:bg-stone-100 rounded-lg transition"><Edit2 className="w-4 h-4 text-stone-500" /></button>}
        {onDelete && <button onClick={() => { if (window.confirm(`Delete "${event.name}"?`)) onDelete(event.id); }} className="p-1.5 hover:bg-red-50 rounded-lg transition"><Trash2 className="w-4 h-4 text-red-400" /></button>}
      </div>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-3">
      <div><span className="text-stone-500">Date</span><p className="font-semibold text-stone-900 mt-0.5">{formatDate(event.date)}</p></div>
      <div><span className="text-stone-500">Time</span><p className="font-semibold text-stone-900 mt-0.5">{event.time}</p></div>
      <div><span className="text-stone-500">Staff</span><p className="font-semibold text-stone-900 mt-0.5">{event.assignedStaff}/{event.requiredStaff}</p></div>
      <div><span className="text-stone-500">Budget</span><p className="font-semibold text-stone-900 mt-0.5">R{event.spent.toLocaleString()}/R{event.budget.toLocaleString()}</p></div>
    </div>
    <div className="flex flex-wrap gap-1 mb-2"><SeniorityBadge seniority={event.requiredSeniority} />{event.requiredSkills.map(sk => <span key={sk} className="bg-stone-100 text-stone-600 text-xs px-2 py-0.5 rounded">{sk}</span>)}</div>
    <ProgressBar value={event.assignedStaff} max={event.requiredStaff} />
  </div>
);

export default ScheduleCard;
