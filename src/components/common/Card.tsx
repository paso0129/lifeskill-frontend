'use client';

import { ReactNode } from 'react';

interface CardProps {
  title: string;
  description?: string;
  onClick?: () => void;
  icon?: ReactNode;
  gradient?: boolean;
  className?: string;
  children?: ReactNode;
}

export default function Card({
  title,
  description,
  onClick,
  icon,
  gradient = false,
  className = '',
  children,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        rounded-2xl shadow-sm p-5 transition-all duration-200
        ${onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98]' : ''}
        ${gradient ? 'bg-gradient-to-br from-primary to-primary-dark text-white' : 'bg-white text-slate-800'}
        ${className}
      `}
    >
      {icon && <div className="mb-3">{icon}</div>}
      <h3 className={`font-semibold text-lg ${gradient ? 'text-white' : 'text-slate-800'}`}>
        {title}
      </h3>
      {description && (
        <p className={`mt-1 text-sm ${gradient ? 'text-white/80' : 'text-slate-500'}`}>
          {description}
        </p>
      )}
      {children}
    </div>
  );
}
