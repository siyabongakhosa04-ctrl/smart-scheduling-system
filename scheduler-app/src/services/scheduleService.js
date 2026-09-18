import { apiFetch } from './api';

// --- Events ---
export const getEvents = () => apiFetch('/events');
export const createEvent = (data) => apiFetch('/events', { method: 'POST', body: data });
export const updateEvent = (id, data) => apiFetch(`/events/${id}`, { method: 'PUT', body: data });
export const deleteEvent = (id) => apiFetch(`/events/${id}`, { method: 'DELETE' });

// --- Staff ---
export const getStaff = () => apiFetch('/staff');
export const createStaff = (data) => apiFetch('/staff', { method: 'POST', body: data });
export const updateStaff = (id, data) => apiFetch(`/staff/${id}`, { method: 'PUT', body: data });
export const deleteStaff = (id) => apiFetch(`/staff/${id}`, { method: 'DELETE' });

// --- Assignments ---
export const getAssignments = () => apiFetch('/assignments');
export const assignStaffToEvent = (staffId, eventId) => apiFetch('/assignments', { method: 'POST', body: { staffId, eventId } });
export const unassignStaffFromEvent = (staffId, eventId) => apiFetch('/assignments', { method: 'DELETE', body: { staffId, eventId } });

// --- Requests ---
export const getRequests = () => apiFetch('/requests');
export const createRequest = (staffId, eventId, staffName) => apiFetch('/requests', { method: 'POST', body: { staffId, eventId, staffName } });
export const cancelRequest = (id) => apiFetch(`/requests/${id}`, { method: 'DELETE' });
export const approveRequest = (id) => apiFetch(`/requests/${id}/approve`, { method: 'PATCH' });
export const declineRequest = (id) => apiFetch(`/requests/${id}/decline`, { method: 'PATCH' });

// --- Check-ins ---
export const getCheckIns = () => apiFetch('/checkins');
export const submitCheckIn = (staffId, eventId, code) => apiFetch('/checkins', { method: 'POST', body: { staffId, eventId, code } });

// --- Audit log ---
export const getAuditLog = () => apiFetch('/audit-log');
export const addAuditLog = (action, detail, user) => apiFetch('/audit-log', { method: 'POST', body: { action, detail, user } });
