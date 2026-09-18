import { Activity } from 'lucide-react';
import { BRAND } from '../utils/constants';
import { useScheduling } from '../context/ScheduleContext';

const AuditLog = () => {
  const { auditLog } = useScheduling();
  const actionColors = { 'ASSIGN':{ bg:'bg-green-50', border:'border-green-200', text:'text-green-700', dot:'bg-green-500' }, 'UNASSIGN':{ bg:'bg-orange-50', border:'border-orange-200', text:'text-orange-700', dot:'bg-orange-500' }, 'ADD_EVENT':{ bg:'bg-orange-50', border:'border-orange-200', text:'text-orange-700', dot:'bg-orange-500' }, 'EDIT_EVENT':{ bg:'bg-green-50', border:'border-green-200', text:'text-green-700', dot:'bg-green-500' }, 'DELETE_EVENT':{ bg:'bg-red-50', border:'border-red-200', text:'text-red-700', dot:'bg-red-500' }, 'ADD_STAFF':{ bg:'bg-orange-50', border:'border-orange-200', text:'text-orange-700', dot:'bg-orange-500' }, 'EDIT_STAFF':{ bg:'bg-green-50', border:'border-green-200', text:'text-green-700', dot:'bg-green-500' }, 'DELETE_STAFF':{ bg:'bg-red-50', border:'border-red-200', text:'text-red-700', dot:'bg-red-500' }, 'LOGIN':{ bg:'bg-stone-50', border:'border-stone-200', text:'text-stone-700', dot:'bg-stone-400' } };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h2 className="text-3xl font-display font-bold" style={{ color:BRAND.green }}>Audit Log</h2><span className="text-xs bg-stone-100 text-stone-600 px-3 py-1.5 rounded-full font-medium">{auditLog.length} entries</span></div>
      {auditLog.length===0?<div className="bg-white rounded-xl p-12 border border-stone-200 text-center"><Activity className="w-10 h-10 text-stone-300 mx-auto mb-3" /><p className="text-stone-400 text-sm">No activity recorded yet.</p></div>:(
        <div className="space-y-2">{[...auditLog].reverse().map((entry,i)=>{ const style=actionColors[entry.action]||actionColors['LOGIN']; return (
          <div key={i} className={`${style.bg} border ${style.border} rounded-xl px-5 py-3.5 flex items-start gap-4`}>
            <div className={`w-2 h-2 rounded-full ${style.dot} mt-1.5 shrink-0`} />
            <div className="flex-1 min-w-0"><div className="flex items-center gap-2 flex-wrap"><span className={`text-xs font-bold ${style.text} uppercase tracking-wide`}>{entry.action.replace('_',' ')}</span><span className="text-xs text-stone-500">by <strong>{entry.user}</strong></span></div><p className="text-sm text-stone-700 mt-0.5">{entry.detail}</p></div>
            <span className="text-xs text-stone-400 shrink-0 mt-0.5">{entry.time}</span>
          </div>
        ); })}</div>
      )}
    </div>
  );
};

export default AuditLog;
