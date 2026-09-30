import React from 'react';

export type BadgeStatus =
  | 'Menunggu'
  | 'Diverifikasi'
  | 'Diproses'
  | 'Dikirim'
  | 'Selesai'
  | 'Ditolak'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'neutral'
  | 'accent';

export interface BadgeProps {
  children?: React.ReactNode;
  status?: BadgeStatus;
  size?: 'sm' | 'md' | 'lg';
  withDot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  status = 'neutral',
  size = 'md',
  withDot = true,
  className = '',
}) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'Diverifikasi':
      case 'Selesai':
      case 'success':
        return {
          bg: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
          dot: 'bg-emerald-500',
          pulse: false,
          label: children || (status === 'success' ? 'Berhasil' : status),
        };
      case 'Menunggu':
      case 'Diproses':
      case 'warning':
        return {
          bg: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
          dot: 'bg-amber-500',
          pulse: true,
          label: children || (status === 'warning' ? 'Perhatian' : status),
        };
      case 'Dikirim':
      case 'info':
        return {
          bg: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
          dot: 'bg-blue-500',
          pulse: false,
          label: children || (status === 'info' ? 'Informasi' : status),
        };
      case 'Ditolak':
      case 'error':
        return {
          bg: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20',
          dot: 'bg-rose-500',
          pulse: false,
          label: children || (status === 'error' ? 'Gagal' : status),
        };
      case 'accent':
        return {
          bg: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20',
          dot: 'bg-orange-500',
          pulse: true,
          label: children || 'Bara Api',
        };
      default:
        return {
          bg: 'bg-stone-500/10 text-stone-700 dark:text-stone-300 border-stone-500/20',
          dot: 'bg-stone-400',
          pulse: false,
          label: children || 'Status',
        };
    }
  };

  const current = getStatusStyles();

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 rounded-lg gap-1.5',
    md: 'text-xs px-2.5 py-1 rounded-xl gap-2 font-medium',
    lg: 'text-sm px-3.5 py-1.5 rounded-xl gap-2.5 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center border whitespace-nowrap ${current.bg} ${sizeStyles[size]} ${className}`}
    >
      {withDot && (
        <span className="relative flex h-2 w-2">
          {current.pulse && (
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${current.dot}`}
            />
          )}
          <span className={`relative inline-flex rounded-full h-2 w-2 ${current.dot}`} />
        </span>
      )}
      <span>{current.label}</span>
    </span>
  );
};
