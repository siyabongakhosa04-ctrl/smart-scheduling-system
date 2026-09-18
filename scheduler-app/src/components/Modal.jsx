import { X } from 'lucide-react';

const Modal = ({ title, onClose, children, wide }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={e=>e.target===e.currentTarget&&onClose()}>
    <div className={`modal-pop bg-white rounded-2xl shadow-2xl w-full ${wide?'max-w-2xl':'max-w-lg'} max-h-[90vh] overflow-y-auto`}>
      <div className="flex items-center justify-between p-6 border-b border-stone-100">
        <h3 className="text-lg font-bold text-stone-900">{title}</h3>
        <button onClick={onClose} className="p-1.5 hover:bg-stone-100 rounded-lg transition"><X className="w-5 h-5" /></button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  </div>
);

export default Modal;
