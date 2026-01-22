'use client';

import { motion } from 'framer-motion';
import { Container } from '@/components/layout';
import { Card } from '@/components/ui';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 py-12 px-4">
      <Container size="narrow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <Card variant="elevated" className="p-8 lg:p-10">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center mb-8"
            >
              <h1 className="text-h2 text-gray-900 font-bold mb-2">Reset Password</h1>
              <p className="text-body text-gray-600">
                Enter your email address and we'll send you a link to reset your password
              </p>
            </motion.div>

            {/* Forgot Password Form */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ForgotPasswordForm />
            </motion.div>

            {/* Footer Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-6 text-center"
            >
              <a
                href="/auth/login"
                className="text-sm text-primary hover:text-primary-dark transition-colors duration-200"
              >
                Back to sign in
              </a>
            </motion.div>
          </Card>
        </motion.div>
      </Container>
    </div>
  );
}
