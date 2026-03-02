'use client';

import Link from 'next/link';
import { Button } from '@/components/ui';

interface AuthHeaderButtonsProps {
  /** Use 'small' for mobile header. */
  size?: 'small' | 'medium';
}

/**
 * Log in and Sign up buttons for the header when user is not authenticated.
 */
export default function AuthHeaderButtons({ size = 'medium' }: AuthHeaderButtonsProps) {
  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <Link href="/auth/login">
        <Button variant="ghost" size={size}>
          Log in
        </Button>
      </Link>
      <Link href="/auth/register">
        <Button variant="primary" size={size}>
          Sign up
        </Button>
      </Link>
    </div>
  );
}
