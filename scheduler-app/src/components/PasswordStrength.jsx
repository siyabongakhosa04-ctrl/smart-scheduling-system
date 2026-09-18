import { CheckCircle } from 'lucide-react';
import { BRAND } from '../utils/constants';

export const PasswordRequirement = ({ met, label }) => (
  <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color: met ? '#16a34a' : BRAND.textMuted }}>
    {met ? <CheckCircle style={{ width:13, height:13 }} /> : <span style={{ width:13, height:13, borderRadius:'50%', border:`1.5px solid ${BRAND.textMuted}`, display:'inline-block' }} />}
    {label}
  </div>
);

export const PasswordStrengthMeter = ({ password, strength }) => {
  if (!password) return null;
  return (
    <div style={{ marginBottom:14 }}>
      <div style={{ height:5, background:'#eee2ca', borderRadius:3, overflow:'hidden', marginBottom:8 }}>
        <div className="strength-fill" style={{ height:'100%', width:`${strength.pct}%`, background:strength.color, borderRadius:3, transition:'width 0.25s ease, background 0.25s ease' }} />
      </div>
      <p style={{ fontSize:11, fontWeight:700, color:strength.color, marginBottom:8 }}>{strength.label}</p>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
        <PasswordRequirement met={strength.checks.length} label="8+ characters" />
        <PasswordRequirement met={strength.checks.upper} label="Uppercase letter" />
        <PasswordRequirement met={strength.checks.lower} label="Lowercase letter" />
        <PasswordRequirement met={strength.checks.number} label="Number" />
        <PasswordRequirement met={strength.checks.special} label="Special character" />
        <PasswordRequirement met={!strength.isCommon} label="Not a common password" />
      </div>
    </div>
  );
};
