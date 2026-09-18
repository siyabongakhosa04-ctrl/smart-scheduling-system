import { useState } from 'react';
import Modal from '../Modal';
import { STATUS_OPTIONS, SENIORITY_LEVELS, ALL_SKILLS } from '../../utils/constants';

const EventFormModal = ({ event, onClose, onSave }) => {
  const [form, setForm] = useState({ name:event?.name||'', date:event?.date||'', time:event?.time||'09:00', location:event?.location||'', status:event?.status||'open', requiredSeniority:event?.requiredSeniority||'Mid', requiredStaff:event?.requiredStaff||4, attendees:event?.attendees||50, budget:event?.budget||1000, spent:event?.spent||0, requiredSkills:event?.requiredSkills||[], complexity:event?.complexity||0.5 });
  const toggleSkill = (skill) => setForm(f => ({ ...f, requiredSkills:f.requiredSkills.includes(skill)?f.requiredSkills.filter(s=>s!==skill):[...f.requiredSkills,skill] }));
  const handleSubmit = () => { if (!form.name.trim()||!form.date||!form.location.trim()) { alert('Please fill in name, date, and location.'); return; } onSave(form); onClose(); };
  return (
    <Modal title={event?'Edit Event':'Add Event'} onClose={onClose}>
      <div className="space-y-4">
        <div><label className="block text-xs font-semibold text-stone-600 mb-1">Event Name *</label><input className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Event name" /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-xs font-semibold text-stone-600 mb-1">Date *</label><input type="date" className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} /></div>
          <div><label className="block text-xs font-semibold text-stone-600 mb-1">Time</label><input type="time" className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" value={form.time} onChange={e=>setForm(f=>({...f,time:e.target.value}))} /></div>
        </div>
        <div><label className="block text-xs font-semibold text-stone-600 mb-1">Location *</label><input className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" value={form.location} onChange={e=>setForm(f=>({...f,location:e.target.value}))} placeholder="Venue / address" /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-xs font-semibold text-stone-600 mb-1">Status</label><select className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))}>{STATUS_OPTIONS.map(s=><option key={s} value={s}>{s}</option>)}</select></div>
          <div><label className="block text-xs font-semibold text-stone-600 mb-1">Seniority Required</label><select className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" value={form.requiredSeniority} onChange={e=>setForm(f=>({...f,requiredSeniority:e.target.value}))}>{SENIORITY_LEVELS.map(s=><option key={s} value={s}>{s}</option>)}</select></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-xs font-semibold text-stone-600 mb-1">Staff Needed</label><input type="number" min="1" className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" value={form.requiredStaff} onChange={e=>setForm(f=>({...f,requiredStaff:parseInt(e.target.value)||1}))} /></div>
          <div><label className="block text-xs font-semibold text-stone-600 mb-1">Attendees</label><input type="number" min="1" className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" value={form.attendees} onChange={e=>setForm(f=>({...f,attendees:parseInt(e.target.value)||1}))} /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-xs font-semibold text-stone-600 mb-1">Budget ($)</label><input type="number" min="0" className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" value={form.budget} onChange={e=>setForm(f=>({...f,budget:parseInt(e.target.value)||0}))} /></div>
          <div><label className="block text-xs font-semibold text-stone-600 mb-1">Spent ($)</label><input type="number" min="0" className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" value={form.spent} onChange={e=>setForm(f=>({...f,spent:parseInt(e.target.value)||0}))} /></div>
        </div>
        <div><label className="block text-xs font-semibold text-stone-600 mb-2">Required Skills</label>
          <div className="grid grid-cols-2 gap-1 max-h-44 overflow-y-auto border border-stone-200 rounded-lg p-3">
            {ALL_SKILLS.map(skill => <label key={skill} className="flex items-center gap-2 text-xs cursor-pointer py-0.5"><input type="checkbox" checked={form.requiredSkills.includes(skill)} onChange={()=>toggleSkill(skill)} className="rounded" />{skill}</label>)}
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button onClick={handleSubmit} className="flex-1 bg-[#F0812E] text-white py-2.5 rounded-xl font-semibold hover:bg-[#D96A1F] transition text-sm">{event?'Update Event':'Create Event'}</button>
          <button onClick={onClose} className="px-4 py-2.5 border border-stone-200 rounded-xl text-stone-600 hover:bg-stone-50 transition text-sm">Cancel</button>
        </div>
      </div>
    </Modal>
  );
};

export default EventFormModal;
