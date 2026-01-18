'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, getCurrentUser } = useAuthStore();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      setIsChecking(true);
      
      // If not authenticated, try to get user
      if (!isAuthenticated || !user) {
        try {
          await getCurrentUser();
          // After getting user, re-check
          const updatedUser = useAuthStore.getState().user;
          if (!updatedUser) {
            // Still no user, redirect to login
            const currentPath = window.location.pathname;
            router.push(`/auth/login?redirect=${encodeURIComponent(currentPath)}`);
            return;
          }
        } catch {
          // Failed to get user, redirect to login with return URL
          const currentPath = window.location.pathname;
          router.push(`/auth/login?redirect=${encodeURIComponent(currentPath)}`);
          return;
        }
      }

      // Check admin access with current user state
      const currentUser = useAuthStore.getState().user;
      const hasAdminAccess = currentUser?.role?.name === 'Admin' || 
                            currentUser?.permissions?.some(p => p.name === 'admin:access');
      
      if (!hasAdminAccess) {
        // Non-admin users should be redirected to dashboard
        router.push('/dashboard');
        return;
      }

      setIsChecking(false);
    };

    checkAuth();
  }, [isAuthenticated, user, getCurrentUser, router]);

  if (isChecking || !isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const hasAdminAccess = user.role?.name === 'Admin' || 
                        user.permissions?.some(p => p.name === 'admin:access');
  
  if (!hasAdminAccess) {
    return null; // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/admin" className="text-xl font-bold text-gray-900">
                  Complyx Admin
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href="/admin"
                  className="border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin/users"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Users
                </Link>
                <Link
                  href="/admin/analytics"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Analytics
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-700 mr-4">{user.email}</span>
              <Link
                href="/dashboard"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Back to App
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
