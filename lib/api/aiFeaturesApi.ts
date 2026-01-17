const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: 'governance' | 'strategy' | 'risk' | 'metrics';
  priority: 'critical' | 'high' | 'medium' | 'low';
  actionItems: string[];
  relatedGaps: string[];
  estimatedEffort: 'low' | 'medium' | 'high';
  impact: 'high' | 'medium' | 'low';
}

export interface PersonalizedRecommendations {
  userId: string;
  assessmentId: string;
  recommendations: Recommendation[];
  prioritizedActions: Recommendation[];
  categoryBreakdown: {
    governance: Recommendation[];
    strategy: Recommendation[];
    risk: Recommendation[];
    metrics: Recommendation[];
  };
  nextSteps: string[];
}

export interface Citation {
  id: string;
  source: string;
  title: string;
  url?: string;
  section?: string;
  page?: string;
  relevance: number;
}

export interface CitationReference {
  citationId: string;
  text: string;
  startIndex?: number;
  endIndex?: number;
}

export interface ConfidenceScore {
  overall: number;
  factors: {
    sourceQuality: number;
    answerCompleteness: number;
    factuality: number;
    relevance: number;
  };
}

export interface AIResponseWithCitations {
  content: string;
  citations: Citation[];
  references: CitationReference[];
  confidence: ConfidenceScore;
  sources: string[];
}

export interface IndustryGuidance {
  industry: string;
  guidance: string;
  specificRecommendations: string[];
  bestPractices: string[];
  commonPitfalls: string[];
  resources: string[];
}

export interface ContextualGuidance {
  guidance: string;
  recommendations: string[];
  examples: string[];
  nextSteps: string[];
}

/**
 * AI Features API client
 */
export class AIFeaturesAPI {
  /**
   * Generate personalized recommendations
   */
  static async getRecommendations(
    assessmentId: string,
    answers: Array<{ questionId: string; value: string }>,
    ifrsStandard: 'S1' | 'S2',
    userId?: string,
    industry?: string
  ): Promise<PersonalizedRecommendations> {
    const response = await fetch(`${API_BASE_URL}/api/ai/recommendations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        assessmentId,
        userId,
        answers,
        ifrsStandard,
        industry,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `Failed to get recommendations: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Extract citations from text
   */
  static async getCitations(
    text: string,
    mentionedRequirements?: string[]
  ): Promise<AIResponseWithCitations> {
    const response = await fetch(`${API_BASE_URL}/api/ai/citations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, mentionedRequirements }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `Failed to get citations: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get industry-specific guidance
   */
  static async getIndustryGuidance(industry: string): Promise<IndustryGuidance> {
    const response = await fetch(`${API_BASE_URL}/api/ai/guidance/industry/${industry}`);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `Failed to get industry guidance: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get contextual guidance based on assessment state
   */
  static async getContextualGuidance(
    industry: string,
    answers: Array<{ questionId: string; value: string }>,
    ifrsStandard: 'S1' | 'S2',
    progress?: number
  ): Promise<ContextualGuidance> {
    const response = await fetch(`${API_BASE_URL}/api/ai/guidance/contextual`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        industry,
        answers,
        ifrsStandard,
        progress,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `Failed to get contextual guidance: ${response.statusText}`);
    }

    return response.json();
  }
}
