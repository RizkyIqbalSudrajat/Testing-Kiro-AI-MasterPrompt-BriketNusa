import React from 'react';
import { StatusSetoran, StatusPesanan } from '../types';

interface StatusBadgeProps {
  status: StatusSetoran | StatusPesanan;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  let colorClass = 'text-stone-600 bg-stone-100 border-stone-200';
  let dotClass = 'bg-stone-400';

  if (status === 'Diverifikasi' || status === 'Selesai') {
    colorClass = 'text-emerald-800 bg-emerald-50 border-emerald-200';
    dotClass = 'bg-emerald-600';
  } else if (status === 'Menunggu' || status === 'Diproses') {
    colorClass = 'text-amber-800 bg-amber-50 border-amber-200';
    dotClass = 'bg-amber-500 animate-pulse';
  } else if (status === 'Dikirim') {
    colorClass = 'text-blue-800 bg-blue-50 border-blue-200';
    dotClass = 'bg-blue-600';
  } else if (status === 'Ditolak') {
    colorClass = 'text-rose-800 bg-rose-50 border-rose-200';
    dotClass = 'bg-rose-600';
  }

  const paddingClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded border ${colorClass} ${paddingClass} whitespace-nowrap`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} aria-hidden="true" />
      <span>{status}</span>
    </span>
  );
};
