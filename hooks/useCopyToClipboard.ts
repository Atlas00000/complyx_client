'use client';

import { useState, useCallback } from 'react';

interface UseCopyToClipboardReturn {
  copy: (text: string) => Promise<boolean>;
  isCopied: boolean;
  error: string | null;
}

/**
 * Hook for copying text to clipboard
 * Returns copy function, copied state, and error state
 */
export function useCopyToClipboard(): UseCopyToClipboardReturn {
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const copy = useCallback(async (text: string): Promise<boolean> => {
    try {
      // Use modern Clipboard API if available
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        setIsCopied(true);
        setError(null);
        
        // Reset copied state after 2 seconds
        setTimeout(() => {
          setIsCopied(false);
        }, 2000);
        
        return true;
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          const successful = document.execCommand('copy');
          document.body.removeChild(textArea);
          
          if (successful) {
            setIsCopied(true);
            setError(null);
            
            // Reset copied state after 2 seconds
            setTimeout(() => {
              setIsCopied(false);
            }, 2000);
            
            return true;
          } else {
            throw new Error('Copy command failed');
          }
        } catch (err) {
          document.body.removeChild(textArea);
          throw err;
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to copy text';
      setError(errorMessage);
      setIsCopied(false);
      console.error('Copy to clipboard failed:', err);
      return false;
    }
  }, []);

  return { copy, isCopied, error };
}
