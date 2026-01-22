'use client';

import { ReactNode, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';

export interface UserProfileMenuItem {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  divider?: boolean;
  danger?: boolean;
}

export interface UserProfileDropdownProps {
  user?: {
    name?: string;
    email?: string;
    avatar?: string | ReactNode;
  };
  menuItems?: UserProfileMenuItem[];
  trigger?: ReactNode;
  className?: string;
}

const UserProfileDropdown = ({
  user,
  menuItems = [],
  trigger,
  className = '',
}: UserProfileDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  
  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);
  
  const defaultTrigger = (
    <button
      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
      onClick={() => setIsOpen(!isOpen)}
    >
      {user?.avatar ? (
        typeof user.avatar === 'string' ? (
          <img
            src={user.avatar}
            alt={user.name || 'User'}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          user.avatar
        )
      ) : (
        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
          {user?.name?.[0]?.toUpperCase() || 'U'}
        </div>
      )}
      {user?.name && (
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-900">{user.name}</p>
          {user.email && (
            <p className="text-xs text-gray-500">{user.email}</p>
          )}
        </div>
      )}
      <svg
        className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
  
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {trigger || defaultTrigger}
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-dropdown"
          >
            {/* User Info */}
            {user && (
              <div className="px-4 py-3 border-b border-gray-200">
                {user.name && (
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                )}
                {user.email && (
                  <p className="text-sm text-gray-500">{user.email}</p>
                )}
              </div>
            )}
            
            {/* Menu Items */}
            <div className="py-1">
              {menuItems.map((item, index) => (
                <div key={index}>
                  {item.divider && <div className="border-t border-gray-200 my-1" />}
                  <button
                    onClick={() => {
                      item.onClick();
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors duration-200 ${
                      item.danger
                        ? 'text-error hover:bg-error/10'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                    <span>{item.label}</span>
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserProfileDropdown;
