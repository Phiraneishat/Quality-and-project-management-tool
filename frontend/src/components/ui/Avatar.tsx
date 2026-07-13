import React from 'react';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'busy' | 'away' | 'offline';
  className?: string;
}

const sizeMap = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
};

const statusColorMap = {
  online: 'bg-emerald-500',
  busy: 'bg-red-500',
  away: 'bg-amber-500',
  offline: 'bg-slate-400',
};

const statusSizeMap = {
  xs: 'h-1.5 w-1.5',
  sm: 'h-2 w-2',
  md: 'h-2.5 w-2.5',
  lg: 'h-3 w-3',
  xl: 'h-3.5 w-3.5',
};

const bgColors = [
  'bg-gradient-to-br from-primary-400 to-primary-600',
  'bg-gradient-to-br from-purple-400 to-purple-600',
  'bg-gradient-to-br from-teal-400 to-teal-600',
  'bg-gradient-to-br from-rose-400 to-rose-600',
  'bg-gradient-to-br from-amber-400 to-amber-600',
  'bg-gradient-to-br from-blue-400 to-blue-600',
  'bg-gradient-to-br from-emerald-400 to-emerald-600',
];

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const getColor = (name: string): string => {
  const index = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % bgColors.length;
  return bgColors[index];
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  status,
  className = '',
}) => {
  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={`${sizeMap[size]} rounded-full object-cover ring-2 ring-white dark:ring-surface-900`}
        />
      ) : (
        <div
          className={`
            ${sizeMap[size]} ${getColor(name)}
            rounded-full flex items-center justify-center
            font-bold text-white ring-2 ring-white dark:ring-surface-900
          `}
        >
          {getInitials(name)}
        </div>
      )}
      {status && (
        <span
          className={`
            absolute bottom-0 right-0
            ${statusSizeMap[size]} ${statusColorMap[status]}
            rounded-full border-2 border-white dark:border-surface-900
          `}
        />
      )}
    </div>
  );
};

// Avatar group for team display
export const AvatarGroup: React.FC<{
  users: { name: string; avatar?: string }[];
  max?: number;
  size?: 'xs' | 'sm' | 'md';
}> = ({ users, max = 4, size = 'sm' }) => {
  const visible = users.slice(0, max);
  const remaining = users.length - max;

  return (
    <div className="flex -space-x-2">
      {visible.map((user, i) => (
        <Avatar key={i} name={user.name} src={user.avatar} size={size} />
      ))}
      {remaining > 0 && (
        <div
          className={`
            ${sizeMap[size]}
            rounded-full bg-slate-200 dark:bg-slate-700
            flex items-center justify-center
            font-bold text-slate-600 dark:text-slate-300
            ring-2 ring-white dark:ring-surface-900
          `}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
};
