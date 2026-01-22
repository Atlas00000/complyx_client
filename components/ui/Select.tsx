'use client';

import { SelectHTMLAttributes, forwardRef, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  options: SelectOption[];
  error?: string;
  label?: string;
  helperText?: string;
  placeholder?: string;
  fullWidth?: boolean;
  onChange?: (value: string) => void;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      options,
      error,
      label,
      helperText,
      placeholder = 'Select an option...',
      fullWidth = false,
      className = '',
      disabled,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState<string>(value as string || '');
    const selectRef = useRef<HTMLDivElement>(null);
    
    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
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
    
    // Handle option selection
    const handleSelect = (optionValue: string) => {
      if (onChange) {
        onChange(optionValue);
      }
      setSelectedValue(optionValue);
      setIsOpen(false);
    };
    
    // Get selected option label
    const selectedOption = options.find(opt => opt.value === selectedValue);
    const displayValue = selectedOption ? selectedOption.label : placeholder;
    
    // Base styles
    const baseStyles = 'w-full px-4 py-3 bg-white border rounded-lg text-body text-gray-900 transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-between';
    
    // Error styles
    const errorStyles = error ? 'border-error focus:ring-error focus:border-error' : 'border-gray-200';
    
    // Width styles
    const widthStyles = fullWidth ? 'w-full' : '';
    
    // Combine all styles
    const selectClasses = `${baseStyles} ${errorStyles} ${widthStyles} ${className}`;
    
    return (
      <div className={`${fullWidth ? 'w-full' : ''} relative`} ref={selectRef}>
        {/* Label */}
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
            {props.required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        
        {/* Select Button */}
        <motion.button
          type="button"
          className={selectClasses}
          disabled={disabled}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          whileHover={!disabled ? { scale: 1.01 } : {}}
          whileTap={!disabled ? { scale: 0.99 } : {}}
        >
          <span className={selectedValue ? 'text-gray-900' : 'text-gray-400'}>
            {displayValue}
          </span>
          <motion.svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </motion.svg>
        </motion.button>
        
        {/* Hidden Native Select for Form Submission */}
        <select
          ref={ref}
          value={selectedValue}
          onChange={(e) => handleSelect(e.target.value)}
          className="hidden"
          disabled={disabled}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        
        {/* Dropdown Options */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto"
            >
              {options.map((option) => (
                <motion.button
                  key={option.value}
                  type="button"
                  onClick={() => !option.disabled && handleSelect(option.value)}
                  disabled={option.disabled}
                  className={`w-full px-4 py-2 text-left text-body text-gray-900 hover:bg-gray-50 transition-colors duration-150 ${
                    selectedValue === option.value ? 'bg-primary-light/10 text-primary' : ''
                  } ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  whileHover={!option.disabled ? { backgroundColor: '#F3F4F6' } : {}}
                >
                  {option.label}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Error Message */}
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-sm text-error flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </motion.p>
        )}
        
        {/* Helper Text */}
        {helperText && !error && (
          <p className="mt-2 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
