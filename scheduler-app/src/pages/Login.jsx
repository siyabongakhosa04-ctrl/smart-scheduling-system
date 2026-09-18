import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ChevronLeft, ChefHat, Users, Calendar, Target, BarChart3, Settings, Eye, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { BRAND } from '../utils/constants';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState(location.state?.email || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [lockRemaining, setLockRemaining] = useState(0);
  const [signupSuccess] = useState(location.state?.success || '');

  // Lockout is enforced server-side (see backend/routes/auth.js); this timer
  // just counts down the value the server told us, for UI feedback.
  useEffect(() => {
    if (lockRemaining <= 0) return;
    const id = setInterval(() => setLockRemaining(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [lockRemaining]);

  const handleLogin = async () => {
    setError('');
    if (!email.trim() || !password.trim()) { setError('Enter your email and password.'); return; }
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.ok) { navigate('/dashboard'); return; }
    if (result.lockedForSeconds && result.attemptsRemaining === undefined) {
      setError(`Too many failed attempts. Try again in ${result.lockedForSeconds}s.`);
      setLockRemaining(result.lockedForSeconds);
      return;
    }
    if (result.justLocked) {
      setError(`Too many failed attempts. Try again in ${result.lockedForSeconds}s.`);
      setLockRemaining(result.lockedForSeconds);
      return;
    }
    setError(`That email or password is incorrect. ${result.attemptsRemaining} attempt(s) remaining.`);
  };
  const handleKeyDown = (e) => { if (e.key === 'Enter') handleLogin(); };

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
          <div style={{ width:'100%', maxWidth:1000, display:'grid', gridTemplateColumns:'1fr', gap:40, alignItems:'center' }} className="login-grid">
            <div className="login-left fade-up-1" style={{ display:'none' }}>
              <div style={{ width:64, height:64, borderRadius:20, background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:24, boxShadow:'0 8px 20px rgba(45,42,38,0.08)' }}>
                <ChefHat style={{ width:28, height:28, color:BRAND.orange }} />
              </div>
              <h1 style={{ fontFamily:"'Baloo 2',sans-serif", fontSize:40, fontWeight:800, lineHeight:1.1, margin:0 }}>
                <span style={{ color:BRAND.green }}>SMART</span><br /><span style={{ color:BRAND.orange }}>SCHEDULER</span>
              </h1>
              <div style={{ width:64, height:4, borderRadius:2, background:BRAND.orange, margin:'14px 0' }} />
              <p style={{ fontSize:16, color:BRAND.text, marginBottom:24 }}>Smart staff. Perfect events.</p>
              <h2 style={{ fontSize:22, fontWeight:800, color:BRAND.text, marginBottom:8 }}>Smarter scheduling, <span style={{ color:BRAND.orange }}>better service</span></h2>
              <p style={{ color:BRAND.textMuted, marginBottom:28, lineHeight:1.6 }}>Assign the right people, at the right time, for every event that matters.</p>
              <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
                {[
                  { icon: Users, bg: BRAND.badgeGreen, color: BRAND.greenSoft, title:'Manage your team', desc:'Add, organize and track your staff easily.' },
                  { icon: Calendar, bg: BRAND.badgePeach, color: BRAND.orangeDark, title:'Schedule smarter', desc:'Match staff skills and availability to every event.' },
                  { icon: Target, bg: BRAND.badgeYellow, color:'#8a6d1f', title:'Smart match', desc:'Let the algorithm rank the best staff for each event.' },
                  { icon: BarChart3, bg: BRAND.badgeGreen, color: BRAND.greenSoft, title:'Real-time reports', desc:'Live updates, analytics and performance insights.' },
                ].map(({ icon:Icon, bg, color, title, desc }) => (
                  <div key={title} style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                    <div style={{ width:44, height:44, borderRadius:12, background:bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <Icon style={{ width:20, height:20, color }} />
                    </div>
                    <div>
                      <p style={{ fontWeight:700, color:BRAND.text, margin:0, fontSize:14 }}>{title}</p>
                      <p style={{ fontSize:13, color:BRAND.textMuted, margin:'2px 0 0' }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card-boot fade-up-2" style={{ width:'100%', maxWidth:420, margin:'0 auto', background:'#fff', borderRadius:28, boxShadow:'0 20px 50px rgba(45,42,38,0.12)', padding:36 }}>
              <div style={{ display:'flex', background:BRAND.creamSoft, borderRadius:12, padding:4, marginBottom:24 }}>
                <span style={{ flex:1, padding:'9px', borderRadius:9, textAlign:'center', fontSize:13, fontWeight:700, background:'#fff', color:BRAND.green, boxShadow:'0 2px 6px rgba(45,42,38,0.08)' }}>Sign In</span>
                <Link to="/register" style={{ flex:1, padding:'9px', borderRadius:9, textAlign:'center', fontSize:13, fontWeight:700, color:BRAND.textMuted, textDecoration:'none' }}>Create Account</Link>
              </div>

              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', marginBottom:20 }}>
                <div style={{ width:64, height:64, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16, background:BRAND.creamSoft }}>
                  <ChefHat style={{ width:28, height:28, color:BRAND.orange }} />
                </div>
                <h2 style={{ fontFamily:"'Baloo 2',sans-serif", fontSize:24, fontWeight:800, color:BRAND.green, margin:0 }}>Welcome back!</h2>
                <p style={{ color:BRAND.textMuted, fontSize:13, marginTop:6 }}>Sign in to your Smart Scheduler account</p>
              </div>

              <label style={{ display:'block', fontSize:13, fontWeight:700, color:BRAND.text, marginBottom:6 }}>Email or username</label>
              <div style={{ position:'relative', marginBottom:16 }}>
                <Users style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', width:16, height:16, color:BRAND.orange }} />
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={handleKeyDown} placeholder="Enter your email or username"
                  className="warm-input" style={{ width:'100%', padding:'12px 12px 12px 40px', borderRadius:12, border:'1px solid #e7ddc9', fontSize:14, outline:'none' }} />
              </div>

              <label style={{ display:'block', fontSize:13, fontWeight:700, color:BRAND.text, marginBottom:6 }}>Password</label>
              <div style={{ position:'relative', marginBottom:10 }}>
                <Settings style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', width:16, height:16, color:BRAND.orange }} />
                <input type={showPassword?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={handleKeyDown} placeholder="Enter your password"
                  className="warm-input" style={{ width:'100%', padding:'12px 40px 12px 40px', borderRadius:12, border:'1px solid #e7ddc9', fontSize:14, outline:'none' }} />
                <button type="button" onClick={()=>setShowPassword(v=>!v)} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:BRAND.textMuted }} aria-label={showPassword?'Hide password':'Show password'}>
                  <Eye style={{ width:16, height:16 }} />
                </button>
              </div>

              {signupSuccess && (
                <div style={{ display:'flex', alignItems:'center', gap:8, background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:10, padding:'8px 12px', marginBottom:12 }}>
                  <CheckCircle style={{ width:14, height:14, color:'#16a34a', flexShrink:0 }} />
                  <span style={{ color:'#15803d', fontSize:12 }}>{signupSuccess}</span>
                </div>
              )}

              {error && (
                <div style={{ display:'flex', alignItems:'center', gap:8, background:'#fef2f2', border:'1px solid #fecaca', borderRadius:10, padding:'8px 12px', marginBottom:12 }}>
                  <AlertCircle style={{ width:14, height:14, color:'#dc2626', flexShrink:0 }} />
                  <span style={{ color:'#dc2626', fontSize:12 }}>{error}</span>
                </div>
              )}

              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20, fontSize:13 }}>
                <label style={{ display:'flex', alignItems:'center', gap:8, color:BRAND.text, cursor:'pointer' }}>
                  <input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)} />
                  Remember me
                </label>
                <span style={{ color:BRAND.orange, fontWeight:600, cursor:'pointer' }}>Forgot password?</span>
              </div>

              <button onClick={handleLogin} disabled={loading || lockRemaining>0} className="warm-btn" style={{ width:'100%', padding:13, borderRadius:12, border:'none', color:'#fff', fontWeight:700, fontSize:14, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, background:`linear-gradient(90deg, ${BRAND.orange}, ${BRAND.orangeDark})` }}>
                {lockRemaining>0 ? `Locked — try again in ${lockRemaining}s` : loading ? (
                  <span style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <svg style={{ width:16, height:16, animation:'spin 1s linear infinite' }} fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="30 70" />
                    </svg>Signing in…
                  </span>
                ) : (<>Sign in <ArrowRight style={{ width:16, height:16 }} /></>)}
              </button>

              <p style={{ textAlign:'center', fontSize:13, color:BRAND.textMuted, marginTop:22 }}>
                Don't have an account? <Link to="/register" style={{ color:BRAND.orange, fontWeight:700, cursor:'pointer', textDecoration:'none' }}>Create one</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
