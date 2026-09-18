import { statusClasses, seniorityClasses, requestStatusClasses } from '../utils/constants';

export const StatusBadge = ({ status }) => (
  <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>{status}</span>
);

export const SeniorityBadge = ({ seniority }) => (
  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${seniorityClasses[seniority] || 'bg-gray-100 text-gray-800'}`}>{seniority}</span>
);

export const RequestStatusBadge = ({ status }) => (
  <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${requestStatusClasses[status] || 'bg-stone-100 text-stone-700 border-stone-200'}`}>{status}</span>
);

export const ProgressBar = ({ value, max, color = 'bg-orange-500' }) => (
  <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden mt-2">
    <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${Math.min(100, Math.round((value / max) * 100))}%` }} />
  </div>
);
