import { useState } from 'react';
import { Plus, Search, Filter, Users } from 'lucide-react';
import { BRAND, SENIORITY_LEVELS } from '../utils/constants';
import { useAuth } from '../context/AuthContext';
import { useScheduling } from '../context/ScheduleContext';
import StaffCard from '../components/StaffCard';
import StaffFormModal from '../components/modals/StaffFormModal';
import StaffProfileModal from '../components/modals/StaffProfileModal';

const AdminStaff = ({ onStaffClick }) => {
  const { staffMembers, addStaff, updateStaff, deleteStaff } = useScheduling();
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState('');
  const [seniorityFilter, setSeniorityFilter] = useState('all');
  const filteredStaff = staffMembers.filter(s => {
    const q = search.trim().toLowerCase();
    const matchesSearch = !q || s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.skills.some(sk=>sk.toLowerCase().includes(q));
    const matchesSeniority = seniorityFilter==='all' || s.seniority===seniorityFilter;
    return matchesSearch && matchesSeniority;
  });
  return (
    <>
      <div className="flex items-center justify-between mb-6"><span /><button onClick={()=>setModal({mode:'add'})} className="flex items-center gap-2 bg-gradient-to-r from-[#F0812E] to-[#D96A1F] text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition text-sm"><Plus className="w-4 h-4" />Add Staff</button></div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search staff by name, email, or skill…" className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500" />
        </div>
        <div className="relative">
          <Filter className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select value={seniorityFilter} onChange={e=>setSeniorityFilter(e.target.value)} className="pl-9 pr-8 py-2.5 rounded-xl border border-stone-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none">
            <option value="all">All levels</option>
            {SENIORITY_LEVELS.map(l=><option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </div>
      {(search || seniorityFilter!=='all') && (
        <p className="text-xs text-stone-500 mb-4">{filteredStaff.length} of {staffMembers.length} staff match{search && ` "${search}"`}{seniorityFilter!=='all' && ` · ${seniorityFilter}`}</p>
      )}
      {filteredStaff.length===0 ? (
        staffMembers.length===0 ? (
          <div className="bg-white rounded-xl p-12 border border-stone-200 text-center"><Users className="w-8 h-8 text-stone-300 mx-auto mb-2" /><p className="text-stone-400 text-sm mb-3">No staff yet.</p><button onClick={()=>setModal({mode:'add'})} className="text-xs font-semibold px-4 py-2 rounded-lg text-white" style={{ background:BRAND.orange }}>Add your first staff member</button></div>
        ) : (
          <div className="bg-white rounded-xl p-12 border border-stone-200 text-center"><Search className="w-8 h-8 text-stone-300 mx-auto mb-2" /><p className="text-stone-400 text-sm">No staff match your search.</p></div>
        )
      ) : (
        <div className="space-y-3">{filteredStaff.map((s, i) => (
          <StaffCard key={s.id} staff={s} index={i} onView={onStaffClick} onEdit={(st)=>setModal({mode:'edit', staff:st})} onDelete={deleteStaff} />
        ))}</div>
      )}
      {modal?.mode==='add' && <StaffFormModal onClose={()=>setModal(null)} onSave={data=>addStaff(data)} />}
      {modal?.mode==='edit' && <StaffFormModal staff={modal.staff} onClose={()=>setModal(null)} onSave={data=>updateStaff(modal.staff.id,data)} />}
    </>
  );
};

const ManagerStaff = () => {
  const { staffMembers, assignments } = useScheduling();
  const myEventIds = [1, 2, 3, 4];
  const myStaffIds = new Set(assignments.filter(a=>myEventIds.includes(a.eventId)).map(a=>a.staffId));
  const myStaff = staffMembers.filter(s=>myStaffIds.has(s.id));
  return (
    <>
      <div className="flex items-center justify-between mb-6"><span /><span className="text-xs bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full font-semibold">Read-only</span></div>
      {myStaff.length===0 ? (
        <div className="bg-white rounded-xl p-12 border border-stone-200 text-center"><Users className="w-10 h-10 text-stone-300 mx-auto mb-3" /><p className="text-stone-400 text-sm">No staff assigned to your events yet.</p></div>
      ) : (
        <div className="space-y-3">{myStaff.map((s, i) => <StaffCard key={s.id} staff={s} index={i} />)}</div>
      )}
    </>
  );
};

const StaffPage = () => {
  const { currentUser } = useAuth();
  const [selectedStaff, setSelectedStaff] = useState(null);
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-display font-bold" style={{ color:BRAND.green }}>{currentUser.role === 'Admin' ? 'Staff' : 'My Staff'}</h2>
      {currentUser.role === 'Admin' ? <AdminStaff onStaffClick={setSelectedStaff} /> : <ManagerStaff />}
      {selectedStaff && <StaffProfileModal staff={selectedStaff} onClose={()=>setSelectedStaff(null)} />}
    </div>
  );
};

export default StaffPage;
