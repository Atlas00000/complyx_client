'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import Navigation, { NavItem } from './Navigation';

export interface SidebarNavItem extends NavItem {
  icon: ReactNode;
  badge?: number | string;
  children?: SidebarNavItem[];
}

export interface SidebarNavigationProps {
  items: SidebarNavItem[];
  collapsed?: boolean;
  className?: string;
}

const SidebarNavigation = ({
  items,
  collapsed = false,
  className = '',
}: SidebarNavigationProps) => {
  const pathname = usePathname();
  
  return (
    <nav className={`space-y-1 ${className}`}>
      {items.map((item, index) => {
        const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
        
        return (
          <motion.div
            key={item.href}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
          >
            {collapsed ? (
              <Link
                href={item.href}
                className={`flex items-center justify-center p-3 rounded-lg transition-all duration-200 ease-out ${
                  isActive
                    ? 'bg-primary text-white shadow-primary'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                title={item.label}
              >
                {item.icon}
              </Link>
            ) : (
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ease-out ${
                  isActive
                    ? 'bg-primary text-white shadow-primary'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                <span className="flex-1 text-sm font-medium">{item.label}</span>
                {item.badge && (
                  <span className="px-2 py-0.5 text-xs font-semibold bg-white/20 text-white rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            )}
          </motion.div>
        );
      })}
    </nav>
  );
};

export default SidebarNavigation;
