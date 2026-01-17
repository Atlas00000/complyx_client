const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface SearchResult {
  id: string;
  text: string;
  score: number;
  metadata: {
    documentId: string;
    section?: string;
    title?: string;
    source?: string;
    url?: string;
    chunkIndex?: number;
  };
}

export interface SearchResponse {
  results: SearchResult[];
  totalResults: number;
  query: string;
  processingTimeMs?: number;
}

export interface RAGContext {
  query: string;
  relevantDocuments: Array<{
    text: string;
    metadata: {
      documentId: string;
      section?: string;
      title?: string;
      source?: string;
      url?: string;
    };
    score: number;
  }>;
  contextText: string;
}

export interface RAGResponse {
  response: string;
  context: RAGContext;
  citations: string[];
  model: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 's1' | 's2' | 'governance' | 'strategy' | 'risk' | 'metrics' | 'compliance' | 'implementation';
  tags: string[];
  relatedQuestions?: string[];
  source?: string;
  url?: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'guide' | 'video' | 'article' | 'standard' | 'tool';
  url: string;
  category: 'general' | 's1' | 's2' | 'governance' | 'strategy' | 'risk' | 'metrics' | 'compliance' | 'implementation';
  tags: string[];
  source?: string;
  author?: string;
  publishedDate?: string;
}

/**
 * Knowledge Base API client
 */
export class KnowledgeAPI {
  /**
   * Perform semantic search
   */
  static async search(
    query: string,
    topK?: number,
    minScore?: number,
    filter?: {
      documentId?: string;
      section?: string;
      source?: string;
    }
  ): Promise<SearchResponse> {
    const response = await fetch(`${API_BASE_URL}/api/knowledge/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, topK, minScore, filter }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `Failed to search: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Generate RAG response
   */
  static async rag(
    query: string,
    conversationHistory?: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
    topK?: number,
    minScore?: number
  ): Promise<RAGResponse> {
    const response = await fetch(`${API_BASE_URL}/api/knowledge/rag`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, conversationHistory, topK, minScore }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `Failed to generate RAG response: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get all FAQs or search FAQs
   */
  static async getFAQs(query?: string, category?: string): Promise<{ faqs: FAQItem[]; totalResults: number }> {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (category) params.append('category', category);

    const url = `${API_BASE_URL}/api/knowledge/faqs${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `Failed to get FAQs: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get FAQ by ID
   */
  static async getFAQ(id: string): Promise<{ faq: FAQItem; related: FAQItem[] }> {
    const response = await fetch(`${API_BASE_URL}/api/knowledge/faqs/${id}`);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `Failed to get FAQ: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get all resources or search resources
   */
  static async getResources(query?: string, category?: string, type?: string): Promise<{ resources: Resource[]; totalResults: number }> {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (category) params.append('category', category);
    if (type) params.append('type', type);

    const url = `${API_BASE_URL}/api/knowledge/resources${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `Failed to get resources: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get resource by ID
   */
  static async getResource(id: string): Promise<Resource> {
    const response = await fetch(`${API_BASE_URL}/api/knowledge/resources/${id}`);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `Failed to get resource: ${response.statusText}`);
    }

    return response.json();
  }
}
