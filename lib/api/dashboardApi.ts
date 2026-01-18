const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface CategoryScore {
  category: string;
  score: number;
  maxScore: number;
  percentage: number;
  answeredCount: number;
  totalCount: number;
}

export interface AssessmentScore {
  overallScore: number;
  overallPercentage: number;
  categoryScores: CategoryScore[];
  totalAnswered: number;
  totalQuestions: number;
}

export interface ProgressData {
  answeredCount: number;
  totalCount: number;
  percentage: number;
  phase?: 'quick' | 'detailed' | 'followup';
}

export interface ComplianceMatrix {
  ifrsStandard: 'S1' | 'S2';
  overallCompliance: number;
  requirements: Array<{
    requirementId: string;
    code: string;
    title: string;
    category: string;
    compliant: boolean;
    score: number;
    answeredQuestions: number;
    totalQuestions: number;
    level: 'core' | 'enhanced';
    mandatory: boolean;
  }>;
  byCategory: {
    governance: { compliant: number; total: number; score: number };
    strategy: { compliant: number; total: number; score: number };
    risk: { compliant: number; total: number; score: number };
    metrics: { compliant: number; total: number; score: number };
  };
}

export interface GapAnalysis {
  ifrsStandard: 'S1' | 'S2';
  overallGap: number;
  criticalGaps: Array<{
    requirementId: string;
    code: string;
    title: string;
    category: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    score: number;
    gap: number;
    answeredQuestions: number;
    totalQuestions: number;
    missingAnswers: string[];
    recommendations: string[];
    mandatory: boolean;
  }>;
  highGaps: Array<any>;
  mediumGaps: Array<any>;
  lowGaps: Array<any>;
  byCategory: {
    governance: Array<any>;
    strategy: Array<any>;
    risk: Array<any>;
    metrics: Array<any>;
  };
  priorityActions: string[];
}

export interface DashboardData {
  userId: string;
  assessmentId?: string;
  readinessScore: AssessmentScore;
  progress: ProgressData;
  complianceMatrix: ComplianceMatrix;
  gapAnalysis: GapAnalysis;
  recentActivity: Array<{
    id: string;
    action: string;
    timestamp: Date | string;
    assessmentId?: string;
  }>;
  historicalTrends?: {
    assessments: Array<{
      id: string;
      createdAt: Date | string;
      score: number;
      progress: number;
    }>;
  };
}

export interface GetDashboardDataParams {
  userId?: string;
  assessmentId?: string;
}

export interface GetReadinessScoreParams {
  userId?: string;
  assessmentId?: string;
}

export interface GetProgressParams {
  userId?: string;
  assessmentId?: string;
}

export interface GetGapAnalysisParams {
  userId?: string;
  assessmentId?: string;
  ifrsStandard?: 'S1' | 'S2';
}

export interface GetComplianceMatrixParams {
  userId?: string;
  assessmentId?: string;
  ifrsStandard?: 'S1' | 'S2';
}

/**
 * Dashboard API Client
 * Fetches dashboard data from the backend
 */
export class DashboardAPI {
  /**
   * Get comprehensive dashboard data (all metrics)
   */
  static async getDashboardData(params?: GetDashboardDataParams): Promise<DashboardData> {
    const queryParams = new URLSearchParams();
    if (params?.assessmentId) {
      queryParams.append('assessmentId', params.assessmentId);
    }

    const url = params?.userId
      ? `${API_URL}/api/dashboard/user/${params.userId}/data?${queryParams.toString()}`
      : `${API_URL}/api/dashboard/data?${queryParams.toString()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to get dashboard data: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  }

  /**
   * Get readiness score only (lightweight endpoint)
   */
  static async getReadinessScore(params?: GetReadinessScoreParams): Promise<AssessmentScore> {
    const queryParams = new URLSearchParams();
    if (params?.assessmentId) {
      queryParams.append('assessmentId', params.assessmentId);
    }

    const url = params?.userId
      ? `${API_URL}/api/dashboard/user/${params.userId}/score?${queryParams.toString()}`
      : `${API_URL}/api/dashboard/score?${queryParams.toString()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to get readiness score: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  }

  /**
   * Get progress data only (lightweight endpoint)
   */
  static async getProgress(params?: GetProgressParams): Promise<ProgressData> {
    const queryParams = new URLSearchParams();
    if (params?.assessmentId) {
      queryParams.append('assessmentId', params.assessmentId);
    }

    const url = params?.userId
      ? `${API_URL}/api/dashboard/user/${params.userId}/progress?${queryParams.toString()}`
      : `${API_URL}/api/dashboard/progress?${queryParams.toString()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to get progress: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  }

  /**
   * Get gap analysis only (lightweight endpoint)
   */
  static async getGapAnalysis(params?: GetGapAnalysisParams): Promise<GapAnalysis> {
    const queryParams = new URLSearchParams();
    if (params?.assessmentId) {
      queryParams.append('assessmentId', params.assessmentId);
    }
    if (params?.ifrsStandard) {
      queryParams.append('ifrsStandard', params.ifrsStandard);
    }

    const url = params?.userId
      ? `${API_URL}/api/dashboard/user/${params.userId}/gaps?${queryParams.toString()}`
      : `${API_URL}/api/dashboard/gaps?${queryParams.toString()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to get gap analysis: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  }

  /**
   * Get compliance matrix only (lightweight endpoint)
   */
  static async getComplianceMatrix(params?: GetComplianceMatrixParams): Promise<ComplianceMatrix> {
    const queryParams = new URLSearchParams();
    if (params?.assessmentId) {
      queryParams.append('assessmentId', params.assessmentId);
    }
    if (params?.ifrsStandard) {
      queryParams.append('ifrsStandard', params.ifrsStandard);
    }

    const url = params?.userId
      ? `${API_URL}/api/dashboard/user/${params.userId}/compliance?${queryParams.toString()}`
      : `${API_URL}/api/dashboard/compliance?${queryParams.toString()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to get compliance matrix: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  }
}
