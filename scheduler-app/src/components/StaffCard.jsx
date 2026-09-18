import { Star, Eye, Edit2, Trash2 } from 'lucide-react';
import { SeniorityBadge, ProgressBar } from './Badges';
import { formatDate } from '../utils/helpers';

/**
 * staff: the staff record
 * onView / onEdit / onDelete: optional — omit any to hide that action (read-only card)
 * index: used to stagger the entrance animation in a list
 */
const StaffCard = ({ staff, onView, onEdit, onDelete, index = 0 }) => {
  const util = Math.round((staff.hoursBooked / staff.hoursAvailable) * 100);
  return (
    <div className="list-item-in bg-white rounded-xl p-5 border border-stone-200 shadow-sm hover:shadow-md transition" style={{ animationDelay: `${Math.min(index, 8) * 35}ms` }}>
      <div className="flex items-start justify-between mb-3">
        <div><h3 className="font-bold text-stone-900">{staff.name}</h3><p className="text-xs text-stone-500 mt-0.5">{staff.email}</p></div>
        <div className="flex items-center gap-2">
          <SeniorityBadge seniority={staff.seniority} />
          <span className="flex items-center gap-1 text-sm font-bold text-stone-900"><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />{staff.rating}</span>
          {onView && <button onClick={() => onView(staff)} className="p-1.5 hover:bg-orange-50 rounded-lg transition"><Eye className="w-4 h-4 text-orange-500" /></button>}
          {onEdit && <button onClick={() => onEdit(staff)} className="p-1.5 hover:bg-stone-100 rounded-lg transition"><Edit2 className="w-4 h-4 text-stone-500" /></button>}
          {onDelete && <button onClick={() => { if (window.confirm(`Remove "${staff.name}"?`)) onDelete(staff.id); }} className="p-1.5 hover:bg-red-50 rounded-lg transition"><Trash2 className="w-4 h-4 text-red-400" /></button>}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 text-xs mb-3">
        <div><span className="text-stone-500">Hours</span><p className="font-semibold text-stone-900 mt-0.5">{staff.hoursBooked}/{staff.hoursAvailable}h ({util}%)</p></div>
        <div><span className="text-stone-500">Events</span><p className="font-semibold text-stone-900 mt-0.5">{staff.assignedEvents} assigned</p></div>
        <div><span className="text-stone-500">Available</span><p className="font-semibold text-stone-900 mt-0.5">{formatDate(staff.nextAvailable)}</p></div>
      </div>
      <div className="flex flex-wrap gap-1 mb-2">{staff.skills.map(sk => <span key={sk} className="bg-stone-100 text-stone-600 text-xs px-2 py-0.5 rounded">{sk}</span>)}</div>
      <ProgressBar value={staff.hoursBooked} max={staff.hoursAvailable} color="bg-green-500" />
    </div>
  );
};

export default StaffCard;
