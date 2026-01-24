import { create } from 'zustand';
import * as adminApi from '../lib/api/adminApi';
import type {
  AdminStats,
  UserManagementData,
  SystemAnalytics,
  AuditLogsResponse,
} from '../lib/api/adminApi';

interface AdminState {
  stats: AdminStats | null;
  users: UserManagementData[];
  usersPagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null;
  analytics: SystemAnalytics | null;
  auditLogs: AuditLogsResponse | null;
  
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchStats: () => Promise<void>;
  fetchUsers: (page?: number, limit?: number, search?: string, organizationId?: string, roleId?: string) => Promise<void>;
  updateUser: (userId: string, data: adminApi.UpdateUserData) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  fetchAnalytics: () => Promise<void>;
  fetchAuditLogs: (page?: number, limit?: number, filters?: any) => Promise<void>;
  clearError: () => void;
}

export const useAdminStore = create<AdminState>((set, _get) => ({
  stats: null,
  users: [],
  usersPagination: null,
  analytics: null,
  auditLogs: null,
  isLoading: false,
  error: null,

  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const stats = await adminApi.getAdminStats();
      set({ stats, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch stats',
      });
    }
  },

  fetchUsers: async (page = 1, limit = 20, search, organizationId, roleId) => {
    set({ isLoading: true, error: null });
    try {
      const result = await adminApi.getUsers(page, limit, search, organizationId, roleId);
      set({
        users: result.users,
        usersPagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        },
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch users',
      });
    }
  },

  updateUser: async (userId, data) => {
    set({ isLoading: true, error: null });
    try {
      const updatedUser = await adminApi.updateUser(userId, data);
      set((state) => ({
        users: state.users.map((u) => (u.id === userId ? updatedUser : u)),
        isLoading: false,
      }));
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to update user',
      });
      throw error;
    }
  },

  deleteUser: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      await adminApi.deleteUser(userId);
      set((state) => ({
        users: state.users.filter((u) => u.id !== userId),
        isLoading: false,
      }));
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to delete user',
      });
      throw error;
    }
  },

  fetchAnalytics: async () => {
    set({ isLoading: true, error: null });
    try {
      const analytics = await adminApi.getSystemAnalytics();
      set({ analytics, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch analytics',
      });
    }
  },

  fetchAuditLogs: async (page = 1, limit = 50, filters) => {
    set({ isLoading: true, error: null });
    try {
      const result = await adminApi.getAuditLogs(page, limit, filters);
      set({ auditLogs: result, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch audit logs',
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
