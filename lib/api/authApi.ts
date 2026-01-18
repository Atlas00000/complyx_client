const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
  organizationId?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  user: {
    id: string;
    email: string;
    name: string | null;
    emailVerified: boolean;
    roleId: string | null;
    organizationId: string | null;
    role: {
      name: string;
      permissions: Array<{
        id: string;
        name: string;
        resource: string;
        action: string;
      }>;
    } | null;
  };
  sessionId: string;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  emailVerified: boolean;
  roleId: string | null;
  organizationId: string | null;
  role?: {
    name: string;
    permissions: Array<{
      id: string;
      name: string;
      resource: string;
      action: string;
    }>;
  } | null;
  permissions?: Array<{
    id: string;
    name: string;
    resource: string;
    action: string;
  }>;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

/**
 * Get stored access token
 */
export const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
};

/**
 * Get stored refresh token
 */
export const getRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('refreshToken');
};

/**
 * Store tokens
 */
export const storeTokens = (accessToken: string, refreshToken: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

/**
 * Clear tokens
 */
export const clearTokens = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};

/**
 * Store user data
 */
export const storeUser = (user: User): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('user', JSON.stringify(user));
};

/**
 * Get stored user data
 */
export const getStoredUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

/**
 * Register a new user
 */
export const register = async (data: RegisterRequest): Promise<{ message: string; user: User }> => {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Registration failed');
  }

  return response.json();
};

/**
 * Login user
 */
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Login failed');
  }

  const result: LoginResponse = await response.json();
  
  // Store tokens and user
  storeTokens(result.tokens.accessToken, result.tokens.refreshToken);
  storeUser(result.user);

  return result;
};

/**
 * Logout user
 */
export const logout = async (sessionId?: string): Promise<void> => {
  const token = getAccessToken();
  
  if (token) {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sessionId }),
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  clearTokens();
};

/**
 * Get current user
 */
export const getCurrentUser = async (): Promise<User> => {
  const token = getAccessToken();
  
  if (!token) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(`${API_URL}/api/auth/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      clearTokens();
      throw new Error('Session expired');
    }
    const error = await response.json();
    throw new Error(error.error || 'Failed to get user');
  }

  const result = await response.json();
  storeUser(result.user);
  return result.user;
};

/**
 * Verify email
 */
export const verifyEmail = async (token: string): Promise<{ message: string; user: User }> => {
  const response = await fetch(`${API_URL}/api/auth/verify-email?token=${token}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Email verification failed');
  }

  return response.json();
};

/**
 * Forgot password
 */
export const forgotPassword = async (data: ForgotPasswordRequest): Promise<{ message: string }> => {
  const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to send password reset email');
  }

  return response.json();
};

/**
 * Reset password
 */
export const resetPassword = async (data: ResetPasswordRequest): Promise<{ message: string }> => {
  const response = await fetch(`${API_URL}/api/auth/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Password reset failed');
  }

  return response.json();
};

/**
 * Refresh access token
 */
export const refreshToken = async (): Promise<{ tokens: { accessToken: string; refreshToken: string } }> => {
  const refreshTokenValue = getRefreshToken();
  
  if (!refreshTokenValue) {
    throw new Error('No refresh token available');
  }

  const response = await fetch(`${API_URL}/api/auth/refresh-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken: refreshTokenValue }),
  });

  if (!response.ok) {
    clearTokens();
    throw new Error('Token refresh failed');
  }

  const result = await response.json();
  storeTokens(result.tokens.accessToken, result.tokens.refreshToken);
  return result;
};

/**
 * Make authenticated API request
 */
export const authenticatedFetch = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = getAccessToken();
  
  if (!token) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  // If token expired, try to refresh
  if (response.status === 401) {
    try {
      await refreshToken();
      const newToken = getAccessToken();
      if (newToken) {
        return fetch(url, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${newToken}`,
            ...options.headers,
          },
        });
      }
    } catch (error) {
      clearTokens();
      throw new Error('Session expired');
    }
  }

  return response;
};
