import React from 'react';

interface VesselHavenLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon';
  className?: string;
}

export default function VesselHavenLogo({ size = 'md', variant = 'full', className = '' }: VesselHavenLogoProps) {
  const sizeClasses = {
    sm: { icon: 'w-8 h-8', text: 'text-lg' },
    md: { icon: 'w-10 h-10', text: 'text-xl' },
    lg: { icon: 'w-12 h-12', text: 'text-2xl' },
    xl: { icon: 'w-16 h-16', text: 'text-3xl' },
  };

  const VHIcon = () => (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={sizeClasses[size].icon}
    >
      <defs>
        <linearGradient id="vhGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2d5578" />
          <stop offset="100%" stopColor="#4ecdc4" />
        </linearGradient>
      </defs>
      {/* V shape */}
      <path
        d="M15 20 L35 75 L50 45"
        stroke="url(#vhGradient)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* H shape integrated with V */}
      <path
        d="M50 45 L65 75 L85 20"
        stroke="url(#vhGradient)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* H crossbar */}
      <path
        d="M55 55 L75 55"
        stroke="url(#vhGradient)"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );

  if (variant === 'icon') {
    return <VHIcon />;
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <VHIcon />
      <div className="flex flex-col">
        <span className={`font-bold tracking-tight ${sizeClasses[size].text}`}>
          <span className="text-navy-600">VESSEL</span>
          <span className="text-ocean-400">HAVEN</span>
        </span>
      </div>
    </div>
  );
}
