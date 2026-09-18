import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Calendar as CalendarIcon, ChevronLeft, ChevronRight, List } from 'lucide-react';
import { BRAND, STATUS_OPTIONS } from '../utils/constants';
import { formatDate } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import { useScheduling } from '../context/ScheduleContext';
import { StatusBadge } from '../components/Badges';
import ScheduleCard from '../components/ScheduleCard';
import EventFormModal from '../components/modals/EventFormModal';
import EventDetailModal from '../components/modals/EventDetailModal';

const EventsTab = ({ onEventClick, onGoToMatch }) => {
  const { events, addEvent, updateEvent, deleteEvent } = useScheduling();
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const filteredEvents = events.filter(ev => {
    const q = search.trim().toLowerCase();
    const matchesSearch = !q || ev.name.toLowerCase().includes(q) || ev.location.toLowerCase().includes(q) || ev.requiredSkills.some(sk=>sk.toLowerCase().includes(q));
    const matchesStatus = statusFilter==='all' || ev.status===statusFilter;
    return matchesSearch && matchesStatus;
  });
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><span /><button onClick={()=>setModal({mode:'add'})} className="flex items-center gap-2 bg-gradient-to-r from-[#F0812E] to-[#D96A1F] text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition text-sm"><Plus className="w-4 h-4" />Add Event</button></div>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search events by name, location, or skill…" className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500" />
        </div>
        <div className="relative">
          <Filter className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="pl-9 pr-8 py-2.5 rounded-xl border border-stone-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none">
            <option value="all">All statuses</option>
            {STATUS_OPTIONS.map(s=><option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
      {(search || statusFilter!=='all') && (
        <p className="text-xs text-stone-500">{filteredEvents.length} of {events.length} events match{search && ` "${search}"`}{statusFilter!=='all' && ` · ${statusFilter}`}</p>
      )}
      {filteredEvents.length===0 ? (
        events.length===0 ? (
          <div className="bg-white rounded-xl p-12 border border-stone-200 text-center"><CalendarIcon className="w-8 h-8 text-stone-300 mx-auto mb-2" /><p className="text-stone-400 text-sm mb-3">No events yet.</p><button onClick={()=>setModal({mode:'add'})} className="text-xs font-semibold px-4 py-2 rounded-lg text-white" style={{ background:BRAND.orange }}>Create your first event</button></div>
        ) : (
          <div className="bg-white rounded-xl p-12 border border-stone-200 text-center"><Search className="w-8 h-8 text-stone-300 mx-auto mb-2" /><p className="text-stone-400 text-sm">No events match your search.</p></div>
        )
      ) : (
        <div className="space-y-3">{filteredEvents.map((ev, i) => (
          <ScheduleCard key={ev.id} event={ev} index={i} onView={onEventClick} onEdit={(e)=>setModal({mode:'edit', event:e})} onDelete={deleteEvent} />
        ))}</div>
      )}
      {modal?.mode==='add' && <EventFormModal onClose={()=>setModal(null)} onSave={data=>addEvent(data)} />}
      {modal?.mode==='edit' && <EventFormModal event={modal.event} onClose={()=>setModal(null)} onSave={data=>updateEvent(modal.event.id,data)} />}
    </div>
  );
};

const CalendarTab = ({ onEventClick }) => {
  const { events } = useScheduling();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const firstDay = new Date(year,month,1).getDay();
  const daysInMonth = new Date(year,month+1,0).getDate();
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const eventsThisMonth = events.filter(e=>{ const d=new Date(e.date+'T00:00:00'); return d.getFullYear()===year&&d.getMonth()===month; });
  const getEventsOnDay = (day) => eventsThisMonth.filter(e=>new Date(e.date+'T00:00:00').getDate()===day);
  const prev = () => { if (month===0){setMonth(11);setYear(y=>y-1);}else setMonth(m=>m-1); };
  const next = () => { if (month===11){setMonth(0);setYear(y=>y+1);}else setMonth(m=>m+1); };
  const statusDot = { open:'#ef4444', scheduled:'#3b82f6', 'in-progress':'#f59e0b', completed:'#10b981' };
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <button onClick={prev} className="p-2 hover:bg-stone-100 rounded-lg transition"><ChevronLeft className="w-5 h-5" /></button>
          <h3 className="font-bold text-stone-900 text-lg">{monthNames[month]} {year}</h3>
          <button onClick={next} className="p-2 hover:bg-stone-100 rounded-lg transition"><ChevronRight className="w-5 h-5" /></button>
        </div>
        <div className="grid grid-cols-7 border-b border-stone-100">
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=><div key={d} className="py-3 text-center text-xs font-bold text-stone-400 uppercase tracking-wide">{d}</div>)}
        </div>
        <div className="grid grid-cols-7">
          {Array.from({length:firstDay}).map((_,i)=><div key={`e${i}`} className="min-h-[90px] border-r border-b border-stone-100 bg-stone-50/50" />)}
          {Array.from({length:daysInMonth}).map((_,i)=>{
            const day=i+1; const dayEvents=getEventsOnDay(day);
            const isToday=day===today.getDate()&&month===today.getMonth()&&year===today.getFullYear();
            return (
              <div key={day} className={`min-h-[90px] border-r border-b border-stone-100 p-1.5 cal-day ${isToday?'today':''}`}>
                <span className={`text-xs font-bold block mb-1 ${isToday?'text-orange-700':'text-stone-600'}`}>{day}</span>
                {dayEvents.slice(0,2).map(ev=>(
                  <button key={ev.id} onClick={()=>onEventClick(ev)} className="w-full text-left text-xs rounded px-1.5 py-0.5 mb-0.5 font-medium truncate flex items-center gap-1" style={{ background:`${statusDot[ev.status]}18`, color:statusDot[ev.status] }}>
                    <span style={{ width:5, height:5, borderRadius:'50%', background:statusDot[ev.status], flexShrink:0 }} />{ev.name}
                  </button>
                ))}
                {dayEvents.length>2&&<span className="text-xs text-stone-400 px-1">+{dayEvents.length-2} more</span>}
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-bold text-stone-900 mb-3">Events This Month ({eventsThisMonth.length})</h3>
        {eventsThisMonth.length===0?<p className="text-stone-400 text-sm">No events this month.</p>:
          <div className="space-y-2">{eventsThisMonth.sort((a,b)=>a.date.localeCompare(b.date)).map(ev=>(
            <button key={ev.id} onClick={()=>onEventClick(ev)} className="w-full text-left bg-white rounded-xl p-4 border border-stone-200 shadow-sm hover:shadow-md transition flex items-center justify-between">
              <div><p className="font-semibold text-stone-900">{ev.name}</p><p className="text-xs text-stone-500 mt-0.5">{formatDate(ev.date)} · {ev.time} · {ev.location}</p></div>
              <StatusBadge status={ev.status} />
            </button>
          ))}</div>}
      </div>
    </div>
  );
};

const ManagerSchedule = () => {
  const { events } = useScheduling();
  const myEvents = events.slice(0, 4);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><span /><span className="text-xs bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full font-semibold">Read-only</span></div>
      {myEvents.map((ev, i) => <ScheduleCard key={ev.id} event={ev} index={i} />)}
    </div>
  );
};

const Schedule = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('events');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const goToMatch = (eventId) => navigate(`/smart-match?event=${eventId}`);

  const title = currentUser.role === 'Admin' ? 'Schedule' : 'My Events';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-display font-bold" style={{ color:BRAND.green }}>{title}</h2>
        {currentUser.role === 'Admin' && (
          <div className="flex bg-white border border-stone-200 rounded-xl p-1">
            <button onClick={()=>setTab('events')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${tab==='events' ? 'bg-orange-50 text-orange-700' : 'text-stone-500'}`}><List className="w-3.5 h-3.5" />Events</button>
            <button onClick={()=>setTab('calendar')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${tab==='calendar' ? 'bg-orange-50 text-orange-700' : 'text-stone-500'}`}><CalendarIcon className="w-3.5 h-3.5" />Calendar</button>
          </div>
        )}
      </div>

      {currentUser.role === 'Admin' ? (
        tab === 'events'
          ? <EventsTab onEventClick={setSelectedEvent} />
          : <CalendarTab onEventClick={setSelectedEvent} />
      ) : (
        <ManagerSchedule />
      )}

      {selectedEvent && <EventDetailModal event={selectedEvent} onClose={()=>setSelectedEvent(null)} onGoToMatch={goToMatch} />}
    </div>
  );
};

export default Schedule;
