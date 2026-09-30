import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useToast } from './ui/Toast';
import { UserRole } from '../types';
import { RotateCcw, ChevronDown, ChevronUp, UserCheck, ExternalLink, ShieldCheck } from 'lucide-react';
import { Button } from './ui/Button';

export const DemoSwitcher: React.FC = () => {
  const { currentUser, switchRoleQuick, logout } = useAuth();
  const { resetAllDemoData } = useData();
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSwitch = (role: UserRole) => {
    switchRoleQuick(role);
    const dest = role === 'supplier' ? '/supplier' : role === 'pembeli' ? '/pembeli' : '/admin';
    navigate(dest);
    toast.info(`Beralih ke akun demo: ${role.toUpperCase()}`, 'Role Switch');
  };

  const handleReset = () => {
    if (window.confirm('Reset semua data setoran dan pesanan ke kondisi awal demo (8 setoran & 8 pesanan)?')) {
      resetAllDemoData();
      toast.success('Data demo berhasil direset ke 8 setoran & 8 pesanan awal.', 'Reset Selesai');
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      <div className="rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white/80 dark:bg-stone-900/85 backdrop-blur-xl shadow-xl overflow-hidden text-xs max-w-sm transition-all duration-200">
        {/* Toggle Bar */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between gap-3 px-3.5 py-2.5 hover:bg-stone-100/60 dark:hover:bg-stone-800/60 transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F97316] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F97316]" />
            </span>
            <span className="font-bold text-stone-900 dark:text-stone-100">Demo Navigator</span>
            {currentUser && (
              <span className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                ({currentUser.role}: {currentUser.nama.split(' ')[0]})
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-stone-400 dark:text-stone-500">
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </div>
        </button>

        {/* Expanded Panel */}
        {isExpanded && (
          <div className="p-3.5 border-t border-stone-200/70 dark:border-stone-800/80 space-y-3 bg-stone-50/50 dark:bg-stone-950/40">
            <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
              <span>Beralih peran secara instan:</span>
              <span className="font-mono text-[10px]">Step 2 Auth</span>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => handleSwitch('supplier')}
                className={`px-2 py-1.5 rounded-xl font-semibold text-center transition-all cursor-pointer ${
                  currentUser?.role === 'supplier' && location.pathname === '/supplier'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-stone-200/70 dark:bg-stone-800 hover:bg-stone-300/70 text-stone-800 dark:text-stone-200'
                }`}
              >
                🌾 Supplier
              </button>
              <button
                onClick={() => handleSwitch('pembeli')}
                className={`px-2 py-1.5 rounded-xl font-semibold text-center transition-all cursor-pointer ${
                  currentUser?.role === 'pembeli' && location.pathname === '/pembeli'
                    ? 'bg-[#F97316] text-white shadow-sm'
                    : 'bg-stone-200/70 dark:bg-stone-800 hover:bg-stone-300/70 text-stone-800 dark:text-stone-200'
                }`}
              >
                🛒 Pembeli
              </button>
              <button
                onClick={() => handleSwitch('admin')}
                className={`px-2 py-1.5 rounded-xl font-semibold text-center transition-all cursor-pointer ${
                  currentUser?.role === 'admin' && location.pathname === '/admin'
                    ? 'bg-[#6B4423] text-white shadow-sm'
                    : 'bg-stone-200/70 dark:bg-stone-800 hover:bg-stone-300/70 text-stone-800 dark:text-stone-200'
                }`}
              >
                🏭 Admin
              </button>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-stone-200/70 dark:border-stone-800/80 text-[11px]">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-1 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors cursor-pointer"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Showcase (/)</span>
              </button>

              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 font-semibold text-[#F97316] hover:text-[#EA580C] transition-colors cursor-pointer"
                title="Kembalikan data mock ke 8 setoran & 8 pesanan awal"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Data Demo</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
