'use client';

import { usePathname } from 'next/navigation';

const NAV_ITEMS: { href: string; label: string }[] = [
  { href: '/', label: 'Chat' },
  { href: '/dashboard', label: 'Dashboard' },
];

/**
 * MobileDashboardNav
 *
 * Bottom tab bar for mobile: Chat, Dashboard. Highlights active route.
 * No Framer Motion. Uses next/link-style navigation via <a> for full reload or client nav.
 */
export default function MobileDashboardNav() {
  const pathname = usePathname();
  const currentPath = pathname ?? '';

  return (
    <nav
      className="flex-shrink-0 flex items-center justify-around border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Main navigation"
    >
      {NAV_ITEMS.map(({ href, label }) => {
        const isActive = currentPath === href || (href !== '/' && currentPath.startsWith(href));
        return (
          <a
            key={href}
            href={href}
            className={`min-h-[48px] flex-1 flex items-center justify-center gap-1.5 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset ${
              isActive
                ? 'text-primary border-t-2 border-primary pt-0 -mt-px'
                : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100'
            }`}
            aria-current={isActive ? 'page' : undefined}
          >
            {label === 'Chat' && (
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            )}
            {label === 'Dashboard' && (
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            )}
            <span>{label}</span>
          </a>
        );
      })}
    </nav>
  );
}
