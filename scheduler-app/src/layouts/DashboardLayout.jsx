import { useState, useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { Loader2, AlertTriangle } from 'lucide-react';
import { BRAND } from '../utils/constants';
import { useAuth } from '../context/AuthContext';
import { useScheduling } from '../context/ScheduleContext';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import ToastContainer from '../components/Toast';

const DashboardLayout = () => {
  const { currentUser } = useAuth();
  const { requests, addAudit, loading, loadError } = useScheduling();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pendingRequestCount = requests.filter(r => r.status === 'pending').length;
  const loggedRef = useRef(false);

  useEffect(() => {
    if (loading || loadError || loggedRef.current) return;
    loggedRef.current = true;
    addAudit('LOGIN', `${currentUser.name} (${currentUser.role}) signed in`, currentUser.name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, loadError]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center" style={{ background: BRAND.cream }}>
        <div className="flex flex-col items-center gap-3 text-stone-500">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: BRAND.orange }} />
          <p className="text-sm font-medium">Loading your data…</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex h-screen items-center justify-center p-6" style={{ background: BRAND.cream }}>
        <div className="max-w-md bg-white rounded-2xl border border-red-200 shadow-sm p-8 text-center">
          <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-stone-900 mb-2">Couldn't reach the server</h2>
          <p className="text-sm text-stone-500 mb-1">{loadError}</p>
          <p className="text-xs text-stone-400 mt-3">Make sure the backend is running (npm run dev in /backend) and MySQL is reachable.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: BRAND.cream }}>
      <ToastContainer />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} pendingCount={pendingRequestCount} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
