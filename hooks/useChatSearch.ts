'use client';

import { useState, useMemo } from 'react';
import type { Message } from '@/stores/chatStore';

interface SearchResult {
  messageId: string;
  index: number;
  matches: number;
}

export function useChatSearch(messages: Message[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

  // Filter messages that match the search query
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }

    const query = searchQuery.toLowerCase();
    const results: SearchResult[] = [];

    messages.forEach((message, index) => {
      const content = message.content.toLowerCase();
      if (content.includes(query)) {
        // Count number of matches in this message
        const matches = (content.match(new RegExp(query, 'g')) || []).length;
        results.push({
          messageId: message.id,
          index,
          matches,
        });
      }
    });

    return results;
  }, [messages, searchQuery]);

  const totalMatches = useMemo(() => {
    return searchResults.reduce((sum, result) => sum + result.matches, 0);
  }, [searchResults]);

  const currentResult = searchResults[currentMatchIndex] || null;

  const goToNextMatch = () => {
    if (searchResults.length > 0) {
      setCurrentMatchIndex((prev) => (prev + 1) % searchResults.length);
    }
  };

  const goToPreviousMatch = () => {
    if (searchResults.length > 0) {
      setCurrentMatchIndex((prev) => (prev - 1 + searchResults.length) % searchResults.length);
    }
  };

  const resetSearch = () => {
    setSearchQuery('');
    setCurrentMatchIndex(0);
  };

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    currentMatchIndex,
    currentResult,
    totalMatches,
    goToNextMatch,
    goToPreviousMatch,
    resetSearch,
    hasResults: searchResults.length > 0,
  };
}
