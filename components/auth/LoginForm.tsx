'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useRouter, useSearchParams } from 'next/navigation';
import { Form, FormField, Input, Button } from '@/components/ui';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  const { login, isLoading, error, clearError } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const redirect = searchParams.get('redirect');
    if (redirect) {
      setRedirectTo(redirect);
    }
  }, [searchParams]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!email || !password) {
      setLocalError('Please fill in all fields');
      return;
    }

    try {
      await login({ email, password });
      
      const { user } = useAuthStore.getState();
      
      const isAdmin = user?.role?.name === 'Admin' || 
                     user?.permissions?.some(p => p.name === 'admin:access');
      
      if (redirectTo) {
        router.push(redirectTo);
      } else if (isAdmin) {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  const displayError = localError || error;

  return (
    <Form onSubmit={handleSubmit}>
      <div className="space-y-5">
        <FormField
          label="Email"
          error={displayError && !password ? displayError : undefined}
          required
        >
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
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
          error={displayError && password ? displayError : undefined}
          required
        >
          <Input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
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
        </FormField>

        <Button
          type="submit"
          variant="primary"
          size="large"
          fullWidth
          isLoading={isLoading}
          className="mt-6"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </div>
    </Form>
  );
}
