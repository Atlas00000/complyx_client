'use client';

import { motion } from 'framer-motion';
import { Container } from '@/components/layout';
import { Button, EmptyState } from '@/components/ui';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5">
      <Container size="standard">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
            <h2 className="text-h2 text-gray-900 font-bold mb-4">Page Not Found</h2>
            <p className="text-body-lg text-gray-600 max-w-md mx-auto mb-8">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center justify-center gap-4 flex-wrap"
          >
            <Button variant="primary" size="large" onClick={() => window.location.href = '/'}>
              Go Home
            </Button>
            <Button variant="secondary" size="large" onClick={() => window.history.back()}>
              Go Back
            </Button>
          </motion.div>
        </motion.div>
      </Container>
    </div>
  );
}
