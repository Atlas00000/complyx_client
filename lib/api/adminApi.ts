import { authenticatedFetch } from './authApi';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface AdminStats {
  totalUsers: number;
  totalOrganizations: number;
  totalAssessments: number;
  activeUsers: number;
  recentRegistrations: number;
  systemHealth: {
    database: 'healthy' | 'degraded' | 'down';
    redis: 'healthy' | 'degraded' | 'down';
  };
}

export interface UserManagementData {
  id: string;
  email: string;
  name: string | null;
  emailVerified: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  organizationId: string | null;
  roleId: string | null;
  organization?: {
    id: string;
    name: string;
  } | null;
  role?: {
    id: string;
    name: string;
  } | null;
}

export interface UsersResponse {
  users: UserManagementData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  roleId?: string;
  organizationId?: string;
  emailVerified?: boolean;
}

export interface SystemAnalytics {
  userActivity: {
    registrations: Array<{ date: string; count: number }>;
    logins: Array<{ date: string; count: number }>;
  };
  assessmentActivity: {
    created: Array<{ date: string; count: number }>;
    completed: Array<{ date: string; count: number }>;
  };
  topUsers: Array<{
    userId: string;
    email: string;
    name: string | null;
    assessmentCount: number;
    lastActivity: Date | null;
  }>;
}

export interface AuditLogEntry {
  id: string;
  userId: string | null;
  organizationId: string | null;
  action: string;
  resource: string;
  resourceId: string | null;
  details: Record<string, any> | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
}

export interface AuditLogsResponse {
  logs: AuditLogEntry[];
  total: number;
}

/**
 * Get admin dashboard statistics
 */
export const getAdminStats = async (): Promise<AdminStats> => {
  const response = await authenticatedFetch(`${API_URL}/api/admin/stats`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get admin stats');
  }

  return response.json();
};

/**
 * Get all users with pagination
 */
export const getUsers = async (
  page: number = 1,
  limit: number = 20,
  search?: string,
  organizationId?: string,
  roleId?: string
): Promise<UsersResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (search) params.append('search', search);
  if (organizationId) params.append('organizationId', organizationId);
  if (roleId) params.append('roleId', roleId);

  const response = await authenticatedFetch(`${API_URL}/api/admin/users?${params.toString()}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get users');
  }

  return response.json();
};

/**
 * Get user by ID
 */
export const getUserById = async (userId: string): Promise<UserManagementData> => {
  const response = await authenticatedFetch(`${API_URL}/api/admin/users/${userId}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get user');
  }

  return response.json();
};

/**
 * Update user (admin)
 */
export const updateUser = async (
  userId: string,
  data: UpdateUserData
): Promise<UserManagementData> => {
  const response = await authenticatedFetch(`${API_URL}/api/admin/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update user');
  }

  return response.json();
};

/**
 * Delete user (admin)
 */
export const deleteUser = async (userId: string): Promise<void> => {
  const response = await authenticatedFetch(`${API_URL}/api/admin/users/${userId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete user');
  }
};

/**
 * Get system analytics
 */
export const getSystemAnalytics = async (): Promise<SystemAnalytics> => {
  const response = await authenticatedFetch(`${API_URL}/api/admin/analytics`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get analytics');
  }

  return response.json();
};

/**
 * Get audit logs
 */
export const getAuditLogs = async (
  page: number = 1,
  limit: number = 50,
  filters?: {
    userId?: string;
    organizationId?: string;
    resource?: string;
    action?: string;
    startDate?: Date;
    endDate?: Date;
  }
): Promise<AuditLogsResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (filters) {
    if (filters.userId) params.append('userId', filters.userId);
    if (filters.organizationId) params.append('organizationId', filters.organizationId);
    if (filters.resource) params.append('resource', filters.resource);
    if (filters.action) params.append('action', filters.action);
    if (filters.startDate) params.append('startDate', filters.startDate.toISOString());
    if (filters.endDate) params.append('endDate', filters.endDate.toISOString());
  }

  const response = await authenticatedFetch(`${API_URL}/api/admin/audit-logs?${params.toString()}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get audit logs');
  }

  return response.json();
};

/**
 * Get organizations
 */
export const getOrganizations = async (
  page: number = 1,
  limit: number = 20
): Promise<{
  organizations: Array<{
    id: string;
    name: string;
    slug: string;
    description: string | null;
    userCount: number;
    createdAt: Date;
  }>;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  const response = await authenticatedFetch(`${API_URL}/api/admin/organizations?${params.toString()}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get organizations');
  }

  return response.json();
};
