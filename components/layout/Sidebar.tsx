'use client';

import { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';

export interface SidebarProps {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  width?: number;
  collapsedWidth?: number;
  className?: string;
}

const Sidebar = ({
  children,
  header,
  footer,
  collapsible = true,
  defaultCollapsed = false,
  width = 256,
  collapsedWidth = 64,
  className = '',
}: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  
  return (
    <motion.aside
      initial={false}
      animate={{
        width: isCollapsed ? collapsedWidth : width,
      }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0 ${className}`}
    >
      {/* Header */}
      {header && (
        <div className="flex-shrink-0 border-b border-gray-200 p-4">
          <AnimatePresence mode="wait">
            {!isCollapsed ? (
              <motion.div
                key="expanded"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {header}
              </motion.div>
            ) : (
              <motion.div
                key="collapsed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center"
              >
                <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-sm">
                  C
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {children}
      </div>
      
      {/* Footer */}
      {footer && (
        <div className="flex-shrink-0 border-t border-gray-200 p-4">
          <AnimatePresence mode="wait">
            {!isCollapsed ? (
              <motion.div
                key="expanded"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {footer}
              </motion.div>
            ) : (
              <motion.div
                key="collapsed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center"
              >
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => setIsCollapsed(false)}
                  className="w-full"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
      
      {/* Toggle Button */}
      {collapsible && (
        <div className="absolute -right-3 top-1/2 transform -translate-y-1/2">
          <Button
            variant="secondary"
            size="small"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="rounded-full p-1.5 shadow-md"
          >
            <motion.svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{ rotate: isCollapsed ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </motion.svg>
          </Button>
        </div>
      )}
    </motion.aside>
  );
};

export default Sidebar;
