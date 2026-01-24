'use client';

import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import { Form, FormField, Input, Button, Card } from '@/components/ui';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { register, isLoading, error, clearError } = useAuthStore();
  const router = useRouter();

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    if (password.length < 8) errors.push('At least 8 characters');
    if (!/[A-Z]/.test(password)) errors.push('One uppercase letter');
    if (!/[a-z]/.test(password)) errors.push('One lowercase letter');
    if (!/[0-9]/.test(password)) errors.push('One number');
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push('One special character');
    return errors;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();
    setSuccess(false);

    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setLocalError('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    const passwordErrors = validatePassword(formData.password);
    if (passwordErrors.length > 0) {
      setLocalError(`Password requirements: ${passwordErrors.join(', ')}`);
      return;
    }

    try {
      await register({
        email: formData.email,
        password: formData.password,
        name: formData.name || undefined,
      });
      setSuccess(true);
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  const passwordErrors = formData.password ? validatePassword(formData.password) : [];
  const displayError = localError || error;

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-4"
      >
        <Card variant="elevated" className="p-6 bg-secondary/10 border-secondary/20">
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="w-12 h-12 rounded-full bg-secondary text-white flex items-center justify-center"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
            <div>
              <h3 className="font-semibold text-gray-900">Registration successful!</h3>
              <p className="text-sm text-gray-600 mt-1">
                Please check your email to verify your account. You'll be redirected to the login page shortly.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <Form onSubmit={handleSubmit}>
      <div className="space-y-5">
        <FormField
          label="Name"
          helperText="Optional"
        >
          <Input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Your name"
            disabled={isLoading}
            leftIcon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
          />
        </FormField>

        <FormField
          label="Email"
          error={displayError && formData.email && !formData.password ? displayError : undefined}
          required
        >
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="you@example.com"
            required
            disabled={isLoading}
            leftIcon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            }
          />
        </FormField>

        <FormField
          label="Password"
          error={displayError && formData.password ? displayError : undefined}
          helperText={formData.password && passwordErrors.length > 0 ? undefined : 'Must be at least 8 characters with uppercase, lowercase, number, and special character'}
          required
        >
          <Input
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="Create a password"
            required
            disabled={isLoading}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m13.42 13.42l-3.29-3.29M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            }
          />
          {formData.password && passwordErrors.length > 0 && (
            <div className="mt-2 text-xs text-gray-600">
              <p className="font-medium mb-1">Password must contain:</p>
              <ul className="list-disc list-inside space-y-0.5">
                {passwordErrors.map((err, idx) => (
                  <li key={idx} className="text-error">{err}</li>
                ))}
              </ul>
            </div>
          )}
        </FormField>

        <FormField
          label="Confirm Password"
          error={formData.confirmPassword && formData.password !== formData.confirmPassword ? 'Passwords do not match' : undefined}
          required
        >
          <Input
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            placeholder="Confirm your password"
            required
            disabled={isLoading}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirmPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m13.42 13.42l-3.29-3.29M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            }
          />
        </FormField>

        <Button
          type="submit"
          variant="primary"
          size="large"
          fullWidth
          isLoading={isLoading}
          className="mt-6"
        >
          {isLoading ? 'Creating account...' : 'Create Account'}
        </Button>
      </div>
    </Form>
  );
}
