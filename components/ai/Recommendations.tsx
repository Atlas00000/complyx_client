'use client';

import { useEffect, useState } from 'react';
import { AIFeaturesAPI, PersonalizedRecommendations, Recommendation } from '@/lib/api/aiFeaturesApi';

interface RecommendationsProps {
  assessmentId: string;
  answers: Array<{ questionId: string; value: string }>;
  ifrsStandard: 'S1' | 'S2';
  userId?: string;
  industry?: string;
  onRecommendationClick?: (recommendation: Recommendation) => void;
}

export function Recommendations({
  assessmentId,
  answers,
  ifrsStandard,
  userId,
  industry,
  onRecommendationClick,
}: RecommendationsProps) {
  const [recommendations, setRecommendations] = useState<PersonalizedRecommendations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await AIFeaturesAPI.getRecommendations(
          assessmentId,
          answers,
          ifrsStandard,
          userId,
          industry
        );
        setRecommendations(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load recommendations');
      } finally {
        setLoading(false);
      }
    };

    if (answers.length > 0) {
      loadRecommendations();
    }
  }, [assessmentId, answers, ifrsStandard, userId, industry]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading recommendations...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="text-red-800">Error: {error}</div>
      </div>
    );
  }

  if (!recommendations || recommendations.recommendations.length === 0) {
    return (
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="text-gray-600">No recommendations available</div>
      </div>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-500';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-500';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-500';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-500';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-500';
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const categories = ['governance', 'strategy', 'risk', 'metrics'] as const;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Personalized Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          {categories.map((category) => {
            const categoryRecs = recommendations.categoryBreakdown[category];
            return (
              <div key={category} className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-600 mb-1 capitalize">{category}</div>
                <div className="text-2xl font-bold text-gray-900">{categoryRecs.length}</div>
              </div>
            );
          })}
        </div>
        {recommendations.nextSteps.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Next Steps</h4>
            <ul className="space-y-1">
              {recommendations.nextSteps.map((step, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Prioritized Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Prioritized Actions</h3>
        <div className="space-y-4">
          {recommendations.prioritizedActions.map((recommendation) => (
            <div
              key={recommendation.id}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                onRecommendationClick ? 'hover:bg-gray-50' : ''
              } ${getPriorityColor(recommendation.priority)}`}
              onClick={() => onRecommendationClick?.(recommendation)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{recommendation.title}</span>
                    <span className={`text-xs px-2 py-0.5 rounded border ${getPriorityColor(recommendation.priority)}`}>
                      {recommendation.priority}
                    </span>
                  </div>
                  <div className="text-sm mb-2">{recommendation.description}</div>
                  {recommendation.actionItems.length > 0 && (
                    <ul className="space-y-1 mt-2">
                      {recommendation.actionItems.map((item, index) => (
                        <li key={index} className="text-xs flex items-start gap-2">
                          <span className="mt-0.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4 mt-3 text-xs">
                <span>
                  <span className="text-gray-600">Category:</span>{' '}
                  <span className="font-medium capitalize">{recommendation.category}</span>
                </span>
                <span>
                  <span className="text-gray-600">Effort:</span>{' '}
                  <span className={`font-medium capitalize ${getEffortColor(recommendation.estimatedEffort)}`}>
                    {recommendation.estimatedEffort}
                  </span>
                </span>
                <span>
                  <span className="text-gray-600">Impact:</span>{' '}
                  <span className="font-medium capitalize">{recommendation.impact}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
