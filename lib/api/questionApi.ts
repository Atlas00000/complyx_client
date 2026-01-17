const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface Question {
  id: string;
  text: string;
  type: string;
  options: string | null;
  ifrsStandard: string;
  requirement: string | null;
  weight: number;
  order: number;
  phase: string;
  isActive: boolean;
  skipLogic: string | null;
  category: {
    id: string;
    name: string;
    description: string | null;
  };
}

export interface QuestionCategory {
  id: string;
  name: string;
  description: string | null;
}

export interface NextQuestionRequest {
  answeredQuestions?: string[];
  answeredAnswers?: Array<{ questionId: string; value: string }>;
  ifrsStandard?: 'S1' | 'S2';
  phase?: 'quick' | 'detailed' | 'followup';
}

export interface NextQuestionResponse {
  question: Question | null;
  formattedQuestion: string;
  message?: string;
  currentPhase?: 'quick' | 'detailed' | 'followup';
}

export interface ProgressRequest {
  answeredQuestions?: string[];
  ifrsStandard?: 'S1' | 'S2';
}

export interface ProgressResponse {
  progress: number;
}

export interface PhaseInfo {
  phase: 'quick' | 'detailed' | 'followup';
  name: string;
  description: string;
  questionCount: number;
  estimatedTime: string;
}

export class QuestionAPI {
  /**
   * Get all questions with optional filters
   */
  static async getQuestions(filters?: {
    category?: string;
    ifrsStandard?: 'S1' | 'S2';
    isActive?: boolean;
  }): Promise<Question[]> {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.ifrsStandard) params.append('ifrsStandard', filters.ifrsStandard);
    if (filters?.isActive !== undefined) params.append('isActive', String(filters.isActive));

    const response = await fetch(`${API_URL}/api/questions?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch questions: ${response.statusText}`);
    }

    const data = await response.json();
    return data.questions;
  }

  /**
   * Get question by ID
   */
  static async getQuestionById(id: string): Promise<Question> {
    const response = await fetch(`${API_URL}/api/questions/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch question: ${response.statusText}`);
    }

    const data = await response.json();
    return data.question;
  }

  /**
   * Get all question categories
   */
  static async getCategories(): Promise<QuestionCategory[]> {
    const response = await fetch(`${API_URL}/api/questions/categories`);
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }

    const data = await response.json();
    return data.categories;
  }

  /**
   * Get next question using adaptive questioning
   */
  static async getNextQuestion(request: NextQuestionRequest): Promise<NextQuestionResponse> {
    const response = await fetch(`${API_URL}/api/questions/next`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Failed to get next question: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get assessment progress
   */
  static async getProgress(request: ProgressRequest): Promise<ProgressResponse> {
    const response = await fetch(`${API_URL}/api/questions/progress`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Failed to get progress: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get phase information
   */
  static async getPhaseInfo(ifrsStandard?: 'S1' | 'S2'): Promise<PhaseInfo[]> {
    const params = new URLSearchParams();
    if (ifrsStandard) params.append('ifrsStandard', ifrsStandard);

    const response = await fetch(`${API_URL}/api/questions/phases?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch phase info: ${response.statusText}`);
    }

    const data = await response.json();
    return data.phases;
  }

  /**
   * Get questions for a specific phase
   */
  static async getPhaseQuestions(
    phase: 'quick' | 'detailed' | 'followup',
    ifrsStandard?: 'S1' | 'S2'
  ): Promise<Question[]> {
    const params = new URLSearchParams();
    if (ifrsStandard) params.append('ifrsStandard', ifrsStandard);

    const response = await fetch(`${API_URL}/api/questions/phases/${phase}?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch phase questions: ${response.statusText}`);
    }

    const data = await response.json();
    return data.questions;
  }
}
