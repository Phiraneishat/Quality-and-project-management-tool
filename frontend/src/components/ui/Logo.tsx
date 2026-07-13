import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-9 w-9',
    lg: 'h-10 w-10',
    xl: 'h-14 w-14',
  };

  const svgSizes = {
    sm: 'h-4.5 w-4.5',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
    xl: 'h-9 w-9',
  };

  return (
    <div className={`relative group shrink-0 ${className}`}>
      {/* Outer holographic pulse glow backdrop */}
      <span className="absolute inset-0 rounded-xl bg-gradient-to-tr from-primary-500 to-purple-600 blur-md opacity-40 group-hover:opacity-75 transition-opacity duration-300 pointer-events-none animate-pulse" />

      {/* Styled logo frame */}
      <div className={`relative ${sizeClasses[size]} rounded-xl bg-gradient-to-tr from-primary-500 via-primary-600 to-purple-600 flex items-center justify-center border border-white/10 shadow-md group-hover:scale-105 active:scale-95 transition-transform duration-250`}>
        {/* Custom checkmark-Q SVG icon representing QualityDesk */}
        <svg 
          className={`${svgSizes[size]} text-white transform group-hover:rotate-6 transition-transform duration-300`} 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          {/* Circular Q body */}
          <path d="M12 3a9 9 0 105.7 15.9L21 21" />
          {/* Centered verify checkmark */}
          <path d="M9 12l2 2 4-4" className="stroke-cyan-300" />
        </svg>
      </div>
    </div>
  );
};
