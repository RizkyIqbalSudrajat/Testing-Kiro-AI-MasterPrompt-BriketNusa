import React from 'react';
import { GlassCard } from './GlassCard';
import { Counter } from './Counter';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface StatCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  subtitle?: string;
  glowColor?: 'emerald' | 'orange' | 'coco' | 'blue';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  icon,
  trend,
  subtitle,
  glowColor = 'emerald',
  className = '',
}) => {
  const glowStyles = {
    emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    orange: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
    coco: 'bg-[#6B4423]/10 text-[#6B4423] dark:text-[#A87950] border-[#6B4423]/20',
    blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  };

  return (
    <GlassCard padding="md" className={`relative overflow-hidden ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
            {label}
          </span>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
            <Counter to={value} prefix={prefix} suffix={suffix} decimals={decimals} />
          </div>
        </div>

        <div
          className={`p-3 rounded-2xl border flex items-center justify-center shrink-0 ${glowStyles[glowColor]}`}
        >
          {icon}
        </div>
      </div>

      {(trend || subtitle) && (
        <div className="mt-4 pt-3 border-t border-stone-200/60 dark:border-stone-800/80 flex items-center justify-between text-xs">
          {trend && (
            <span
              className={`inline-flex items-center gap-1 font-medium ${
                trend.isPositive !== false
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {trend.isPositive !== false ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              <span>{trend.value}</span>
            </span>
          )}
          {subtitle && (
            <span className="text-stone-500 dark:text-stone-400 text-[11px] truncate">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </GlassCard>
  );
};
