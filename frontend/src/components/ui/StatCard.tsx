import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: { value: number; label: string };
  color?: 'indigo' | 'emerald' | 'rose' | 'amber' | 'violet' | 'blue' | 'teal' | 'purple';
  className?: string;
}

const colorMap = {
  indigo: {
    icon: 'bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400',
    value: 'text-primary-600 dark:text-primary-400',
    ring: 'ring-primary-500/10',
  },
  emerald: {
    icon: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400',
    value: 'text-emerald-600 dark:text-emerald-400',
    ring: 'ring-emerald-500/10',
  },
  rose: {
    icon: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400',
    value: 'text-rose-600 dark:text-rose-400',
    ring: 'ring-rose-500/10',
  },
  amber: {
    icon: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400',
    value: 'text-amber-600 dark:text-amber-400',
    ring: 'ring-amber-500/10',
  },
  violet: {
    icon: 'bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400',
    value: 'text-violet-600 dark:text-violet-400',
    ring: 'ring-violet-500/10',
  },
  blue: {
    icon: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400',
    value: 'text-blue-600 dark:text-blue-400',
    ring: 'ring-blue-500/10',
  },
  teal: {
    icon: 'bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400',
    value: 'text-teal-600 dark:text-teal-400',
    ring: 'ring-teal-500/10',
  },
  purple: {
    icon: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400',
    value: 'text-purple-600 dark:text-purple-400',
    ring: 'ring-purple-500/10',
  },
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  color = 'indigo',
  className = '',
}) => {
  const colors = colorMap[color];
  const trendDirection = trend
    ? trend.value > 0
      ? 'up'
      : trend.value < 0
      ? 'down'
      : 'flat'
    : null;

  return (
    <div
      className={`
        bg-white dark:bg-surface-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80
        p-5 shadow-sm hover:shadow-md transition-all duration-300
        ring-1 ${colors.ring}
        ${className}
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            {title}
          </span>
          <span className={`text-3xl font-black font-display ${colors.value}`}>
            {value}
          </span>
        </div>
        <div className={`p-2.5 rounded-xl ${colors.icon}`}>
          {icon}
        </div>
      </div>

      {trend && (
        <div className="mt-3 flex items-center gap-1.5">
          {trendDirection === 'up' && (
            <span className="flex items-center gap-0.5 text-emerald-500 text-xs font-bold">
              <TrendingUp className="h-3.5 w-3.5" />
              +{trend.value}%
            </span>
          )}
          {trendDirection === 'down' && (
            <span className="flex items-center gap-0.5 text-rose-500 text-xs font-bold">
              <TrendingDown className="h-3.5 w-3.5" />
              {trend.value}%
            </span>
          )}
          {trendDirection === 'flat' && (
            <span className="flex items-center gap-0.5 text-slate-400 text-xs font-bold">
              <Minus className="h-3.5 w-3.5" />
              0%
            </span>
          )}
          <span className="text-[10px] text-slate-400">{trend.label}</span>
        </div>
      )}
    </div>
  );
};
