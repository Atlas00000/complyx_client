'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/layout';
import { Button, ErrorState } from '@/components/ui';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5">
      <Container size="standard">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ErrorState
            title="Something went wrong"
            message={error.message || 'An unexpected error occurred. Please try again.'}
            action={{
              label: 'Try Again',
              onClick: reset,
            }}
          />
        </motion.div>
      </Container>
    </div>
  );
}
