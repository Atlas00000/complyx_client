'use client';

import { ReactNode } from 'react';

interface MobileListItemProps {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
}

/**
 * MobileListItem
 *
 * Reusable list row for mobile dashboard. Min 44px height, optional chevron/action.
 * No Framer Motion.
 */
export default function MobileListItem({
  title,
  subtitle,
  right,
  onClick,
  href,
  className = '',
}: MobileListItemProps) {
  const content = (
    <>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-slate-100 truncate">
          {title}
        </p>
        {subtitle && (
          <p className="text-xs text-gray-500 dark:text-slate-400 truncate mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
      {right !== undefined && (
        <div className="flex-shrink-0 ml-2">{right}</div>
      )}
    </>
  );

  const baseClass =
    'min-h-[44px] flex items-center gap-2 px-4 py-3 border-b border-gray-100 dark:border-slate-700/50 last:border-b-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset ' +
    className;

  if (href) {
    return (
      <a href={href} className={`block w-full text-left ${baseClass}`}>
        {content}
      </a>
    );
  }

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`block w-full text-left ${baseClass}`}
      >
        {content}
      </button>
    );
  }

  return <div className={baseClass}>{content}</div>;
}
