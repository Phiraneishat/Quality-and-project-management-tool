import React from 'react';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'purple';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
  primary: 'bg-primary-50 text-primary-700 dark:bg-primary-950/40 dark:text-primary-300 border-primary-200 dark:border-primary-800',
  success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  warning: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  danger: 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 border-red-200 dark:border-red-800',
  info: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  purple: 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200 dark:border-purple-800',
};

const dotColors: Record<BadgeVariant, string> = {
  default: 'bg-slate-400',
  primary: 'bg-primary-500',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
  info: 'bg-blue-500',
  purple: 'bg-purple-500',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  dot = false,
  className = '',
}) => {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-semibold rounded-lg border
        ${size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'}
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]} animate-pulse`} />
      )}
      {children}
    </span>
  );
};

// Convenience components for common status badges
export const StatusBadge: React.FC<{ status: string; className?: string }> = ({ status, className }) => {
  const variantMap: Record<string, BadgeVariant> = {
    'Todo': 'default',
    'Planning': 'default',
    'In Progress': 'info',
    'Design': 'purple',
    'Development': 'info',
    'In Review': 'warning',
    'Testing': 'purple',
    'Review': 'warning',
    'Blocked': 'danger',
    'Completed': 'success',
    'Deployment': 'primary',
    'Archived': 'default',
    'Open': 'danger',
    'Assigned': 'info',
    'Ready for QA': 'warning',
    'Closed': 'success',
    'Reopened': 'danger',
    'Active': 'success',
    'Passed': 'success',
    'Failed': 'danger',
    'Not Executed': 'default',
  };
  return <Badge variant={variantMap[status] || 'default'} dot className={className}>{status}</Badge>;
};

export const PriorityBadge: React.FC<{ priority: string; className?: string }> = ({ priority, className }) => {
  const variantMap: Record<string, BadgeVariant> = {
    'Urgent': 'danger',
    'Critical': 'danger',
    'High': 'warning',
    'Medium': 'info',
    'Low': 'success',
  };
  return <Badge variant={variantMap[priority] || 'default'} className={className}>{priority}</Badge>;
};

export const SeverityBadge: React.FC<{ severity: string; className?: string }> = ({ severity, className }) => {
  const emojiMap: Record<string, string> = {
    'Critical': '🔴',
    'High': '🟠',
    'Medium': '🟡',
    'Low': '🟢',
  };
  const variantMap: Record<string, BadgeVariant> = {
    'Critical': 'danger',
    'High': 'warning',
    'Medium': 'info',
    'Low': 'success',
  };
  return (
    <Badge variant={variantMap[severity] || 'default'} className={className}>
      {emojiMap[severity]} {severity}
    </Badge>
  );
};
