import { ReactNode } from 'react';

export interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export default function Card({ children, className = '', padding = 'md', onClick }: CardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      onClick={onClick}
      className={`bg-white rounded-xl shadow-sm border border-gray-100 ${paddingClasses[padding]} ${className} ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow w-full text-left' : ''}`}
    >
      {children}
    </Component>
  );
}
