import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const paddingMap = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  glass = false,
  padding = 'md',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        rounded-2xl border
        ${glass
          ? 'glass-card'
          : 'bg-white dark:bg-surface-900 border-slate-200/80 dark:border-slate-800/80 shadow-sm'
        }
        ${hover ? 'card-hover cursor-pointer' : ''}
        ${paddingMap[padding]}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};
