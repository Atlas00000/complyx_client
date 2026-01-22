'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAdminStore } from '@/stores/adminStore';
import { Header, Container, Grid } from '@/components/layout';
import { Card, Button, Skeleton, SkeletonCard } from '@/components/ui';
import { StatisticsSection } from '@/components/homepage';

export default function AdminDashboard() {
  const { stats, isLoading, error, fetchStats } = useAdminStore();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const statistics = stats ? [
    { value: stats.totalUsers, suffix: '+', label: 'Total Users' },
    { value: stats.totalOrganizations, suffix: '+', label: 'Organizations' },
    { value: stats.totalAssessments, suffix: '+', label: 'Assessments' },
    { value: stats.activeUsers, suffix: '+', label: 'Active Users (30d)' },
  ] : [];

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-secondary text-white';
      case 'degraded':
        return 'bg-warning text-white';
      case 'down':
        return 'bg-error text-white';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Admin Dashboard"
        subtitle="System Overview & Management"
        rightActions={
          <Button variant="primary" onClick={() => window.location.href = '/dashboard'}>
            User Dashboard
          </Button>
        }
      />

      <Container size="wide" className="py-8">
        {isLoading && !stats ? (
          <div className="space-y-6">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : error ? (
          <Card variant="elevated" className="p-6">
            <div className="text-center text-error">
              <p className="font-semibold">Error loading dashboard</p>
              <p className="text-sm mt-2">{error}</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Statistics */}
            {statistics.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <StatisticsSection statistics={statistics} />
              </motion.div>
            )}

            {/* System Health */}
            {stats && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card variant="elevated" className="p-6">
                  <h2 className="text-h5 text-gray-900 font-semibold mb-4">System Health</h2>
                  <Grid
                    cols={2}
                    gap="medium"
                    responsive={{
                      sm: 1,
                      md: 2,
                    }}
                  >
                    <Card className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Database</p>
                            <p className="text-sm text-gray-500">PostgreSQL</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getHealthColor(stats.systemHealth.database)}`}>
                          {stats.systemHealth.database}
                        </span>
                      </div>
                    </Card>
                    <Card className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Redis</p>
                            <p className="text-sm text-gray-500">Cache</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getHealthColor(stats.systemHealth.redis)}`}>
                          {stats.systemHealth.redis}
                        </span>
                      </div>
                    </Card>
                  </Grid>
                </Card>
              </motion.div>
            )}

            {/* Quick Actions */}
            <Grid
              cols={3}
              gap="large"
              responsive={{
                sm: 1,
                md: 2,
                lg: 3,
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card variant="elevated" hover className="p-6 text-center cursor-pointer" onClick={() => window.location.href = '/admin/users'}>
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h3 className="text-h5 text-gray-900 font-semibold mb-2">User Management</h3>
                  <p className="text-body-sm text-gray-600">Manage users, roles, and permissions</p>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card variant="elevated" hover className="p-6 text-center cursor-pointer" onClick={() => window.location.href = '/admin/analytics'}>
                  <div className="w-16 h-16 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-h5 text-gray-900 font-semibold mb-2">Analytics</h3>
                  <p className="text-body-sm text-gray-600">View system analytics and reports</p>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card variant="elevated" className="p-6 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-h5 text-gray-900 font-semibold mb-2">Settings</h3>
                  <p className="text-body-sm text-gray-600">Coming soon</p>
                </Card>
              </motion.div>
            </Grid>
          </div>
        )}
      </Container>
    </div>
  );
}
