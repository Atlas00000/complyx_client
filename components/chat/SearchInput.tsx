'use client';

import { useState, useEffect, useRef } from 'react';

interface SearchInputProps {
  onSearch: (query: string) => void;
  onClose: () => void;
  isOpen: boolean;
  placeholder?: string;
}

export default function SearchInput({ onSearch, onClose, isOpen, placeholder = 'Search messages...' }: SearchInputProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  if (!isOpen) return null;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      onClose();
      setQuery('');
    }
  };

  return (
    <div className="absolute top-0 left-0 right-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-600 p-3 z-10">
      <div className="flex items-center gap-2 max-w-4xl mx-auto">
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full px-4 py-2 pl-10 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-gray-400 dark:placeholder:text-slate-400"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button
          onClick={onClose}
          className="px-3 py-2 text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-slate-100 transition-colors"
          title="Close search (Esc)"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
