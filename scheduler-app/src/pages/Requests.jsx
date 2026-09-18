import { CheckCircle, X, AlertTriangle } from 'lucide-react';
import { BRAND } from '../utils/constants';
import { formatDate } from '../utils/helpers';
import { useScheduling } from '../context/ScheduleContext';
import { SeniorityBadge, RequestStatusBadge } from '../components/Badges';

const Requests = () => {
  const { requests, events, staffMembers, approveRequest, declineRequest } = useScheduling();
  const pending = requests.filter(r => r.status === 'pending');
  const resolved = requests.filter(r => r.status !== 'pending').slice(-10).reverse();
  return (
    <div className="space-y-6">
      <div><h2 className="text-3xl font-display font-bold" style={{ color:BRAND.green }}>Staff Requests</h2><p className="text-stone-500 text-sm mt-0.5">Approve or decline staff requests to work an event.</p></div>
      {pending.length===0 ? (
        <div className="bg-white rounded-xl p-10 border border-stone-200 text-center"><CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" /><p className="text-stone-400 text-sm">No pending requests.</p></div>
      ) : (
        <div className="space-y-3">{pending.map(r => {
          const ev = events.find(e=>e.id===r.eventId);
          const staff = staffMembers.find(s=>s.id===r.staffId);
          const displayName = r.staffName || staff?.name;
          const canApprove = !!ev && !!staff;
          return (
            <div key={r.id} className={`bg-white rounded-xl p-4 border shadow-sm flex items-center justify-between gap-4 ${!canApprove ? 'border-amber-200' : 'border-stone-200'}`}>
              <div className="min-w-0">
                {displayName ? (
                  <>
                    <p className="text-sm font-semibold text-stone-900">{displayName} <span className="text-stone-400 font-normal">wants to work</span> {ev ? ev.name : 'an event that no longer exists'}</p>
                    {canApprove ? (
                      <p className="text-xs text-stone-500 mt-0.5">{formatDate(ev.date)} · {ev.assignedStaff}/{ev.requiredStaff} staffed · <SeniorityBadge seniority={staff.seniority} /></p>
                    ) : (
                      <p className="text-xs text-amber-600 mt-0.5 flex items-center gap-1"><AlertTriangle className="w-3 h-3 shrink-0" />{!staff ? 'No matching staff roster record — decline, or ask them to log out and back in' : 'Event no longer exists — safe to decline'}</p>
                    )}
                  </>
                ) : (
                  <p className="text-sm font-semibold text-amber-700 flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5 shrink-0" />Request references data that no longer resolves — safe to decline</p>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={()=>approveRequest(r.id)} disabled={!canApprove} className="p-2 rounded-lg bg-green-50 hover:bg-green-100 transition disabled:opacity-30 disabled:cursor-not-allowed" aria-label="Approve"><CheckCircle className="w-4 h-4 text-green-600" /></button>
                <button onClick={()=>declineRequest(r.id)} className="p-2 rounded-lg bg-red-50 hover:bg-red-100 transition" aria-label="Decline"><X className="w-4 h-4 text-red-600" /></button>
              </div>
            </div>
          );
        })}</div>
      )}
      {resolved.length>0 && (
        <div><h3 className="text-sm font-bold text-stone-600 uppercase tracking-wide mb-2">Recently resolved</h3>
          <div className="space-y-2">{resolved.map(r=>{
            const ev = events.find(e=>e.id===r.eventId);
            const staff = staffMembers.find(s=>s.id===r.staffId);
            return (
              <div key={r.id} className="flex items-center justify-between bg-white rounded-xl p-3 border border-stone-100 text-sm">
                <span className="text-stone-600">{r.staffName || staff?.name || 'Unknown staff'} · {ev ? ev.name : 'Unknown event'}</span>
                <RequestStatusBadge status={r.status} />
              </div>
            );
          })}</div>
        </div>
      )}
    </div>
  );
};

export default Requests;
