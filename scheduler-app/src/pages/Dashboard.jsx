import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, DollarSign, TrendingUp, BarChart3, Clock, AlertTriangle, Star, QrCode } from 'lucide-react';
import { BRAND } from '../utils/constants';
import { formatDate } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import { useScheduling } from '../context/ScheduleContext';
import { StatusBadge, SeniorityBadge, RequestStatusBadge, ProgressBar } from '../components/Badges';
import EventDetailModal from '../components/modals/EventDetailModal';
import StaffProfileModal from '../components/modals/StaffProfileModal';

const AdminDashboard = ({ onGoToMatch, onEventClick, onStaffClick }) => {
  const { events, staffMembers } = useScheduling();
  const active = events.filter(e=>e.status!=='completed').length;
  const openPos = events.reduce((a,e)=>a+Math.max(0,e.requiredStaff-e.assignedStaff),0);
  const budget = events.reduce((a,e)=>a+e.budget,0);
  const avgFill = events.length?Math.round(events.reduce((a,e)=>a+(e.assignedStaff/e.requiredStaff),0)/events.length*100):0;
  const understaffed = events.filter(e=>e.assignedStaff<e.requiredStaff&&e.status!=='completed');
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-display font-bold" style={{ color:BRAND.green }}>Dashboard</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[{ label:'Active Events', value:active, icon:Calendar, color:'text-orange-500', bg:'bg-orange-50' },{ label:'Open Positions', value:openPos, icon:Users, color:'text-red-500', bg:'bg-red-50' },{ label:'Total Budget', value:`R${budget.toLocaleString()}`, icon:DollarSign, color:'text-green-500', bg:'bg-green-50' },{ label:'Avg Fill Rate', value:`${avgFill}%`, icon:TrendingUp, color:'text-green-500', bg:'bg-green-50' }].map(({ label, value, icon:Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-xl p-5 border border-stone-200 shadow-sm">
            <div className="flex items-center justify-between"><div><p className="text-xs font-semibold text-stone-500 uppercase tracking-wide">{label}</p><p className="text-3xl font-bold text-stone-900 mt-1">{value}</p></div><div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center`}><Icon className={`w-6 h-6 ${color}`} /></div></div>
          </div>
        ))}
      </div>
      {understaffed.length>0&&(
        <div>
          <h3 className="text-lg font-bold text-stone-900 mb-3 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-amber-500" />Staffing Alerts</h3>
          <div className="space-y-2">{understaffed.slice(0,5).map(ev=>(
            <div key={ev.id} className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
              <div><span className="font-semibold text-stone-900">{ev.name}</span><span className="text-amber-700 text-sm ml-2">— needs {ev.requiredStaff-ev.assignedStaff} more staff</span></div>
              <div className="flex gap-2">
                <button onClick={()=>onEventClick(ev)} className="text-xs bg-white border border-amber-300 text-amber-700 px-3 py-1.5 rounded-lg font-semibold hover:bg-amber-50 transition">View</button>
                <button onClick={()=>onGoToMatch(ev.id)} className="text-sm bg-amber-500 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-amber-600 transition">Match Now</button>
              </div>
            </div>
          ))}</div>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-bold text-stone-900 mb-3">Recent Events</h3>
          <div className="space-y-2">{events.slice(0,5).map(ev=>(
            <button key={ev.id} onClick={()=>onEventClick(ev)} className="w-full text-left bg-white rounded-xl p-4 border border-stone-200 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between mb-1"><span className="font-semibold text-stone-900 text-sm">{ev.name}</span><StatusBadge status={ev.status} /></div>
              <p className="text-xs text-stone-500 mb-2">{formatDate(ev.date)} · {ev.location}</p>
              <ProgressBar value={ev.assignedStaff} max={ev.requiredStaff} />
            </button>
          ))}</div>
        </div>
        <div>
          <h3 className="text-lg font-bold text-stone-900 mb-3">Top Staff</h3>
          <div className="space-y-2">{[...staffMembers].sort((a,b)=>b.rating-a.rating).slice(0,5).map(s=>(
            <button key={s.id} onClick={()=>onStaffClick(s)} className="w-full text-left bg-white rounded-xl p-4 border border-stone-200 shadow-sm hover:shadow-md transition flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shrink-0"><span className="text-xs font-black text-white">{s.name.split(' ').map(n=>n[0]).join('').slice(0,2)}</span></div>
              <div className="flex-1 min-w-0"><p className="font-semibold text-stone-900 text-sm">{s.name}</p><p className="text-xs text-stone-500">{s.seniority} · {s.assignedEvents} events</p></div>
              <div className="flex items-center gap-1 text-sm font-bold text-stone-800"><Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />{s.rating}</div>
            </button>
          ))}</div>
        </div>
      </div>
    </div>
  );
};

const ManagerDashboard = ({ currentUser }) => {
  const { events, staffMembers, assignments } = useScheduling();
  const myEventIds = useMemo(()=>events.slice(0,4).map(e=>e.id),[events]);
  const myEvents = events.filter(e=>myEventIds.includes(e.id));
  const myStaffIds = useMemo(()=>{ const ids=new Set(); assignments.filter(a=>myEventIds.includes(a.eventId)).forEach(a=>ids.add(a.staffId)); return ids; },[assignments,myEventIds]);
  const myStaff = staffMembers.filter(s=>myStaffIds.has(s.id));
  const openPos = myEvents.reduce((a,e)=>a+Math.max(0,e.requiredStaff-e.assignedStaff),0);
  const totalBudget = myEvents.reduce((a,e)=>a+e.budget,0);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-3xl font-display font-bold" style={{ color:BRAND.green }}>My Dashboard</h2><p className="text-stone-500 text-sm mt-0.5">Welcome back, {currentUser.name}</p></div>
        <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full">MANAGER</span>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[{ label:'My Events', value:myEvents.length, icon:Calendar, color:'text-orange-500' },{ label:'Open Positions', value:openPos, icon:Users, color:'text-red-500' },{ label:'My Budget', value:`R${totalBudget.toLocaleString()}`, icon:BarChart3, color:'text-green-500' },{ label:'Assigned Staff', value:myStaff.length, icon:Users, color:'text-green-500' }].map(({ label, value, icon:Icon, color })=>(
          <div key={label} className="bg-white rounded-xl p-5 border border-stone-200 shadow-sm">
            <div className="flex items-center justify-between"><div><p className="text-xs font-semibold text-stone-500 uppercase tracking-wide">{label}</p><p className="text-3xl font-bold text-stone-900 mt-1">{value}</p></div><Icon className={`w-9 h-9 ${color}`} /></div>
          </div>
        ))}
      </div>
      <div><h3 className="text-lg font-bold text-stone-900 mb-3">My Events</h3>
        <div className="space-y-3">{myEvents.map(ev=>(
          <div key={ev.id} className="bg-white rounded-xl p-4 border border-stone-200 shadow-sm">
            <div className="flex items-center justify-between mb-2"><span className="font-semibold text-stone-900">{ev.name}</span><StatusBadge status={ev.status} /></div>
            <p className="text-xs text-stone-500 mb-2">{formatDate(ev.date)} · {ev.location}</p>
            <div className="flex gap-4 text-xs text-stone-600"><span>Staff: <strong>{ev.assignedStaff}/{ev.requiredStaff}</strong></span><span>Budget: <strong>R{ev.budget.toLocaleString()}</strong></span></div>
            <ProgressBar value={ev.assignedStaff} max={ev.requiredStaff} />
          </div>
        ))}</div>
      </div>
      {myStaff.length>0&&(
        <div><h3 className="text-lg font-bold text-stone-900 mb-3">My Staff</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{myStaff.map(s=>(
            <div key={s.id} className="bg-white rounded-xl p-4 border border-stone-200 shadow-sm">
              <div className="flex items-center justify-between mb-1"><span className="font-semibold text-stone-900 text-sm">{s.name}</span><SeniorityBadge seniority={s.seniority} /></div>
              <p className="text-xs text-stone-500 mb-2">{s.email}</p>
              <div className="flex gap-3 text-xs text-stone-600"><span>⭐ {s.rating}</span><span>{s.hoursBooked}/{s.hoursAvailable}h booked</span></div>
              <ProgressBar value={s.hoursBooked} max={s.hoursAvailable} color="bg-green-500" />
            </div>
          ))}</div>
        </div>
      )}
    </div>
  );
};

const StaffDashboard = ({ currentUser }) => {
  const { staffMembers, events, assignments, requests, checkIns } = useScheduling();
  const me = staffMembers.find(s => s.id === currentUser.staffId);
  const myAssignments = assignments.filter(a => a.staffId === currentUser.staffId).map(a => events.find(e => e.id === a.eventId)).filter(Boolean);
  const myCheckedInIds = new Set(checkIns.filter(c=>c.staffId===currentUser.staffId).map(c=>c.eventId));
  const myRequests = requests.filter(r => r.staffId === currentUser.staffId);
  const pendingCount = myRequests.filter(r => r.status === 'pending').length;
  const util = me ? Math.round((me.hoursBooked / me.hoursAvailable) * 100) : 0;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-3xl font-display font-bold" style={{ color:BRAND.green }}>My Dashboard</h2><p className="text-stone-500 text-sm mt-0.5">Welcome back, {currentUser.name}</p></div>
        <span className="bg-teal-100 text-teal-700 text-xs font-bold px-3 py-1.5 rounded-full">STAFF</span>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[{ label:'Assigned Events', value:myAssignments.length, icon:Calendar, color:'text-orange-500' },{ label:'Pending Requests', value:pendingCount, icon:Clock, color:'text-amber-500' },{ label:'Hours Booked', value:me?`${me.hoursBooked}/${me.hoursAvailable}h`:'—', icon:BarChart3, color:'text-green-500' },{ label:'Utilization', value:`${util}%`, icon:TrendingUp, color:'text-green-500' }].map(({ label, value, icon:Icon, color })=>(
          <div key={label} className="bg-white rounded-xl p-5 border border-stone-200 shadow-sm">
            <div className="flex items-center justify-between"><div><p className="text-xs font-semibold text-stone-500 uppercase tracking-wide">{label}</p><p className="text-2xl font-bold text-stone-900 mt-1">{value}</p></div><Icon className={`w-9 h-9 ${color}`} /></div>
          </div>
        ))}
      </div>
      <div><h3 className="text-lg font-bold text-stone-900 mb-3">My Assigned Events</h3>
        {myAssignments.length===0 ? (
          <div className="bg-white rounded-xl p-10 border border-stone-200 text-center"><Calendar className="w-8 h-8 text-stone-300 mx-auto mb-2" /><p className="text-stone-400 text-sm">No events assigned yet. Head to Find Events to request one.</p></div>
        ) : (
          <div className="space-y-3">{myAssignments.map(ev=>(
            <div key={ev.id} className="bg-white rounded-xl p-4 border border-stone-200 shadow-sm">
              <div className="flex items-center justify-between mb-2"><span className="font-semibold text-stone-900">{ev.name}</span><div className="flex items-center gap-2"><StatusBadge status={ev.status} />{myCheckedInIds.has(ev.id) && <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full flex items-center gap-1"><QrCode className="w-3 h-3" />Checked in</span>}</div></div>
              <p className="text-xs text-stone-500">{formatDate(ev.date)} · {ev.time} · {ev.location}</p>
            </div>
          ))}</div>
        )}
      </div>
      {myRequests.length>0 && (
        <div><h3 className="text-lg font-bold text-stone-900 mb-3">My Requests</h3>
          <div className="space-y-2">{myRequests.slice().reverse().map(r=>{
            const ev = events.find(e=>e.id===r.eventId);
            if (!ev) return null;
            return (
              <div key={r.id} className="flex items-center justify-between bg-white rounded-xl p-3 border border-stone-200">
                <div><p className="text-sm font-semibold text-stone-900">{ev.name}</p><p className="text-xs text-stone-500">{formatDate(ev.date)}</p></div>
                <RequestStatusBadge status={r.status} />
              </div>
            );
          })}</div>
        </div>
      )}
    </div>
  );
};

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const goToMatch = (eventId) => navigate(`/smart-match?event=${eventId}`);

  return (
    <>
      {currentUser.role === 'Admin' && <AdminDashboard onGoToMatch={goToMatch} onEventClick={setSelectedEvent} onStaffClick={setSelectedStaff} />}
      {currentUser.role === 'Manager' && <ManagerDashboard currentUser={currentUser} />}
      {currentUser.role === 'Staff' && <StaffDashboard currentUser={currentUser} />}
      {selectedEvent && <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} onGoToMatch={goToMatch} />}
      {selectedStaff && <StaffProfileModal staff={selectedStaff} onClose={() => setSelectedStaff(null)} />}
    </>
  );
};

export default Dashboard;
