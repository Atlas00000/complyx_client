'use client';

import { ReactNode } from 'react';

interface MobileStatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  className?: string;
}

/**
 * MobileStatCard
 *
 * Single stat display for mobile dashboard. No Framer Motion.
 */
export default function MobileStatCard({
  label,
  value,
  subtitle,
  icon,
  className = '',
}: MobileStatCardProps) {
  return (
    <div
      className={`rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 min-h-[72px] flex flex-col justify-center ${className}`}
    >
      <div className="flex items-center gap-2">
        {icon && <span className="flex-shrink-0 text-gray-500 dark:text-slate-400">{icon}</span>}
        <span className="text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-slate-100">
        {value}
      </p>
      {subtitle && (
        <p className="mt-0.5 text-sm text-gray-500 dark:text-slate-400">{subtitle}</p>
      )}
    </div>
  );
}
