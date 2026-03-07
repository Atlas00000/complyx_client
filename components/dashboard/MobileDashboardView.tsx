'use client';

import { useState, useCallback } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useDashboardData } from '@/hooks/useDashboardApi';
import MobileDashboardShell from './MobileDashboardShell';
import MobileDashboardHeader from './MobileDashboardHeader';
import MobileDashboardNav from './MobileDashboardNav';
import MobileDashboardStats from './MobileDashboardStats';
import MobileDashboardLists from './MobileDashboardLists';
import MobileDashboardCharts from './MobileDashboardCharts';
import MobileDashboardDetail from './MobileDashboardDetail';
import MobileDashboardSkeleton from './MobileDashboardSkeleton';
import MobileDashboardErrorBanner from './MobileDashboardErrorBanner';
import MobileDashboardMenu from './MobileDashboardMenu';
import type { ActivityListItem, AssessmentListItem } from './MobileDashboardLists';

interface MobileDashboardViewProps {
  title?: string;
  onChatClick?: () => void;
}

/**
 * MobileDashboardView
 *
 * Week 7: Shell + header + error banner + (skeleton | stats + lists + charts) + bottom nav.
 */
export default function MobileDashboardView({
  title = 'Dashboard',
  onChatClick,
}: MobileDashboardViewProps) {
  const { user, logout } = useAuthStore();
  const userId = user?.id;
  const { data: dashboardData, isLoading } = useDashboardData(
    userId ?? undefined,
    undefined,
    { enabled: !!userId, staleTime: 5 * 60 * 1000 }
  );

  const [detailItem, setDetailItem] = useState<
    { type: 'activity'; data: ActivityListItem } | { type: 'assessment'; data: AssessmentListItem } | null
  >(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = useCallback(async () => {
    await logout();
    window.location.href = '/auth/login';
  }, [logout]);

  const handleActivityClick = useCallback((item: ActivityListItem) => {
    setDetailItem({ type: 'activity', data: item });
  }, []);

  const handleAssessmentClick = useCallback((item: AssessmentListItem) => {
    setDetailItem({ type: 'assessment', data: item });
  }, []);

  const showSkeleton = !!userId && isLoading && !dashboardData;

  return (
    <>
      <MobileDashboardShell>
        <MobileDashboardHeader
          title={title}
          onChatClick={onChatClick}
          onMenuClick={() => setIsMenuOpen(true)}
        />
        <main className="flex-1 min-h-0 overflow-auto">
          <MobileDashboardErrorBanner />
          {showSkeleton ? (
            <MobileDashboardSkeleton />
          ) : (
            <>
              <MobileDashboardStats />
              <MobileDashboardLists
                onActivityClick={handleActivityClick}
                onAssessmentClick={handleAssessmentClick}
              />
              <MobileDashboardCharts />
            </>
          )}
        </main>
        <MobileDashboardNav />
      </MobileDashboardShell>
      {detailItem && (
        <MobileDashboardDetail item={detailItem} onClose={() => setDetailItem(null)} />
      )}
      <MobileDashboardMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onLogout={handleLogout}
      />
    </>
  );
}
