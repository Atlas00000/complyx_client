'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export interface NavItem {
  href: string;
  label: string;
  icon?: ReactNode;
  badge?: number | string;
  external?: boolean;
}

export interface NavigationProps {
  items: NavItem[];
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

const Navigation = ({
  items,
  orientation = 'horizontal',
  className = '',
}: NavigationProps) => {
  const pathname = usePathname();
  
  const baseStyles = orientation === 'horizontal' 
    ? 'flex items-center gap-1' 
    : 'flex flex-col gap-1';
  
  return (
    <nav className={`${baseStyles} ${className}`}>
      {items.map((item, index) => {
        const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
        
        const linkContent = (
          <>
            {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
            <span>{item.label}</span>
            {item.badge && (
              <span className="ml-auto px-2 py-0.5 text-xs font-semibold bg-primary text-white rounded-full">
                {item.badge}
              </span>
            )}
          </>
        );
        
        const linkClasses = `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-out ${
          isActive
            ? 'bg-primary text-white shadow-primary'
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
        }`;
        
        if (item.external) {
          return (
            <motion.a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClasses}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {linkContent}
            </motion.a>
          );
        }
        
        return (
          <motion.div
            key={item.href}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
          >
            <Link
              href={item.href}
              className={linkClasses}
            >
              {linkContent}
            </Link>
          </motion.div>
        );
      })}
    </nav>
  );
};

export default Navigation;
