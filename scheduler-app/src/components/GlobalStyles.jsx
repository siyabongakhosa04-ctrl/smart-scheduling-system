import { BRAND } from '../utils/constants';

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Inter:wght@400;500;600;700;800&display=swap');
    *, *::before, *::after { box-sizing: border-box; }
    body { background-color: #faf8f2; }
    @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
    .fade-up-1 { animation: fadeUp 0.6s 0.1s both ease-out; }
    .fade-up-2 { animation: fadeUp 0.6s 0.3s both ease-out; }
    .fade-up-3 { animation: fadeUp 0.6s 0.5s both ease-out; }
    @keyframes cardBoot { 0% { opacity:0; transform:translateY(16px); } 100% { opacity:1; transform:translateY(0); } }
    .card-boot { animation: cardBoot 0.5s ease-out both; }
    @keyframes leafDrift { 0%,100% { transform:translateY(0) rotate(0deg); } 50% { transform:translateY(-10px) rotate(3deg); } }
    .leaf-drift { animation: leafDrift 5s ease-in-out infinite; }
    .feature-card { transition: all 0.25s ease; }
    .feature-card:hover { transform: translateY(-4px); box-shadow: 0 16px 32px rgba(30,58,30,0.08); }
    .landing-nav-link { transition: color 0.2s; }
    .landing-nav-link:hover { color: ${BRAND.orange}; }
    .warm-input { transition: all 0.2s ease; }
    .warm-input:focus { border-color: ${BRAND.orange} !important; box-shadow: 0 0 0 3px rgba(240,129,46,0.15); }
    .warm-btn { transition: all 0.2s ease; }
    .warm-btn:hover { opacity: 0.92; transform: translateY(-1px); }
    .warm-btn:active { transform: translateY(0) scale(0.99); }
    .warm-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
    @keyframes bellShake { 0%,100% { transform:rotate(0); } 20% { transform:rotate(-15deg); } 40% { transform:rotate(15deg); } 60% { transform:rotate(-10deg); } 80% { transform:rotate(10deg); } }
    .bell-shake { animation: bellShake 0.6s ease; }
    .cal-day { transition:all 0.15s ease; }
    .cal-day:hover { background:${BRAND.creamSoft}; }
    .cal-day.today { background:${BRAND.badgePeach}; font-weight:700; }
    @keyframes spin { to { transform:rotate(360deg); } }
    @keyframes toastIn { from { opacity:0; transform:translateX(24px); } to { opacity:1; transform:translateX(0); } }
    .toast-in { animation: toastIn 0.28s ease-out both; }
    @keyframes modalPop { from { opacity:0; transform:scale(0.96) translateY(8px); } to { opacity:1; transform:scale(1) translateY(0); } }
    .modal-pop { animation: modalPop 0.2s ease-out both; }
    @keyframes listItemIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
    .list-item-in { animation: listItemIn 0.35s ease-out both; }
    @keyframes strengthFill { from { width:0%; } }
    .strength-fill { animation: strengthFill 0.3s ease-out; }

    /* Golden Hour - Aura */
    .aura-bg {
      position: relative;
      overflow: hidden;
      min-height: 100vh;
    }
    .aura-layer-1 {
      position: absolute;
      inset: 0;
      background: linear-gradient(rgba(0,0,0,0) 0%, rgba(255,183,77,0.12) 28%, rgb(255,255,255) 18%, rgb(255,138,61) 68%, rgb(183,77,0) 100%);
      mix-blend-mode: multiply;
      filter: blur(125px);
      transform: translateZ(0);
      will-change: transform;
      pointer-events: none;
    }
    .aura-layer-2 {
      position: absolute;
      inset: 0;
      background: linear-gradient(rgba(0,0,0,0) 0%, rgba(255,183,77,0.22) 34%, rgb(255,255,255) 66%, rgb(255,138,61) 82%, rgb(183,77,0) 100%);
      mix-blend-mode: multiply;
      filter: blur(128px);
      transform: translateZ(0);
      will-change: transform;
      pointer-events: none;
    }
    @media (min-width: 900px) {
      .aura-layer-1 { filter: blur(180px); }
      .aura-layer-2 { filter: blur(184px); }
    }
    .aura-content { position: relative; z-index: 1; }

    @media (min-width: 900px) {
      .login-grid { grid-template-columns: 1fr 1fr !important; }
      .login-left { display: block !important; }
      .hero-grid { grid-template-columns: 1.05fr 0.95fr !important; min-height: 88vh; }
    }
  `}</style>
);

export default GlobalStyles;
