'use client';

import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui';
import type { User } from '@/lib/api/authApi';

interface UserHeaderMenuProps {
  user: User;
  /** Use 'small' for mobile header. */
  size?: 'small' | 'medium';
}

/**
 * Shows user name/avatar and Log out when authenticated.
 */
export default function UserHeaderMenu({ user, size = 'medium' }: UserHeaderMenuProps) {
  const logout = useAuthStore((s) => s.logout);

  const displayName = user.name?.trim() || user.email?.split('@')[0] || 'User';
  const initials = displayName
    .split(/\s+/)
    .map((s) => s[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  return (
    <div className="flex items-center gap-2">
      <span
        className="hidden sm:inline text-sm text-gray-600 dark:text-slate-400 truncate max-w-[120px]"
        title={user.email}
      >
        {displayName}
      </span>
      <div
        className="w-8 h-8 rounded-full bg-primary/20 dark:bg-primary/30 flex items-center justify-center text-primary text-xs font-medium shrink-0"
        title={user.email}
        aria-hidden
      >
        {initials}
      </div>
      <Button
        variant="ghost"
        size={size}
        onClick={handleLogout}
        title="Log out"
      >
        Log out
      </Button>
    </div>
  );
}
