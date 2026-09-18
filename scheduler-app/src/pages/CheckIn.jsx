import { useState } from 'react';
import { QrCode, CheckCircle, ScanLine } from 'lucide-react';
import { BRAND } from '../utils/constants';
import { formatDate } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import { useScheduling } from '../context/ScheduleContext';
import { QRScannerModal } from '../components/QRCode';

const CheckIn = () => {
  const { currentUser } = useAuth();
  const { events, assignments, checkIns, checkInStaff } = useScheduling();
  const [scanEvent, setScanEvent] = useState(null);
  const myEvents = assignments.filter(a=>a.staffId===currentUser.staffId).map(a=>events.find(e=>e.id===a.eventId)).filter(Boolean).filter(e=>e.status!=='completed');
  const checkedInIds = new Set(checkIns.filter(c=>c.staffId===currentUser.staffId).map(c=>c.eventId));

  const handleScan = (raw) => {
    const parts = String(raw).split(':');
    const code = parts[parts.length-1];
    checkInStaff(currentUser.staffId, scanEvent.id, code);
    setScanEvent(null);
  };

  return (
    <div className="space-y-6">
      <div><h2 className="text-3xl font-display font-bold" style={{ color:BRAND.green }}>QR Check-In</h2><p className="text-stone-500 text-sm mt-0.5">Scan the QR code at the venue, or enter the code shown by your manager.</p></div>
      {myEvents.length===0 ? (
        <div className="bg-white rounded-xl p-10 border border-stone-200 text-center"><QrCode className="w-8 h-8 text-stone-300 mx-auto mb-2" /><p className="text-stone-400 text-sm">No upcoming assigned events to check in to.</p></div>
      ) : (
        <div className="space-y-3">{myEvents.map(ev => {
          const done = checkedInIds.has(ev.id);
          return (
            <div key={ev.id} className="bg-white rounded-xl p-4 border border-stone-200 shadow-sm flex items-center justify-between gap-4">
              <div className="min-w-0"><p className="font-semibold text-stone-900">{ev.name}</p><p className="text-xs text-stone-500 mt-0.5">{formatDate(ev.date)} · {ev.time} · {ev.location}</p></div>
              {done ? (
                <span className="text-xs font-bold text-green-700 bg-green-100 px-3 py-1.5 rounded-full flex items-center gap-1 shrink-0"><CheckCircle className="w-3.5 h-3.5" />Checked in</span>
              ) : (
                <button onClick={()=>setScanEvent(ev)} className="text-xs font-bold text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 shrink-0" style={{ background:BRAND.orange }}><ScanLine className="w-3.5 h-3.5" />Check in</button>
              )}
            </div>
          );
        })}</div>
      )}
      {scanEvent && <QRScannerModal expectedLabel={`Checking in to: ${scanEvent.name}`} onScan={handleScan} onClose={()=>setScanEvent(null)} />}
    </div>
  );
};


export default CheckIn;
