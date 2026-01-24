'use client';

import { ReactNode, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import HeaderBackground from './HeaderBackground';
import HeaderLogo from './HeaderLogo';
import HeaderThemeToggle from './HeaderThemeToggle';

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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`relative sticky top-0 z-sticky ${className}`}
      style={{
        backdropFilter: `blur(${scrolled ? 12 : 8}px)`,
        WebkitBackdropFilter: `blur(${scrolled ? 12 : 8}px)`,
      }}
    >
      {/* Animated Background */}
      <HeaderBackground />
      
      {/* Glassmorphism Container */}
      <div
        className="relative border-b border-white/20 dark:border-slate-700/30"
        style={{
          background: scrolled
            ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.75) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.8) 100%)',
        }}
      >
        {/* Dark mode background */}
        <div className="hidden dark:block absolute inset-0 bg-gradient-to-br from-slate-800/90 via-slate-800/85 to-slate-800/90" />
        
        {/* Inner glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent dark:from-primary/10 pointer-events-none" />
        
        {/* Content */}
        <div className="container-wide relative z-10">
          <div className="flex items-center justify-between h-16 md:h-20 px-4 lg:px-6 w-full">
            {/* Left Section - Logo/Title Only */}
            <div className="flex items-center flex-shrink-0">
              <HeaderLogo logo={logo} title={title} subtitle={subtitle} />
            </div>
            
            {/* Right Section - All Actions */}
            <div className="flex items-center gap-2 md:gap-3 flex-shrink-0 ml-auto">
              {/* Left Actions (moved to right) */}
              {leftActions}
              
              {/* Center Search Bar (moved to right) */}
              {searchBar && (
                <motion.div
                  className="hidden lg:flex"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  {searchBar}
                </motion.div>
              )}
              
              {/* Right Actions */}
              {rightActions}
              
              {/* Theme Toggle - Always at the end */}
              <HeaderThemeToggle />
            </div>
          </div>
        </div>
        
        {/* Bottom border glow */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent dark:via-primary/30" />
      </div>
    </motion.header>
  );
};

export default Header;
