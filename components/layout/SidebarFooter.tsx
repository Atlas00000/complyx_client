'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

export interface SidebarFooterProps {
  children?: ReactNode;
  copyright?: string;
  version?: string;
  className?: string;
}

const SidebarFooter = ({
  children,
  copyright,
  version,
  className = '',
}: SidebarFooterProps) => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`space-y-2 ${className}`}
    >
      {children}
      
      {(copyright || version) && (
        <div className="text-xs text-gray-500 space-y-1">
          {copyright && <p>{copyright}</p>}
          {version && <p>v{version}</p>}
        </div>
      )}
    </motion.footer>
  );
};

export default SidebarFooter;
