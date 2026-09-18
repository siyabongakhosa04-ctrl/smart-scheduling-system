import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import * as api from '../services/scheduleService';
import { useAuth } from './AuthContext';

const ScheduleContext = createContext();

export const useScheduling = () => {
  const ctx = useContext(ScheduleContext);
  if (!ctx) throw new Error('useScheduling must be used within ScheduleProvider');
  return ctx;
};

export const ScheduleProvider = ({ children }) => {
  const { currentUser } = useAuth();

  const [toasts, setToasts] = useState([]);
  const pushToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3200);
  }, []);
  const dismissToast = useCallback((id) => setToasts(prev => prev.filter(t => t.id !== id)), []);

  const [events, setEvents] = useState([]);
  const [staffMembers, setStaffMembers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [requests, setRequests] = useState([]);
  const [checkIns, setCheckIns] = useState([]);
  const [auditLog, setAuditLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  // Initial load — everything comes from the API now, not localStorage.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const isAdmin = currentUser.role === 'Admin';
        const [ev, st, asg, req, chk, audit] = await Promise.all([
          api.getEvents(), api.getStaff(), api.getAssignments(), api.getRequests(), api.getCheckIns(),
          isAdmin ? api.getAuditLog() : Promise.resolve([]),
        ]);
        if (cancelled) return;
        setEvents(ev); setStaffMembers(st); setAssignments(asg); setRequests(req); setCheckIns(chk); setAuditLog(audit);
      } catch (err) {
        if (!cancelled) setLoadError(err.message || 'Could not load data from the server.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addAudit = useCallback(async (action, detail, user) => {
    try {
      await api.addAuditLog(action, detail, user);
      if (currentUser.role === 'Admin') {
        const entry = { action, detail, user, time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) };
        setAuditLog(prev => [entry, ...prev]);
      }
    } catch { /* audit logging failures shouldn't interrupt the user */ }
  }, [currentUser.role]);

  const assignStaff = useCallback(async (staffId, eventId) => {
    if (assignments.some(a => a.staffId===staffId && a.eventId===eventId)) return;
    try {
      await api.assignStaffToEvent(staffId, eventId);
      setAssignments(prev => [...prev, { staffId, eventId }]);
      setEvents(prev => prev.map(e => e.id===eventId ? { ...e, assignedStaff:Math.min(e.assignedStaff+1,e.requiredStaff) } : e));
      setStaffMembers(prev => prev.map(s => s.id===staffId ? { ...s, hoursBooked:Math.min(s.hoursBooked+4,s.hoursAvailable), assignedEvents:s.assignedEvents+1 } : s));
      pushToast('Staff assigned to event');
    } catch (err) { pushToast(err.message || 'Could not assign staff.', 'error'); }
  }, [assignments, pushToast]);

  const unassignStaff = useCallback(async (staffId, eventId) => {
    try {
      await api.unassignStaffFromEvent(staffId, eventId);
      setAssignments(prev => prev.filter(a => !(a.staffId===staffId && a.eventId===eventId)));
      setEvents(prev => prev.map(e => e.id===eventId ? { ...e, assignedStaff:Math.max(0,e.assignedStaff-1) } : e));
      setStaffMembers(prev => prev.map(s => s.id===staffId ? { ...s, hoursBooked:Math.max(0,s.hoursBooked-4), assignedEvents:Math.max(0,s.assignedEvents-1) } : s));
      pushToast('Staff unassigned');
    } catch (err) { pushToast(err.message || 'Could not unassign staff.', 'error'); }
  }, [pushToast]);

  const getConflicts = useCallback((staffId, event) =>
    assignments.filter(a=>a.staffId===staffId).map(a=>events.find(e=>e.id===a.eventId)).filter(e=>e&&e.date===event.date&&e.id!==event.id),
  [assignments, events]);

  const addEvent = useCallback(async (data) => {
    try {
      const created = await api.createEvent(data);
      setEvents(prev => [...prev, created]);
      pushToast(`"${data.name}" event created`);
    } catch (err) { pushToast(err.message || 'Could not create event.', 'error'); }
  }, [pushToast]);

  const updateEvent = useCallback(async (id, data) => {
    try {
      const updated = await api.updateEvent(id, data);
      setEvents(prev => prev.map(e => e.id===id ? updated : e));
      pushToast('Event updated');
    } catch (err) { pushToast(err.message || 'Could not update event.', 'error'); }
  }, [pushToast]);

  const deleteEvent = useCallback(async (id) => {
    try {
      await api.deleteEvent(id);
      const staffToRefund = assignments.filter(a=>a.eventId===id).map(a=>a.staffId);
      setStaffMembers(prev => prev.map(s => staffToRefund.includes(s.id) ? { ...s, hoursBooked:Math.max(0,s.hoursBooked-4), assignedEvents:Math.max(0,s.assignedEvents-1) } : s));
      setAssignments(prev => prev.filter(a=>a.eventId!==id));
      setEvents(prev => prev.filter(e=>e.id!==id));
      setRequests(prev => prev.filter(r=>r.eventId!==id));
      pushToast('Event deleted');
    } catch (err) { pushToast(err.message || 'Could not delete event.', 'error'); }
  }, [assignments, pushToast]);

  const addStaff = useCallback(async (data) => {
    try {
      const created = await api.createStaff(data);
      setStaffMembers(prev => [...prev, created]);
      pushToast(`${data.name} added to staff`);
    } catch (err) { pushToast(err.message || 'Could not add staff member.', 'error'); }
  }, [pushToast]);

  const updateStaff = useCallback(async (id, data) => {
    try {
      const updated = await api.updateStaff(id, data);
      setStaffMembers(prev => prev.map(s => s.id===id ? updated : s));
      pushToast('Staff member updated');
    } catch (err) { pushToast(err.message || 'Could not update staff member.', 'error'); }
  }, [pushToast]);

  const deleteStaff = useCallback(async (id) => {
    try {
      await api.deleteStaff(id);
      const eventsToRefund = assignments.filter(a=>a.staffId===id).map(a=>a.eventId);
      setEvents(prev => prev.map(e => eventsToRefund.includes(e.id) ? { ...e, assignedStaff:Math.max(0,e.assignedStaff-1) } : e));
      setAssignments(prev => prev.filter(a=>a.staffId!==id));
      setStaffMembers(prev => prev.filter(s=>s.id!==id));
      setRequests(prev => prev.filter(r=>r.staffId!==id));
      pushToast('Staff member removed');
    } catch (err) { pushToast(err.message || 'Could not remove staff member.', 'error'); }
  }, [assignments, pushToast]);

  const requestEvent = useCallback(async (staffId, eventId, staffName) => {
    if (requests.some(r => r.staffId===staffId && r.eventId===eventId && r.status==='pending')) return;
    try {
      const created = await api.createRequest(staffId, eventId, staffName);
      if (!created.alreadyRequested) setRequests(prev => [created, ...prev]);
      pushToast('Request sent — waiting on manager approval');
    } catch (err) { pushToast(err.message || 'Could not send request.', 'error'); }
  }, [requests, pushToast]);

  const cancelRequest = useCallback(async (requestId) => {
    try {
      await api.cancelRequest(requestId);
      setRequests(prev => prev.filter(r => r.id!==requestId));
      pushToast('Request cancelled');
    } catch (err) { pushToast(err.message || 'Could not cancel request.', 'error'); }
  }, [pushToast]);

  const approveRequest = useCallback(async (requestId) => {
    const req = requests.find(r => r.id === requestId);
    try {
      const result = await api.approveRequest(requestId);
      setRequests(prev => prev.map(r => r.id===requestId ? { ...r, status:'approved' } : r));
      if (req && result.staffLinked && result.eventLinked && !assignments.some(a=>a.staffId===req.staffId && a.eventId===req.eventId)) {
        setAssignments(prev => [...prev, { staffId: req.staffId, eventId: req.eventId }]);
        setEvents(prev => prev.map(e => e.id===req.eventId ? { ...e, assignedStaff:Math.min(e.assignedStaff+1,e.requiredStaff) } : e));
        setStaffMembers(prev => prev.map(s => s.id===req.staffId ? { ...s, hoursBooked:Math.min(s.hoursBooked+4,s.hoursAvailable), assignedEvents:s.assignedEvents+1 } : s));
      }
      pushToast('Request approved');
    } catch (err) { pushToast(err.message || 'Could not approve request.', 'error'); }
  }, [requests, assignments, pushToast]);

  const declineRequest = useCallback(async (requestId) => {
    try {
      await api.declineRequest(requestId);
      setRequests(prev => prev.map(r => r.id===requestId ? { ...r, status:'declined' } : r));
      pushToast('Request declined');
    } catch (err) { pushToast(err.message || 'Could not decline request.', 'error'); }
  }, [pushToast]);

  const checkInStaff = useCallback(async (staffId, eventId, code) => {
    try {
      await api.submitCheckIn(staffId, eventId, code);
      setCheckIns(prev => [...prev, { staffId, eventId, time: new Date().toISOString() }]);
      pushToast('Checked in successfully!');
      return { ok: true };
    } catch (err) {
      pushToast(err.message || 'Check-in failed.', 'error');
      return { ok: false, error: err.message };
    }
  }, [pushToast]);

  const value = {
    events, staffMembers, assignments, requests, checkIns, auditLog, loading, loadError,
    toasts, pushToast, dismissToast, addAudit,
    assignStaff, unassignStaff, getConflicts,
    addEvent, updateEvent, deleteEvent,
    addStaff, updateStaff, deleteStaff,
    requestEvent, cancelRequest, approveRequest, declineRequest,
    checkInStaff,
  };

  return <ScheduleContext.Provider value={value}>{children}</ScheduleContext.Provider>;
};
