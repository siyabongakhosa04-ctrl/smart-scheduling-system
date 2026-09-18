import { X, CheckCircle } from 'lucide-react';
import { useScheduling } from '../context/ScheduleContext';

const NotificationsPanel = ({ onClose, onGoToMatch }) => {
  const { events } = useScheduling();
  const understaffed = events.filter(e=>e.assignedStaff<e.requiredStaff&&e.status!=='completed');
  const overBudget = events.filter(e=>e.spent>e.budget*0.9&&e.budget>0);
  const notifications = [
    ...understaffed.map(e=>({ type:'warn', title:'Understaffed Event', msg:`${e.name} needs ${e.requiredStaff-e.assignedStaff} more staff`, eventId:e.id })),
    ...overBudget.map(e=>({ type:'danger', title:'Budget Alert', msg:`${e.name} has used ${Math.round((e.spent/e.budget)*100)}% of budget`, eventId:null })),
  ];
  return (
    <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-stone-200 z-50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100"><span className="font-bold text-stone-900 text-sm">Notifications</span><button onClick={onClose}><X className="w-4 h-4 text-stone-400" /></button></div>
      <div className="max-h-80 overflow-y-auto">
        {notifications.length===0 ? <div className="p-6 text-center"><CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" /><p className="text-sm text-stone-400">All clear! No alerts.</p></div>
          : notifications.map((n,i) => (
          <div key={i} className={`px-4 py-3 border-b border-stone-50 ${n.type==='danger'?'bg-red-50':'bg-amber-50'}`}>
            <p className={`text-xs font-bold mb-0.5 ${n.type==='danger'?'text-red-700':'text-amber-700'}`}>{n.title}</p>
            <p className="text-xs text-stone-600 mb-1">{n.msg}</p>
            {n.eventId && <button onClick={()=>{ onGoToMatch(n.eventId); onClose(); }} className="text-xs text-orange-600 font-semibold hover:underline">Match staff →</button>}
          </div>
        ))}
      </div>
    </div>
  );
};


export default NotificationsPanel;
