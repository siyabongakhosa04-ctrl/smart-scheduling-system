import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BRAND, STATUS_OPTIONS } from '../utils/constants';
import { useScheduling } from '../context/ScheduleContext';

const Analytics = () => {
  const { events, staffMembers, assignments } = useScheduling();
  const totalBudget=events.reduce((a,e)=>a+e.budget,0); const totalSpent=events.reduce((a,e)=>a+e.spent,0);
  const totalAttendees=events.reduce((a,e)=>a+e.attendees,0);
  const avgFill=events.length?Math.round(events.reduce((a,e)=>a+(e.assignedStaff/e.requiredStaff),0)/events.length*100):0;
  const byStatus=STATUS_OPTIONS.map(s=>({ status:s, label:s.replace('-',' '), count:events.filter(e=>e.status===s).length }));
  const topStaff=[...staffMembers].sort((a,b)=>b.assignedEvents-a.assignedEvents).slice(0,5);
  const budgetPieData = [
    { name:'Spent', value:totalSpent, color:BRAND.orange },
    { name:'Remaining', value:Math.max(0,totalBudget-totalSpent), color:BRAND.greenSoft },
  ];
  const perEventBudget = events.filter(e=>e.budget>0).sort((a,b)=>b.budget-a.budget).slice(0,8)
    .map(ev=>({ name: ev.name.length>18 ? ev.name.slice(0,18)+'…' : ev.name, Spent: ev.spent, Budget: ev.budget }));
  const statusDotColors = { open:'#ef4444', scheduled:'#3b82f6', 'in-progress':'#f59e0b', completed:'#10b981' };
  const ChartTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white border border-stone-200 rounded-lg shadow-lg px-3 py-2 text-xs">
        {label && <p className="font-semibold text-stone-900 mb-1">{label}</p>}
        {payload.map((p,i)=>(<p key={i} style={{ color:p.color||p.fill }}>{p.name}: <strong>{typeof p.value==='number'&&p.name!=='count'?p.value.toLocaleString():p.value}</strong></p>))}
      </div>
    );
  };
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-display font-bold" style={{ color:BRAND.green }}>Analytics</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[{ label:'Total Budget', value:`R${totalBudget.toLocaleString()}`, sub:`R${totalSpent.toLocaleString()} spent` },{ label:'Avg Staff Fill', value:`${avgFill}%`, sub:`${assignments.length} assignments` },{ label:'Total Attendees', value:totalAttendees.toLocaleString(), sub:`across ${events.length} events` },{ label:'Budget Used', value:`${totalBudget?Math.round((totalSpent/totalBudget)*100):0}%`, sub:`R${(totalBudget-totalSpent).toLocaleString()} remaining` }].map(({ label, value, sub })=>(
          <div key={label} className="bg-white rounded-xl p-5 border border-stone-200 shadow-sm"><p className="text-xs font-semibold text-stone-500 uppercase tracking-wide">{label}</p><p className="text-2xl font-bold text-stone-900 mt-1">{value}</p><p className="text-xs text-stone-400 mt-0.5">{sub}</p></div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-sm">
          <h3 className="font-bold text-stone-900 mb-4">Events by Status</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={byStatus} margin={{ top:4, right:8, left:-16, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1e6d3" />
              <XAxis dataKey="label" tick={{ fontSize:11, fill:BRAND.textMuted }} axisLine={{ stroke:'#e7ddc9' }} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize:11, fill:BRAND.textMuted }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill:'rgba(240,129,46,0.08)' }} />
              <Bar dataKey="count" radius={[6,6,0,0]}>
                {byStatus.map((d,i)=><Cell key={i} fill={statusDotColors[d.status]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-sm">
          <h3 className="font-bold text-stone-900 mb-4">Budget: Spent vs Remaining</h3>
          {totalBudget>0 ? (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="55%" height={200}>
                <PieChart>
                  <Pie data={budgetPieData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={80} paddingAngle={2}>
                    {budgetPieData.map((d,i)=><Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3">
                {budgetPieData.map(d=>(
                  <div key={d.name} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background:d.color }} />
                    <div>
                      <p className="text-xs text-stone-500">{d.name}</p>
                      <p className="text-sm font-bold text-stone-900">R{d.value.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : <p className="text-sm text-stone-400 italic">No budget data yet.</p>}
        </div>
      </div>
      <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-sm">
        <h3 className="font-bold text-stone-900 mb-4">Top Staff by Events</h3>
        <div className="space-y-3">{topStaff.map((s,i)=>(
          <div key={s.id} className="flex items-center gap-3"><span className="text-xs font-bold text-stone-400 w-4">#{i+1}</span><div className="flex-1"><p className="text-sm font-semibold text-stone-900">{s.name}</p><p className="text-xs text-stone-500">{s.seniority}</p></div><span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">{s.assignedEvents} events</span></div>
        ))}</div>
      </div>
      <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-sm">
        <h3 className="font-bold text-stone-900 mb-4">Budget Overview per Event</h3>
        <ResponsiveContainer width="100%" height={Math.max(220, perEventBudget.length*38)}>
          <BarChart data={perEventBudget} layout="vertical" margin={{ top:4, right:16, left:8, bottom:0 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1e6d3" />
            <XAxis type="number" tick={{ fontSize:11, fill:BRAND.textMuted }} axisLine={false} tickLine={false} tickFormatter={v=>`R${v/1000}k`} />
            <YAxis type="category" dataKey="name" width={140} tick={{ fontSize:11, fill:BRAND.text }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip />} cursor={{ fill:'rgba(240,129,46,0.06)' }} />
            <Bar dataKey="Budget" fill="#f1e6d3" radius={[0,6,6,0]} barSize={12} />
            <Bar dataKey="Spent" fill={BRAND.orange} radius={[0,6,6,0]} barSize={12} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};


export default Analytics;
