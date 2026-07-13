import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  helperText,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <span className="absolute left-3.5 text-slate-400 dark:text-slate-500 pointer-events-none">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          className={`
            w-full rounded-xl border bg-white/50 dark:bg-surface-900/50
            text-sm text-slate-900 dark:text-white
            placeholder:text-slate-400 dark:placeholder:text-slate-600
            outline-none transition-all duration-200
            focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500
            disabled:opacity-50 disabled:cursor-not-allowed
            ${icon ? 'pl-11 pr-4' : 'px-4'}
            py-2.5
            ${error
              ? 'border-red-400 dark:border-red-500/50 focus:ring-red-500/20 focus:border-red-500'
              : 'border-slate-200 dark:border-slate-700/80'
            }
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-[11px] text-red-500 font-medium flex items-center gap-1">
          <span className="inline-block w-1 h-1 rounded-full bg-red-500" />
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="text-[11px] text-slate-400">{helperText}</p>
      )}
    </div>
  );
};

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider"
        >
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={`
          w-full rounded-xl border bg-white/50 dark:bg-surface-900/50
          text-sm text-slate-900 dark:text-white
          placeholder:text-slate-400 dark:placeholder:text-slate-600
          outline-none transition-all duration-200 resize-none
          focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500
          px-4 py-2.5 min-h-[100px]
          ${error
            ? 'border-red-400 dark:border-red-500/50'
            : 'border-slate-200 dark:border-slate-700/80'
          }
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-[11px] text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
};
