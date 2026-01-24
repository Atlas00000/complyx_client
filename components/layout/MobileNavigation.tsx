'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export interface MobileNavItem {
  label: string;
  href: string;
  icon: ReactNode;
  badge?: number;
}

export interface MobileNavigationProps {
  items: MobileNavItem[];
  className?: string;
}

/**
 * MobileNavigation Component
 * 
 * Bottom navigation bar for mobile devices with:
 * - Fixed bottom position
 * - Touch-optimized buttons
 * - Active state indicators
 * - Badge support for notifications
 */
const MobileNavigation = ({ items, className = '' }: MobileNavigationProps) => {
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`fixed bottom-0 left-0 right-0 z-50 ${className}`}
      style={{
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {/* Background with glassmorphism */}
      <div className="absolute inset-0 backdrop-blur-xl bg-white/90 dark:bg-slate-800/90 border-t border-white/20 dark:border-slate-700/30">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent dark:from-primary/10" />
      </div>

      {/* Navigation items */}
      <div className="relative flex items-center justify-around h-16 px-2">
        {items.map((item, _index) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center justify-center flex-1 h-full min-w-0 touch-manipulation"
            >
              <motion.div
                className="flex flex-col items-center justify-center gap-1 w-full"
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.1 }}
              >
                {/* Icon container */}
                <div className="relative">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-primary text-white shadow-lg shadow-primary/30'
                        : 'text-gray-600 dark:text-slate-400'
                    }`}
                  >
                    {item.icon}
                  </div>

                  {/* Badge */}
                  {item.badge && item.badge > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-red-500 text-white text-xs font-semibold"
                    >
                      {item.badge > 99 ? '99+' : item.badge}
                    </motion.div>
                  )}

                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="mobile-nav-indicator"
                      className="absolute -bottom-1 left-1/2 w-1 h-1 rounded-full bg-primary"
                      style={{ x: '-50%' }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </div>

                {/* Label */}
                <span
                  className={`text-xs font-medium transition-colors duration-200 ${
                    isActive
                      ? 'text-primary dark:text-primary-light'
                      : 'text-gray-600 dark:text-slate-400'
                  }`}
                >
                  {item.label}
                </span>
              </motion.div>

              {/* Active background glow */}
              {isActive && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 rounded-2xl bg-primary/10 dark:bg-primary/20 blur-md -z-10"
                />
              )}
            </Link>
          );
        })}
      </div>

      {/* Top border glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent dark:via-primary/30" />
    </motion.nav>
  );
};

export default MobileNavigation;
