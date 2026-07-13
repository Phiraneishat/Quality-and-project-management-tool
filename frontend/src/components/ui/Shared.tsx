import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';

export const ThemeSwitcher: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { isDark, toggle } = useThemeStore();

  return (
    <button
      onClick={toggle}
      className={`
        relative p-2 rounded-xl
        bg-slate-100 dark:bg-slate-800
        hover:bg-slate-200 dark:hover:bg-slate-700
        text-slate-500 dark:text-slate-400
        transition-all duration-200 cursor-pointer
        ${className}
      `}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-amber-400" />
      ) : (
        <Moon className="h-5 w-5 text-primary-500" />
      )}
    </button>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  icon?: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  icon,
  className = '',
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <span className="absolute left-3.5 text-slate-400 pointer-events-none">{icon}</span>
        )}
        <select
          className={`
            w-full rounded-xl border bg-white dark:bg-surface-900
            text-sm text-slate-900 dark:text-white
            outline-none transition-all duration-200
            focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500
            ${icon ? 'pl-11 pr-4' : 'px-4'}
            py-2.5 appearance-none
            ${error
              ? 'border-red-400 dark:border-red-500/50'
              : 'border-slate-200 dark:border-slate-700/80'
            }
            ${className}
          `}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <p className="text-[11px] text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
};

export const ProgressBar: React.FC<{
  value: number;
  max?: number;
  color?: string;
  size?: 'sm' | 'md';
  showLabel?: boolean;
  className?: string;
}> = ({ value, max = 100, color = 'bg-primary-500', size = 'sm', showLabel = true, className = '' }) => {
  const percent = Math.min(Math.round((value / max) * 100), 100);
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`flex-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden ${size === 'sm' ? 'h-1.5' : 'h-2.5'}`}>
        <div
          className={`h-full rounded-full ${color} transition-all duration-700 ease-out`}
          style={{ width: `${percent}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-[10px] font-bold text-slate-500 min-w-[32px] text-right">{percent}%</span>
      )}
    </div>
  );
};

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    className={`bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 rounded-lg animate-shimmer bg-[length:400%_100%] ${className}`}
  />
);

export const EmptyState: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}> = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="h-14 w-14 rounded-2xl bg-primary-50 dark:bg-primary-950/40 text-primary-500 flex items-center justify-center mb-4">
      {icon}
    </div>
    <h4 className="text-base font-bold text-slate-900 dark:text-white font-display">{title}</h4>
    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 max-w-xs leading-relaxed">{description}</p>
    {action && <div className="mt-5">{action}</div>}
  </div>
);

export const Divider: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`border-t border-slate-100 dark:border-slate-800 ${className}`} />
);
