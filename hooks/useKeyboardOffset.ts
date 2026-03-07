'use client';

import { useState, useEffect } from 'react';

/**
 * useKeyboardOffset
 *
 * Returns the height offset (px) when the virtual keyboard is open on mobile.
 * Use as paddingBottom or marginBottom so content can scroll above the keyboard.
 * Returns 0 when visualViewport is unavailable or on desktop.
 */
export function useKeyboardOffset(): number {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const viewport = typeof window !== 'undefined' ? window.visualViewport : null;
    if (!viewport) return;

    const update = () => {
      const heightDiff = window.innerHeight - viewport.height;
      setOffset(heightDiff > 50 ? heightDiff : 0);
    };

    update();
    viewport.addEventListener('resize', update);
    viewport.addEventListener('scroll', update);
    return () => {
      viewport.removeEventListener('resize', update);
      viewport.removeEventListener('scroll', update);
    };
  }, []);

  return offset;
}
