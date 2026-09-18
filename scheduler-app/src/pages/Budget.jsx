import { BRAND } from '../utils/constants';
import { useScheduling } from '../context/ScheduleContext';
import { StatusBadge } from '../components/Badges';

const Budget = () => {
  const { events } = useScheduling();
  const totalBudget = events.reduce((a,e)=>a+e.budget,0);
  const totalSpent = events.reduce((a,e)=>a+e.spent,0);
  const remaining = totalBudget-totalSpent;
  const pct = totalBudget>0?Math.round((totalSpent/totalBudget)*100):0;
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-display font-bold" style={{ color:BRAND.green }}>Budget Tracker</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[{ label:'Total Budget', value:`R${totalBudget.toLocaleString()}`, color:'text-orange-600', bg:'bg-orange-50', border:'border-orange-200' },{ label:'Total Spent', value:`R${totalSpent.toLocaleString()}`, color:'text-amber-600', bg:'bg-amber-50', border:'border-amber-200' },{ label:'Remaining', value:`R${remaining.toLocaleString()}`, color:remaining<0?'text-red-600':'text-green-600', bg:remaining<0?'bg-red-50':'bg-green-50', border:remaining<0?'border-red-200':'border-green-200' }].map(({ label, value, color, bg, border }) => (
          <div key={label} className={`${bg} border ${border} rounded-2xl p-5`}><p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1">{label}</p><p className={`text-3xl font-bold ${color}`}>{value}</p></div>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-2"><p className="font-bold text-stone-900">Overall Utilization</p><span className={`text-sm font-bold ${pct>90?'text-red-600':pct>70?'text-amber-600':'text-green-600'}`}>{pct}%</span></div>
        <div className="h-4 bg-stone-100 rounded-full overflow-hidden"><div className={`h-full rounded-full ${pct>90?'bg-red-500':pct>70?'bg-amber-500':'bg-green-500'}`} style={{ width:`${Math.min(100,pct)}%` }} /></div>
        <p className="text-xs text-stone-400 mt-2">R{totalSpent.toLocaleString()} of R{totalBudget.toLocaleString()} across {events.length} events</p>
      </div>
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-100"><h3 className="font-bold text-stone-900">Per-Event Breakdown</h3></div>
        <div className="divide-y divide-stone-100">
          {[...events].sort((a,b)=>b.budget-a.budget).map(ev=>{
            const evPct=ev.budget>0?Math.round((ev.spent/ev.budget)*100):0; const over=ev.spent>ev.budget;
            return (
              <div key={ev.id} className="px-6 py-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 min-w-0"><span className="font-semibold text-stone-900 text-sm truncate">{ev.name}</span><StatusBadge status={ev.status} /></div>
                  <div className="flex items-center gap-3 shrink-0 ml-3"><span className="text-xs text-stone-500">R{ev.spent.toLocaleString()} / R{ev.budget.toLocaleString()}</span><span className={`text-xs font-bold ${over?'text-red-600':evPct>80?'text-amber-600':'text-green-600'}`}>{evPct}%</span></div>
                </div>
                <div className="h-2 bg-stone-100 rounded-full overflow-hidden"><div className={`h-full rounded-full ${over?'bg-red-500':evPct>80?'bg-amber-500':'bg-emerald-500'}`} style={{ width:`${Math.min(100,evPct)}%` }} /></div>
                {over&&<p className="text-xs text-red-500 mt-1">⚠ Over budget by R{(ev.spent-ev.budget).toLocaleString()}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Budget;
