import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, ChefHat, Users, Target, Settings, Eye, AlertCircle, ArrowRight } from 'lucide-react';
import { BRAND, STAFF_POSITIONS } from '../utils/constants';
import { getPasswordStrength } from '../services/authService';
import { PasswordStrengthMeter } from '../components/PasswordStrength';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Staff');
  const [position, setPosition] = useState(STAFF_POSITIONS[0]);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const strength = getPasswordStrength(password);

  const handleSignUp = async () => {
    setTouched(true);
    setError('');
    setLoading(true);
    const result = await signUp({ name, email, role, position, password, confirmPassword });
    setLoading(false);
    if (!result.ok) { setError(result.error); return; }
    navigate('/login', { state: { email: result.email, success: 'Account created! Sign in with your new password below.' } });
  };

  return (
    <div className="aura-bg" style={{ minHeight:'100vh', display:'flex', flexDirection:'column', fontFamily:"'Inter',sans-serif" }}>
      <div className="aura-layer-1" />
      <div className="aura-layer-2" />
      <div className="aura-content" style={{ display:'flex', flexDirection:'column', flex:1 }}>
        <header style={{ width:'100%', padding:'16px 24px', display:'flex', alignItems:'center', gap:12 }}>
          <button onClick={() => navigate('/')} style={{ background:'none', border:'none', color:BRAND.textMuted, cursor:'pointer', display:'flex', alignItems:'center', gap:6, fontSize:13, fontWeight:600 }}>
            <ChevronLeft style={{ width:16, height:16 }} /> Back
          </button>
        </header>
        <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'24px 16px 56px' }}>
          <div className="card-boot fade-up-2" style={{ width:'100%', maxWidth:420, background:'#fff', borderRadius:28, boxShadow:'0 20px 50px rgba(45,42,38,0.12)', padding:36 }}>
            <div style={{ display:'flex', background:BRAND.creamSoft, borderRadius:12, padding:4, marginBottom:24 }}>
              <Link to="/login" style={{ flex:1, padding:'9px', borderRadius:9, textAlign:'center', fontSize:13, fontWeight:700, color:BRAND.textMuted, textDecoration:'none' }}>Sign In</Link>
              <span style={{ flex:1, padding:'9px', borderRadius:9, textAlign:'center', fontSize:13, fontWeight:700, background:'#fff', color:BRAND.green, boxShadow:'0 2px 6px rgba(45,42,38,0.08)' }}>Create Account</span>
            </div>

            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', marginBottom:20 }}>
              <div style={{ width:64, height:64, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16, background:BRAND.creamSoft }}>
                <ChefHat style={{ width:28, height:28, color:BRAND.orange }} />
              </div>
              <h2 style={{ fontFamily:"'Baloo 2',sans-serif", fontSize:24, fontWeight:800, color:BRAND.green, margin:0 }}>Create your account</h2>
              <p style={{ color:BRAND.textMuted, fontSize:13, marginTop:6, textAlign:'center' }}>Join Smart Scheduler — your details stay on this device</p>
            </div>

            <label style={{ display:'block', fontSize:13, fontWeight:700, color:BRAND.text, marginBottom:6 }}>Full name</label>
            <div style={{ position:'relative', marginBottom:14 }}>
              <Users style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', width:16, height:16, color:BRAND.orange }} />
              <input value={name} onChange={e=>setName(e.target.value)} placeholder="Jane Dlamini"
                className="warm-input" style={{ width:'100%', padding:'12px 12px 12px 40px', borderRadius:12, border:'1px solid #e7ddc9', fontSize:14, outline:'none' }} />
            </div>

            <label style={{ display:'block', fontSize:13, fontWeight:700, color:BRAND.text, marginBottom:6 }}>Email</label>
            <div style={{ position:'relative', marginBottom:14 }}>
              <Target style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', width:16, height:16, color:BRAND.orange }} />
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"
                className="warm-input" style={{ width:'100%', padding:'12px 12px 12px 40px', borderRadius:12, border:'1px solid #e7ddc9', fontSize:14, outline:'none' }} />
            </div>

            <label style={{ display:'block', fontSize:13, fontWeight:700, color:BRAND.text, marginBottom:6 }}>Role <span style={{ fontWeight:400, color:BRAND.textMuted }}>(for this demo)</span></label>
            <select value={role} onChange={e=>setRole(e.target.value)} className="warm-input" style={{ width:'100%', padding:'12px', borderRadius:12, border:'1px solid #e7ddc9', fontSize:14, outline:'none', marginBottom:14, background:'#fff' }}>
              <option value="Staff">Staff</option>
              <option value="Manager">Manager</option>
              <option value="Admin">Admin</option>
            </select>

            {role === 'Staff' && (
              <>
                <label style={{ display:'block', fontSize:13, fontWeight:700, color:BRAND.text, marginBottom:6 }}>Position</label>
                <select value={position} onChange={e=>setPosition(e.target.value)} className="warm-input" style={{ width:'100%', padding:'12px', borderRadius:12, border:'1px solid #e7ddc9', fontSize:14, outline:'none', marginBottom:14, background:'#fff' }}>
                  {STAFF_POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </>
            )}

            <label style={{ display:'block', fontSize:13, fontWeight:700, color:BRAND.text, marginBottom:6 }}>Password</label>
            <div style={{ position:'relative', marginBottom:8 }}>
              <Settings style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', width:16, height:16, color:BRAND.orange }} />
              <input type={showPassword?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Create a strong password"
                className="warm-input" style={{ width:'100%', padding:'12px 40px 12px 40px', borderRadius:12, border:'1px solid #e7ddc9', fontSize:14, outline:'none' }} />
              <button type="button" onClick={()=>setShowPassword(v=>!v)} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:BRAND.textMuted }} aria-label={showPassword?'Hide password':'Show password'}>
                <Eye style={{ width:16, height:16 }} />
              </button>
            </div>

            <PasswordStrengthMeter password={password} strength={strength} />

            <label style={{ display:'block', fontSize:13, fontWeight:700, color:BRAND.text, marginBottom:6 }}>Confirm password</label>
            <div style={{ position:'relative', marginBottom:10 }}>
              <Settings style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', width:16, height:16, color:BRAND.orange }} />
              <input type={showPassword?'text':'password'} value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} placeholder="Re-enter your password"
                className="warm-input" style={{ width:'100%', padding:'12px 12px 12px 40px', borderRadius:12, border:`1px solid ${touched && confirmPassword && confirmPassword!==password ? '#fca5a5' : '#e7ddc9'}`, fontSize:14, outline:'none' }} />
            </div>
            {touched && confirmPassword && confirmPassword!==password && (
              <p style={{ fontSize:12, color:'#dc2626', marginBottom:10, marginTop:-4 }}>Passwords don't match yet.</p>
            )}

            {error && (
              <div style={{ display:'flex', alignItems:'center', gap:8, background:'#fef2f2', border:'1px solid #fecaca', borderRadius:10, padding:'8px 12px', marginBottom:12 }}>
                <AlertCircle style={{ width:14, height:14, color:'#dc2626', flexShrink:0 }} />
                <span style={{ color:'#dc2626', fontSize:12 }}>{error}</span>
              </div>
            )}

            <button onClick={handleSignUp} disabled={loading} className="warm-btn" style={{ width:'100%', padding:13, borderRadius:12, border:'none', color:'#fff', fontWeight:700, fontSize:14, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, background:`linear-gradient(90deg, ${BRAND.orange}, ${BRAND.orangeDark})`, marginTop:6 }}>
              {loading ? 'Creating account…' : (<>Create account <ArrowRight style={{ width:16, height:16 }} /></>)}
            </button>

            <p style={{ fontSize:11, color:BRAND.textMuted, marginTop:10, lineHeight:1.5 }}>
              Your password is salted and hashed (SHA-256) before it's stored on this device — never saved in plain text. This is a local demo; a production system would hash server-side.
            </p>

            <p style={{ textAlign:'center', fontSize:13, color:BRAND.textMuted, marginTop:18 }}>
              Already have an account? <Link to="/login" style={{ color:BRAND.orange, fontWeight:700, textDecoration:'none' }}>Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
