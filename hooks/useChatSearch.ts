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
        // Escape special regex characters to prevent errors (especially on iOS Safari)
        try {
          const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const regex = new RegExp(escapedQuery, 'g');
          const matches = (content.match(regex) || []).length;
          results.push({
            messageId: message.id,
            index,
            matches,
          });
        } catch (error) {
          // Fallback: if regex fails, just count 1 match (already confirmed via includes)
          console.warn('Regex error in search, using fallback:', error);
          results.push({
            messageId: message.id,
            index,
            matches: 1,
          });
        }
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
