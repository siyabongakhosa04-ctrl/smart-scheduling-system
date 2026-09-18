export const formatDate = (d) => {
  try { return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }); }
  catch { return d; }
};

export const genCheckInCode = () =>
  Array.from({ length: 6 }, () => '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'[Math.floor(Math.random() * 32)]).join('');

// Smart Match scoring: weighs skill overlap, remaining availability,
// workload balance, and rating into a single 0-100 score per staff/event pair.
export const algo = {
  skillMatch: (staffSkills, required) => { if (!required.length) return 100; return (required.filter(s => staffSkills.includes(s)).length / required.length) * 100; },
  availabilityScore: (avail, booked) => { const rem = avail - booked; if (rem <= 0) return 0; const u = booked/avail; if (u >= 0.95) return 20; if (u >= 0.85) return 55; return 100; },
  workloadBalance: (booked, avail) => { const gap = Math.abs((booked/avail) - 0.8); if (gap < 0.1) return 100; if (gap < 0.2) return 80; if (gap < 0.35) return 60; return 40; },
  totalScore: (staff, event) => { const skill = algo.skillMatch(staff.skills, event.requiredSkills); const avail = algo.availabilityScore(staff.hoursAvailable, staff.hoursBooked); const wl = algo.workloadBalance(staff.hoursBooked, staff.hoursAvailable); const rating = Math.min(100, (staff.rating/5)*105); return Math.round(skill*0.35 + avail*0.25 + wl*0.2 + rating*0.2); },
  breakdown: (staff, event) => ({ skillMatch: Math.round(algo.skillMatch(staff.skills, event.requiredSkills)), availability: Math.round(algo.availabilityScore(staff.hoursAvailable, staff.hoursBooked)), workloadBalance: Math.round(algo.workloadBalance(staff.hoursBooked, staff.hoursAvailable)) }),
};
