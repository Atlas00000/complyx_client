'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/layout';
import { ErrorState, Button } from '@/components/ui';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error('Global application error:', error);
  }, [error]);

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5">
        <div className="min-h-screen flex items-center justify-center">
          <Container size="standard">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center gap-4"
            >
              <ErrorState
                title="Something went wrong"
                message={error.message || 'An unexpected error occurred. We have not lost your data.'}
                action={{
                  label: 'Try Again',
                  onClick: reset,
                }}
              />
              <Button variant="secondary" onClick={handleGoHome}>
                Back to chat
              </Button>
            </motion.div>
          </Container>
        </div>
      </body>
    </html>
  );
}

