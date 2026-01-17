const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface RequirementStatus {
  requirementId: string;
  code: string;
  title: string;
  category: 'governance' | 'strategy' | 'risk' | 'metrics';
  compliant: boolean;
  score: number;
  answeredQuestions: number;
  totalQuestions: number;
  level: 'foundational' | 'enhanced' | 'disclosure';
  mandatory: boolean;
}

export interface ComplianceMatrix {
  ifrsStandard: 'S1' | 'S2';
  overallCompliance: number;
  requirementStatuses: RequirementStatus[];
  categoryBreakdown: {
    governance: { compliant: number; total: number; score: number };
    strategy: { compliant: number; total: number; score: number };
    risk: { compliant: number; total: number; score: number };
    metrics: { compliant: number; total: number; score: number };
  };
}

export interface ComplianceGap {
  requirementId: string;
  code: string;
  title: string;
  category: 'governance' | 'strategy' | 'risk' | 'metrics';
  gap: number; // Percentage gap (0-100)
  severity: 'critical' | 'high' | 'medium' | 'low';
  mandatory: boolean;
  recommendations: string[];
}

export interface GapAnalysis {
  ifrsStandard: 'S1' | 'S2';
  overallGap: number;
  criticalGaps: ComplianceGap[];
  highGaps: ComplianceGap[];
  mediumGaps: ComplianceGap[];
  lowGaps: ComplianceGap[];
  byCategory: {
    governance: ComplianceGap[];
    strategy: ComplianceGap[];
    risk: ComplianceGap[];
    metrics: ComplianceGap[];
  };
  priorityActions: string[];
}

export interface IndustryContext {
  name: string;
  specificRisks: string[];
  keyMetrics: string[];
  additionalRequirements: string[];
}

/**
 * Compliance API client
 */
export class ComplianceAPI {
  /**
   * Generate compliance matrix
   */
  static async getComplianceMatrix(
    ifrsStandard: 'S1' | 'S2',
    answers: Array<{ questionId: string; value: string }>
  ): Promise<ComplianceMatrix> {
    const response = await fetch(`${API_BASE_URL}/api/compliance/matrix`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ifrsStandard, answers }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `Failed to get compliance matrix: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Identify compliance gaps
   */
  static async identifyGaps(
    ifrsStandard: 'S1' | 'S2',
    answers: Array<{ questionId: string; value: string }>
  ): Promise<GapAnalysis> {
    const response = await fetch(`${API_BASE_URL}/api/compliance/gaps`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ifrsStandard, answers }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `Failed to identify gaps: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get supported industries
   */
  static async getIndustries(): Promise<string[]> {
    const response = await fetch(`${API_BASE_URL}/api/compliance/industries`);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `Failed to get industries: ${response.statusText}`);
    }

    const data = await response.json();
    return data.industries;
  }

  /**
   * Get industry-specific context
   */
  static async getIndustryContext(industry: string): Promise<IndustryContext> {
    const response = await fetch(`${API_BASE_URL}/api/compliance/industry/${industry}`);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `Failed to get industry context: ${response.statusText}`);
    }

    return response.json();
  }
}
