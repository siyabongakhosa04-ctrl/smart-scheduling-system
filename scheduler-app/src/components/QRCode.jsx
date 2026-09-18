import { useState, useRef, useEffect, useMemo } from 'react';
import QRCode from 'qrcode';
import jsQR from 'jsqr';
import { X, Camera, ScanLine } from 'lucide-react';
import { BRAND } from '../utils/constants';

export const QRCodeSVG = ({ value, size = 180 }) => {
  const qr = useMemo(() => { try { return QRCode.create(value, { errorCorrectionLevel:'M' }); } catch { return null; } }, [value]);
  if (!qr) return null;
  const n = qr.modules.size;
  const cell = size / n;
  const cells = [];
  for (let r=0; r<n; r++) for (let c=0; c<n; c++) if (qr.modules.get(c, r)) cells.push(`M${c*cell},${r*cell}h${cell}v${cell}h-${cell}z`);
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} style={{ background:'#fff' }}>
      <path d={cells.join(' ')} fill="#1a1a1a" />
    </svg>
  );
};

export const QRScannerModal = ({ onScan, onClose, expectedLabel }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(null);
  const [manualCode, setManualCode] = useState('');
  const [cameraError, setCameraError] = useState('');
  const [cameraOn, setCameraOn] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video:{ facingMode:'environment' } });
        if (cancelled) { stream.getTracks().forEach(t=>t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play(); }
        setCameraOn(true);
        tick();
      } catch (e) { setCameraError('Camera unavailable — enter the code manually below.'); }
    })();
    function tick() {
      const video = videoRef.current, canvas = canvasRef.current;
      if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth; canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imgData.data, imgData.width, imgData.height);
        if (code && code.data) { onScan(code.data); return; }
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    return () => { cancelled = true; if (rafRef.current) cancelAnimationFrame(rafRef.current); if (streamRef.current) streamRef.current.getTracks().forEach(t=>t.stop()); };
  }, [onScan]);

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="modal-pop bg-white rounded-2xl p-6 w-full max-w-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-stone-900 flex items-center gap-2"><ScanLine className="w-5 h-5" style={{ color:BRAND.orange }} />Scan to check in</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-stone-100 rounded-lg"><X className="w-4 h-4 text-stone-500" /></button>
        </div>
        {expectedLabel && <p className="text-xs text-stone-500 mb-3">{expectedLabel}</p>}
        <div className="relative rounded-xl overflow-hidden bg-stone-900 aspect-square mb-4">
          <video ref={videoRef} className="w-full h-full object-cover" muted playsInline />
          <canvas ref={canvasRef} className="hidden" />
          {cameraOn && <div className="absolute inset-6 border-2 rounded-xl pointer-events-none" style={{ borderColor:BRAND.orange }} />}
          {!cameraOn && !cameraError && <div className="absolute inset-0 flex items-center justify-center text-white text-xs"><Camera className="w-6 h-6 mr-2" />Starting camera…</div>}
        </div>
        {cameraError && <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-3">{cameraError}</p>}
        <div className="flex gap-2">
          <input value={manualCode} onChange={e=>setManualCode(e.target.value.toUpperCase())} placeholder="Or enter code manually" className="flex-1 px-3 py-2 rounded-lg border border-stone-200 text-sm outline-none focus:ring-2" style={{ '--tw-ring-color':BRAND.orange }} />
          <button onClick={()=>manualCode.trim() && onScan(manualCode.trim())} className="px-4 py-2 rounded-lg text-white text-sm font-semibold" style={{ background:BRAND.orange }}>Submit</button>
        </div>
      </div>
    </div>
  );
};
