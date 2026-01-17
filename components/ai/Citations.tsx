'use client';

import { useEffect, useState } from 'react';
import { AIFeaturesAPI, AIResponseWithCitations, Citation } from '@/lib/api/aiFeaturesApi';

interface CitationsProps {
  text: string;
  mentionedRequirements?: string[];
  showConfidence?: boolean;
}

export function Citations({ text, mentionedRequirements, showConfidence = true }: CitationsProps) {
  const [citations, setCitations] = useState<AIResponseWithCitations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCitations = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await AIFeaturesAPI.getCitations(text, mentionedRequirements);
        setCitations(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load citations');
      } finally {
        setLoading(false);
      }
    };

    if (text) {
      loadCitations();
    }
  }, [text, mentionedRequirements]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-sm text-gray-500">Loading citations...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
        <div className="text-sm text-red-800">Error: {error}</div>
      </div>
    );
  }

  if (!citations || citations.citations.length === 0) {
    return null;
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-4">
      {/* Confidence Score */}
      {showConfidence && citations.confidence && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">Confidence Score</span>
            <span className={`text-lg font-bold ${getConfidenceColor(citations.confidence.overall)}`}>
              {citations.confidence.overall}%
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
            <div>
              <span className="font-medium">Source Quality:</span> {citations.confidence.factors.sourceQuality}%
            </div>
            <div>
              <span className="font-medium">Completeness:</span> {citations.confidence.factors.answerCompleteness}%
            </div>
            <div>
              <span className="font-medium">Factuality:</span> {citations.confidence.factors.factuality}%
            </div>
            <div>
              <span className="font-medium">Relevance:</span> {citations.confidence.factors.relevance}%
            </div>
          </div>
        </div>
      )}

      {/* Citations List */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Sources</h4>
        <div className="space-y-3">
          {citations.citations.map((citation, index) => (
            <div key={citation.id} className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-semibold">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-gray-900 mb-1">
                    {citation.title}
                    {citation.section && (
                      <span className="text-xs text-gray-500 ml-2">({citation.section})</span>
                    )}
                  </div>
                  <div className="text-xs text-gray-600 mb-1">{citation.source}</div>
                  {citation.url && (
                    <a
                      href={citation.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline"
                    >
                      View Source →
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Citation Badge Component
 * Displays a small citation badge that can be embedded in text
 */
interface CitationBadgeProps {
  citation: Citation;
  index: number;
  onClick?: () => void;
}

export function CitationBadge({ citation, index, onClick }: CitationBadgeProps) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center justify-center w-5 h-5 bg-primary/10 text-primary rounded-full text-xs font-semibold hover:bg-primary/20 transition-colors cursor-pointer"
      title={citation.title}
    >
      {index + 1}
    </button>
  );
}
