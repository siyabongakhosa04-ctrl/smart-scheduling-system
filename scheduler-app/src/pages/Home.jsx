import { useNavigate } from 'react-router-dom';
import { Zap, Calendar, BarChart3, Users, Shield, Activity, ChefHat } from 'lucide-react';
import { BRAND, HERO_IMAGE } from '../utils/constants';

const Home = () => {
  const navigate = useNavigate();
  const onGetStarted = () => navigate("/login");
  const features = [
    { icon: Zap, title: 'Smart Matching', desc: 'Staff-to-event matching scored on skills, availability, and workload.', bg: BRAND.badgeGreen, color: BRAND.greenSoft },
    { icon: Calendar, title: 'Event Management', desc: 'Create, track and manage every event with full budget and staffing oversight.', bg: BRAND.badgePeach, color: BRAND.orangeDark },
    { icon: BarChart3, title: 'Real-Time Analytics', desc: 'System-wide dashboards showing budget utilization, fill rates, and trends.', bg: BRAND.badgeYellow, color: '#8a6d1f' },
    { icon: Users, title: 'Staff Scheduling', desc: 'Full staff profiles, availability tracking, skills, and conflict detection.', bg: BRAND.badgeGreen, color: BRAND.greenSoft },
    { icon: Shield, title: 'Role-Based Access', desc: 'Admin and Manager roles with scoped views, audit trails, and access controls.', bg: BRAND.badgePeach, color: BRAND.orangeDark },
    { icon: Activity, title: 'Audit Logging', desc: 'Every action tracked with timestamps — assignments, edits, deletions, logins.', bg: BRAND.badgeYellow, color: '#8a6d1f' },
  ];
  const stats = [
    { value: '500+', label: 'Events Managed' }, { value: '10K+', label: 'Staff Hours Tracked' },
    { value: '98%', label: 'Fill Rate Achieved' }, { value: '3x', label: 'Faster Scheduling' },
  ];
  const steps = [
    { n: '01', title: 'Add Your Events', desc: 'Create events with dates, locations, budgets, and required skills.' },
    { n: '02', title: 'Build Your Team', desc: 'Add staff with their skills, seniority, and availability.' },
    { n: '03', title: 'Smart Match', desc: 'Let the algorithm rank the best staff for each event.' },
    { n: '04', title: 'Track Everything', desc: 'Monitor budgets, fill rates, and activity in real time.' },
  ];

  return (
    <div style={{ fontFamily:"'Inter',sans-serif", background:'#fff' }}>
      <nav style={{ position:'sticky', top:0, zIndex:100, background:'rgba(255,255,255,0.95)', backdropFilter:'blur(10px)', borderBottom:'1px solid #f1e6d3', padding:'0 32px', display:'flex', alignItems:'center', height:64 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:36, height:36, background:`linear-gradient(135deg, ${BRAND.orange}, ${BRAND.orangeDark})`, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <ChefHat style={{ width:18, height:18, color:'#fff' }} />
          </div>
          <span style={{ fontWeight:800, fontSize:18, color:BRAND.green }}>Smart Scheduler</span>
        </div>
        <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:24 }}>
          {['Features','How it Works','Stats'].map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/ /g,'-')}`} className="landing-nav-link" style={{ fontSize:14, fontWeight:500, color:BRAND.textMuted, textDecoration:'none' }}>{l}</a>
          ))}
          <button onClick={onGetStarted} className="warm-btn" style={{ background:`linear-gradient(135deg, ${BRAND.orange}, ${BRAND.orangeDark})`, color:'#fff', border:'none', borderRadius:10, padding:'9px 22px', fontWeight:700, fontSize:14, cursor:'pointer' }}>
            Sign In →
          </button>
        </div>
      </nav>

      <section className="aura-bg" style={{ overflow:'hidden' }}>
        <div className="aura-layer-1" />
        <div className="aura-layer-2" />
        <div className="hero-grid aura-content" style={{ display:'grid', gridTemplateColumns:'1fr', alignItems:'stretch' }}>
          <div style={{ display:'flex', flexDirection:'column', justifyContent:'center', padding:'72px 24px 48px', position:'relative', zIndex:10 }}>
            <div className="fade-up-1" style={{ display:'inline-flex', alignItems:'center', gap:8, background:'#fff', border:`1px solid ${BRAND.badgePeach}`, borderRadius:100, padding:'6px 16px', marginBottom:28, width:'fit-content' }}>
              <ChefHat style={{ width:14, height:14, color:BRAND.orange }} />
              <span style={{ fontSize:12, color:BRAND.orangeDark, fontWeight:700, letterSpacing:'0.05em' }}>SMART STAFF. PERFECT EVENTS.</span>
            </div>
            <h1 className="fade-up-1" style={{ fontFamily:"'Baloo 2',sans-serif", fontSize:'clamp(36px,6vw,64px)', fontWeight:800, lineHeight:1.1, marginBottom:24 }}>
              <span style={{ color:BRAND.green }}>SMART</span><br /><span style={{ color:BRAND.orange }}>SCHEDULER</span>
            </h1>
            <p className="fade-up-2" style={{ fontSize:18, color:BRAND.textMuted, lineHeight:1.7, marginBottom:40, maxWidth:480 }}>
              Smart staff-to-event matching, real-time analytics, role-based access, and complete audit trails — all in one system.
            </p>
            <div className="fade-up-3" style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
              <button onClick={onGetStarted} className="warm-btn" style={{ width:'auto', padding:'14px 36px', fontSize:14, borderRadius:12, border:'none', color:'#fff', fontWeight:700, cursor:'pointer', background:`linear-gradient(90deg, ${BRAND.orange}, ${BRAND.orangeDark})` }}>Get started free</button>
              <a href="#features" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'14px 28px', border:`1px solid ${BRAND.badgePeach}`, borderRadius:12, color:BRAND.green, fontSize:14, fontWeight:600, textDecoration:'none', background:'#fff' }}>Explore features ↓</a>
            </div>
            <div className="fade-up-3" style={{ display:'flex', gap:16, flexWrap:'wrap', marginTop:56 }}>
              {[{ label:'Active Events', value:'12', color:BRAND.orange },{ label:'Staff Fill Rate', value:'94%', color:BRAND.greenSoft },{ label:'Open Positions', value:'48', color:'#8a6d1f' }].map(({ label, value, color }) => (
                <div key={label} style={{ background:'#fff', borderRadius:16, padding:'16px 28px', textAlign:'center', minWidth:120, boxShadow:'0 8px 24px rgba(45,42,38,0.06)' }}>
                  <p style={{ fontSize:28, fontWeight:800, color, fontFamily:"'Baloo 2',sans-serif" }}>{value}</p>
                  <p style={{ fontSize:11, color:BRAND.textMuted, marginTop:4 }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
          <div style={{ position:'relative', minHeight:320 }}>
            <img
              src={HERO_IMAGE}
              alt="Catering staff setting up a buffet with chafing dishes and florals"
              style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }}
              onError={(e)=>{ e.currentTarget.style.display='none'; }}
            />
            <div style={{ position:'absolute', inset:0, background:`linear-gradient(90deg, ${BRAND.cream} 0%, rgba(253,241,224,0) 22%)` }} />
            <div style={{ position:'absolute', inset:0, background:`linear-gradient(0deg, ${BRAND.cream} 0%, rgba(253,241,224,0) 16%)` }} className="hero-image-bottom-fade" />
          </div>
        </div>
      </section>

      <section id="stats" style={{ background:BRAND.green, padding:'48px 24px' }}>
        <div style={{ maxWidth:900, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:32, textAlign:'center' }}>
          {stats.map(({ value, label }) => (
            <div key={label}>
              <p style={{ fontSize:42, fontWeight:800, color:BRAND.orange, fontFamily:"'Baloo 2',sans-serif" }}>{value}</p>
              <p style={{ fontSize:13, color:'rgba(255,255,255,0.75)', marginTop:6, letterSpacing:'0.05em' }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="features" style={{ background:BRAND.cream, padding:'96px 24px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:60 }}>
            <span style={{ fontSize:12, fontWeight:700, color:BRAND.orange, letterSpacing:'0.15em', textTransform:'uppercase' }}>Features</span>
            <h2 style={{ fontFamily:"'Baloo 2',sans-serif", fontSize:'clamp(28px,4vw,44px)', fontWeight:800, color:BRAND.green, marginTop:12, lineHeight:1.2 }}>Everything you need to<br />run smarter events</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:24 }}>
            {features.map(({ icon: Icon, title, desc, bg, color }) => (
              <div key={title} className="feature-card" style={{ background:'#fff', borderRadius:20, padding:32, border:'1px solid #f1e6d3' }}>
                <div style={{ width:52, height:52, borderRadius:14, background:bg, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:20 }}>
                  <Icon style={{ width:24, height:24, color }} />
                </div>
                <h3 style={{ fontSize:18, fontWeight:700, color:BRAND.text, marginBottom:10 }}>{title}</h3>
                <p style={{ fontSize:14, color:BRAND.textMuted, lineHeight:1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" style={{ background:'#fff', padding:'96px 24px' }}>
        <div style={{ maxWidth:900, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:60 }}>
            <span style={{ fontSize:12, fontWeight:700, color:BRAND.orange, letterSpacing:'0.15em', textTransform:'uppercase' }}>How it works</span>
            <h2 style={{ fontFamily:"'Baloo 2',sans-serif", fontSize:'clamp(28px,4vw,44px)', fontWeight:800, color:BRAND.green, marginTop:12 }}>Up and running in minutes</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))', gap:32 }}>
            {steps.map(({ n, title, desc }) => (
              <div key={n} style={{ textAlign:'center' }}>
                <div style={{ width:56, height:56, borderRadius:'50%', background:`linear-gradient(135deg, ${BRAND.orange}, ${BRAND.orangeDark})`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
                  <span style={{ fontFamily:"'Baloo 2',sans-serif", fontSize:15, fontWeight:700, color:'#fff' }}>{n}</span>
                </div>
                <h3 style={{ fontSize:16, fontWeight:700, color:BRAND.text, marginBottom:8 }}>{title}</h3>
                <p style={{ fontSize:13, color:BRAND.textMuted, lineHeight:1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="aura-bg" style={{ padding:'80px 24px', textAlign:'center' }}>
        <div className="aura-layer-1" />
        <div className="aura-layer-2" />
        <div className="aura-content">
          <h2 style={{ fontFamily:"'Baloo 2',sans-serif", fontSize:'clamp(24px,4vw,42px)', fontWeight:800, color:BRAND.green, marginBottom:16 }}>Ready to get started?</h2>
          <p style={{ color:BRAND.textMuted, fontSize:16, marginBottom:36 }}>Create an account and start scheduling smarter today.</p>
          <button onClick={onGetStarted} className="warm-btn" style={{ width:'auto', padding:'16px 48px', fontSize:14, borderRadius:12, border:'none', color:'#fff', fontWeight:700, cursor:'pointer', background:`linear-gradient(90deg, ${BRAND.orange}, ${BRAND.orangeDark})` }}>Launch system</button>
        </div>
      </section>

      <footer style={{ background:BRAND.green, padding:'40px 24px', textAlign:'center' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, marginBottom:16 }}>
          <div style={{ width:32, height:32, background:`linear-gradient(135deg, ${BRAND.orange}, ${BRAND.orangeDark})`, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <ChefHat style={{ width:16, height:16, color:'#fff' }} />
          </div>
          <span style={{ fontWeight:700, fontSize:16, color:'#fff' }}>Smart Scheduler</span>
        </div>
        <p style={{ color:'rgba(255,255,255,0.55)', fontSize:13 }}>© 2026 Smart Scheduler. Built with React + Tailwind.</p>
      </footer>
    </div>
  );
};


export default Home;
