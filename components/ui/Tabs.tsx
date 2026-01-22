'use client';

import { ReactNode, useState } from 'react';
import { motion } from 'framer-motion';

export interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
  content: ReactNode;
  disabled?: boolean;
  badge?: number | string;
}

export interface TabsProps {
  items: TabItem[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

const Tabs = ({
  items,
  defaultTab,
  onChange,
  variant = 'default',
  orientation = 'horizontal',
  className = '',
}: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab || items[0]?.id);

  const handleTabChange = (tabId: string) => {
    const tab = items.find((item) => item.id === tabId);
    if (tab && !tab.disabled) {
      setActiveTab(tabId);
      if (onChange) {
        onChange(tabId);
      }
    }
  };

  const activeTabContent = items.find((item) => item.id === activeTab)?.content;

  // Variant styles
  const variantStyles = {
    default: {
      tab: 'px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200',
      active: 'text-primary border-b-2 border-primary',
    },
    pills: {
      tab: 'px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg transition-colors duration-200',
      active: 'text-primary bg-primary-light/10',
    },
    underline: {
      tab: 'px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 border-b-2 border-transparent transition-colors duration-200',
      active: 'text-primary border-primary',
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className={`${orientation === 'vertical' ? 'flex' : ''} ${className}`}>
      {/* Tab List */}
      <div
        className={`flex ${
          orientation === 'vertical'
            ? 'flex-col gap-1 border-r border-gray-200 pr-4 mr-4'
            : 'border-b border-gray-200 gap-1'
        }`}
        role="tablist"
      >
        {items.map((item) => {
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              disabled={item.disabled}
              className={`relative flex items-center gap-2 ${styles.tab} ${
                isActive ? styles.active : ''
              } ${
                item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }`}
              role="tab"
              aria-selected={isActive}
              aria-disabled={item.disabled}
            >
              {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-1 px-2 py-0.5 text-xs font-semibold bg-primary text-white rounded-full">
                  {item.badge}
                </span>
              )}
              
              {/* Active indicator for underline variant */}
              {variant === 'underline' && isActive && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  layoutId="activeTab"
                  transition={{ duration: 0.2 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 mt-4" role="tabpanel">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTabContent}
        </motion.div>
      </div>
    </div>
  );
};

export default Tabs;
