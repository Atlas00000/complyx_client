'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';

export interface HeaderProps {
  logo?: ReactNode;
  title?: string;
  subtitle?: string;
  leftActions?: ReactNode;
  rightActions?: ReactNode;
  searchBar?: ReactNode;
  className?: string;
}

const Header = ({
  logo,
  title = 'Complyx',
  subtitle = 'IFRS S1 & S2 Readiness Assessment Assistant',
  leftActions,
  rightActions,
  searchBar,
  className = '',
}: HeaderProps) => {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`bg-white border-b border-gray-200 sticky top-0 z-sticky backdrop-blur-sm bg-white/95 ${className}`}
    >
      <div className="container-wide">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          {/* Left Section */}
          <div className="flex items-center gap-6 flex-1">
            {/* Logo/Title */}
            <div className="flex items-center gap-3">
              {logo || (
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{title}</h1>
                  {subtitle && (
                    <p className="text-xs text-gray-600 hidden sm:block">{subtitle}</p>
                  )}
                </div>
              )}
            </div>
            
            {/* Left Actions */}
            {leftActions && (
              <div className="hidden md:flex items-center gap-2">
                {leftActions}
              </div>
            )}
          </div>
          
          {/* Center Section - Search Bar */}
          {searchBar && (
            <div className="hidden lg:flex flex-1 max-w-md mx-4">
              {searchBar}
            </div>
          )}
          
          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Right Actions */}
            {rightActions}
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
