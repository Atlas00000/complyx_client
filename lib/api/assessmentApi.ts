const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface AnswerData {
  questionId: string;
  value: string;
}

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

export interface CalculateScoresRequest {
  answers: AnswerData[];
  ifrsStandard?: 'S1' | 'S2';
  phase?: 'quick' | 'detailed' | 'followup';
  assessmentId?: string;
}

export interface CalculateProgressRequest {
  answeredQuestions: string[];
  ifrsStandard?: 'S1' | 'S2';
  phase?: 'quick' | 'detailed' | 'followup';
}

export interface SaveSessionRequest {
  assessmentId: string;
  userId: string;
  answers: AnswerData[];
  progress: number;
  status?: 'in_progress' | 'completed' | 'paused';
  ifrsStandard?: 'S1' | 'S2';
  phase?: 'quick' | 'detailed' | 'followup';
}

export interface AutoSaveRequest {
  assessmentId: string;
  answers: AnswerData[];
  progress: number;
}

export class AssessmentAPI {
  /**
   * Calculate assessment scores
   */
  static async calculateScores(request: CalculateScoresRequest): Promise<AssessmentScore> {
    const response = await fetch(`${API_URL}/api/assessment/scores/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Failed to calculate scores: ${response.statusText}`);
    }

    const data = await response.json();
    return data.scores;
  }

  /**
   * Get scores for an assessment
   */
  static async getScores(assessmentId: string): Promise<CategoryScore[]> {
    const response = await fetch(`${API_URL}/api/assessment/scores/${assessmentId}`);
    if (!response.ok) {
      throw new Error(`Failed to get scores: ${response.statusText}`);
    }

    const data = await response.json();
    return data.scores;
  }

  /**
   * Calculate assessment progress
   */
  static async calculateProgress(request: CalculateProgressRequest): Promise<ProgressData> {
    const response = await fetch(`${API_URL}/api/assessment/progress/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Failed to calculate progress: ${response.statusText}`);
    }

    const data = await response.json();
    return data.progress;
  }

  /**
   * Update assessment progress
   */
  static async updateProgress(assessmentId: string, progress: number): Promise<void> {
    const response = await fetch(`${API_URL}/api/assessment/progress/${assessmentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ progress }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update progress: ${response.statusText}`);
    }
  }

  /**
   * Save assessment session
   */
  static async saveSession(request: SaveSessionRequest): Promise<void> {
    const response = await fetch(`${API_URL}/api/assessment/session/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Failed to save session: ${response.statusText}`);
    }
  }

  /**
   * Restore assessment session
   */
  static async restoreSession(assessmentId: string): Promise<{
    assessmentId: string;
    answers: AnswerData[];
    progress: number;
    status: string;
    ifrsStandard?: string;
    phase?: string;
  }> {
    const response = await fetch(`${API_URL}/api/assessment/session/${assessmentId}`);
    if (!response.ok) {
      throw new Error(`Failed to restore session: ${response.statusText}`);
    }

    const data = await response.json();
    return data.session;
  }

  /**
   * Auto-save assessment
   */
  static async autoSave(request: AutoSaveRequest): Promise<void> {
    const response = await fetch(`${API_URL}/api/assessment/session/autosave`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Failed to auto-save: ${response.statusText}`);
    }
  }

  /**
   * Mark assessment as completed
   */
  static async completeAssessment(assessmentId: string): Promise<void> {
    const response = await fetch(`${API_URL}/api/assessment/${assessmentId}/complete`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(`Failed to complete assessment: ${response.statusText}`);
    }
  }

  /**
   * Pause assessment
   */
  static async pauseAssessment(assessmentId: string): Promise<void> {
    const response = await fetch(`${API_URL}/api/assessment/${assessmentId}/pause`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(`Failed to pause assessment: ${response.statusText}`);
    }
  }

  /**
   * Resume assessment
   */
  static async resumeAssessment(assessmentId: string): Promise<void> {
    const response = await fetch(`${API_URL}/api/assessment/${assessmentId}/resume`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(`Failed to resume assessment: ${response.statusText}`);
    }
  }
}
