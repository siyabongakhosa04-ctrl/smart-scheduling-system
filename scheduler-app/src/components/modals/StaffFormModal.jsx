import { useState } from 'react';
import Modal from '../Modal';
import { SENIORITY_LEVELS, ALL_SKILLS } from '../../utils/constants';

const StaffFormModal = ({ staff, onClose, onSave }) => {
  const [form, setForm] = useState({ name:staff?.name||'', email:staff?.email||'', seniority:staff?.seniority||'Mid', rating:staff?.rating||4.0, hoursAvailable:staff?.hoursAvailable||40, hoursBooked:staff?.hoursBooked||0, nextAvailable:staff?.nextAvailable||'', skills:staff?.skills||[] });
  const toggleSkill = (skill) => setForm(f => ({ ...f, skills:f.skills.includes(skill)?f.skills.filter(s=>s!==skill):[...f.skills,skill] }));
  const handleSubmit = () => { if (!form.name.trim()||!form.email.trim()) { alert('Please fill in name and email.'); return; } onSave(form); onClose(); };
  return (
    <Modal title={staff?'Edit Staff Member':'Add Staff Member'} onClose={onClose}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-xs font-semibold text-stone-600 mb-1">Full Name *</label><input className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Full name" /></div>
          <div><label className="block text-xs font-semibold text-stone-600 mb-1">Email *</label><input className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="email@company.com" /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-xs font-semibold text-stone-600 mb-1">Seniority</label><select className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" value={form.seniority} onChange={e=>setForm(f=>({...f,seniority:e.target.value}))}>{SENIORITY_LEVELS.map(l=><option key={l} value={l}>{l}</option>)}</select></div>
          <div><label className="block text-xs font-semibold text-stone-600 mb-1">Rating (0–5)</label><input type="number" step="0.1" min="0" max="5" className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" value={form.rating} onChange={e=>setForm(f=>({...f,rating:parseFloat(e.target.value)||0}))} /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-xs font-semibold text-stone-600 mb-1">Hours Available</label><input type="number" min="1" className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" value={form.hoursAvailable} onChange={e=>setForm(f=>({...f,hoursAvailable:parseInt(e.target.value)||1}))} /></div>
          <div><label className="block text-xs font-semibold text-stone-600 mb-1">Hours Booked</label><input type="number" min="0" className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" value={form.hoursBooked} onChange={e=>setForm(f=>({...f,hoursBooked:parseInt(e.target.value)||0}))} /></div>
        </div>
        <div><label className="block text-xs font-semibold text-stone-600 mb-1">Next Available Date</label><input type="date" className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" value={form.nextAvailable} onChange={e=>setForm(f=>({...f,nextAvailable:e.target.value}))} /></div>
        <div><label className="block text-xs font-semibold text-stone-600 mb-2">Skills</label>
          <div className="grid grid-cols-2 gap-1 max-h-44 overflow-y-auto border border-stone-200 rounded-lg p-3">
            {ALL_SKILLS.map(skill => <label key={skill} className="flex items-center gap-2 text-xs cursor-pointer py-0.5"><input type="checkbox" checked={form.skills.includes(skill)} onChange={()=>toggleSkill(skill)} className="rounded" />{skill}</label>)}
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button onClick={handleSubmit} className="flex-1 bg-[#F0812E] text-white py-2.5 rounded-xl font-semibold hover:bg-[#D96A1F] transition text-sm">{staff?'Update Staff':'Add Staff'}</button>
          <button onClick={onClose} className="px-4 py-2.5 border border-stone-200 rounded-xl text-stone-600 hover:bg-stone-50 transition text-sm">Cancel</button>
        </div>
      </div>
    </Modal>
  );
};


export default StaffFormModal;
