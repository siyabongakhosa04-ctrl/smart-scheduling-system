import { X, AlertCircle, CheckCircle } from 'lucide-react';
import { useScheduling } from '../context/ScheduleContext';
import { BRAND } from '../utils/constants';

const ToastContainer = () => {
  const { toasts, dismissToast } = useScheduling();
  if (!toasts.length) return null;
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-xs sm:max-w-sm">
      {toasts.map(t => (
        <div key={t.id} className={`toast-in flex items-start gap-2 rounded-xl shadow-lg px-4 py-3 text-sm font-medium border ${t.type==='error' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-white border-stone-200 text-stone-800'}`}>
          {t.type==='error' ? <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-500" /> : <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" style={{ color:BRAND.orange }} />}
          <span className="flex-1">{t.message}</span>
          <button onClick={()=>dismissToast(t.id)} className="text-stone-400 hover:text-stone-600 shrink-0"><X className="w-3.5 h-3.5" /></button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
