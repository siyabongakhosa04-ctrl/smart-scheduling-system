import { apiFetch } from './api';

// --- Client-side password strength meter ---
// This is UX feedback only — live, as-you-type, no network round trip.
// The backend independently re-validates and is the authoritative check;
// this never replaces server-side validation, it just avoids a request per keystroke.
const COMMON_PASSWORDS = new Set(['password','password1','password123','12345678','123456789','qwerty123','letmein','admin123','welcome1','iloveyou','abc12345','111111111','sunshine1']);

export const getPasswordStrength = (pw) => {
  const checks = { length: pw.length>=8, upper:/[A-Z]/.test(pw), lower:/[a-z]/.test(pw), number:/[0-9]/.test(pw), special:/[^A-Za-z0-9]/.test(pw) };
  const isCommon = COMMON_PASSWORDS.has(pw.toLowerCase());
  let score = Object.values(checks).filter(Boolean).length;
  if (isCommon) score = Math.min(score, 1);
  const levels = [
    { label:'Very weak', color:'#dc2626' },
    { label:'Weak', color:'#f97316' },
    { label:'Fair', color:'#eab308' },
    { label:'Good', color:'#65a30d' },
    { label:'Strong', color:'#16a34a' },
  ];
  const lvl = levels[Math.min(score,4)];
  return { score, label: pw ? lvl.label : '', color: lvl.color, pct: pw ? (Math.min(score,5)/5)*100 : 0, checks, isCommon, valid: checks.length && checks.upper && checks.lower && checks.number && checks.special && !isCommon };
};

// --- Public service API — now backed by the real Express + MySQL API ---

/** Attempt sign-in. Password hashing (bcrypt) and lockout are enforced server-side now. */
export const login = async (email, password) => {
  try {
    const data = await apiFetch('/auth/login', { method: 'POST', body: { email, password }, auth: false });
    return { ok: true, user: data.user, token: data.token };
  } catch (err) {
    if (err.status === 429) {
      return { ok: false, lockedForSeconds: err.data?.lockedForSeconds, justLocked: err.data?.justLocked };
    }
    if (err.status === 401) {
      return { ok: false, attemptsRemaining: err.data?.attemptsRemaining };
    }
    throw err;
  }
};

/** Register a new account. Returns { ok, error? } or { ok:true, email }. Never auto-logs in. */
export const signUp = async ({ name, email, role, position, password, confirmPassword }) => {
  try {
    const data = await apiFetch('/auth/register', { method: 'POST', body: { name, email, role, position, password, confirmPassword }, auth: false });
    return { ok: true, email: data.email };
  } catch (err) {
    return { ok: false, error: err.message };
  }
};

export const logout = () => {
  localStorage.removeItem('sched_token');
  localStorage.removeItem('sched_user');
};

export const loadStoredUser = () => {
  try {
    const token = localStorage.getItem('sched_token');
    const s = localStorage.getItem('sched_user');
    if (!token || !s) return null;
    return JSON.parse(s);
  } catch { return null; }
};

export const persistUser = (user, token) => {
  localStorage.setItem('sched_user', JSON.stringify(user));
  if (token) localStorage.setItem('sched_token', token);
};
