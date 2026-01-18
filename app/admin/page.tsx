'use client';

import { useEffect } from 'react';
import { useAdminStore } from '@/stores/adminStore';

export default function AdminDashboard() {
  const { stats, isLoading, error, fetchStats } = useAdminStore();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (isLoading && !stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        {error}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: '👥',
      color: 'bg-blue-500',
    },
    {
      title: 'Organizations',
      value: stats.totalOrganizations,
      icon: '🏢',
      color: 'bg-green-500',
    },
    {
      title: 'Assessments',
      value: stats.totalAssessments,
      icon: '📊',
      color: 'bg-purple-500',
    },
    {
      title: 'Active Users (30d)',
      value: stats.activeUsers,
      icon: '✅',
      color: 'bg-yellow-500',
    },
    {
      title: 'Recent Registrations (7d)',
      value: stats.recentRegistrations,
      icon: '🆕',
      color: 'bg-indigo-500',
    },
  ];

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-100';
      case 'degraded':
        return 'text-yellow-600 bg-yellow-100';
      case 'down':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Overview of system statistics and health
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5 mb-8">
        {statCards.map((stat) => (
          <div
            key={stat.title}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className={`${stat.color} rounded-md p-3`}>
                  <span className="text-2xl">{stat.icon}</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.title}
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {stat.value.toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* System Health */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">System Health</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center">
              <span className="text-2xl mr-3">🗄️</span>
              <div>
                <p className="text-sm font-medium text-gray-700">Database</p>
                <p className="text-xs text-gray-500">PostgreSQL</p>
              </div>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${getHealthColor(
                stats.systemHealth.database
              )}`}
            >
              {stats.systemHealth.database}
            </span>
          </div>
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center">
              <span className="text-2xl mr-3">⚡</span>
              <div>
                <p className="text-sm font-medium text-gray-700">Redis</p>
                <p className="text-xs text-gray-500">Cache</p>
              </div>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${getHealthColor(
                stats.systemHealth.redis
              )}`}
            >
              {stats.systemHealth.redis}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <a
            href="/admin/users"
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <h3 className="font-medium text-gray-900">Manage Users</h3>
            <p className="text-sm text-gray-500 mt-1">View and manage user accounts</p>
          </a>
          <a
            href="/admin/analytics"
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <h3 className="font-medium text-gray-900">View Analytics</h3>
            <p className="text-sm text-gray-500 mt-1">System usage and activity metrics</p>
          </a>
          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="font-medium text-gray-900">Audit Logs</h3>
            <p className="text-sm text-gray-500 mt-1">Coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
}
