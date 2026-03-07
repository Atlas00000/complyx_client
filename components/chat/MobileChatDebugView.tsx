'use client';

import { useState, useEffect } from 'react';

/**
 * MobileChatDebugView
 *
 * Minimal mobile-only debug screen: plain HTML + visible text.
 * Used to verify the chat page loads on mobile and the mobile branch is hit.
 * No Framer Motion, no layout wrappers—just a div and text.
 */
export default function MobileChatDebugView() {
  const [loadedAt, setLoadedAt] = useState<string>('');

  useEffect(() => {
    setLoadedAt(new Date().toISOString());
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        backgroundColor: '#ffffff',
        color: '#111827',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <p style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, textAlign: 'center' }}>
        Mobile chat view – debug
      </p>
      <p style={{ fontSize: 14, color: '#6b7280', textAlign: 'center' }}>
        If you see this, the chat page is loading on mobile.
      </p>
      {loadedAt && (
        <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 16 }}>
          Loaded at: {loadedAt}
        </p>
      )}
    </div>
  );
}
