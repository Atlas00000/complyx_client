'use client';

import { useState, useEffect } from 'react';
import { useAssessmentStore, AssessmentScore } from '@/stores/assessmentStore';
import { DashboardAPI, AssessmentScore as DashboardAssessmentScore } from '@/lib/api/dashboardApi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface CategoryBreakdownProps {
  scores?: AssessmentScore | null;
  showComparison?: boolean;
  viewMode?: 'bar' | 'radar';
  userId?: string;
  assessmentId?: string;
  autoFetch?: boolean; // Auto-fetch from API if scores not provided
}

export function CategoryBreakdown({ 
  scores: propScores, 
  showComparison = true, 
  viewMode = 'bar',
  userId,
  assessmentId,
  autoFetch = false,
}: CategoryBreakdownProps) {
  const { scores: storeScores, setScores } = useAssessmentStore();
  const [apiScores, setApiScores] = useState<DashboardAssessmentScore | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-fetch scores from API if enabled and no scores provided
  useEffect(() => {
    if (autoFetch && !propScores && !storeScores) {
      setLoading(true);
      setError(null);
      DashboardAPI.getReadinessScore({ userId, assessmentId })
        .then((data) => {
          setApiScores(data);
          // Update store with fetched scores
          const mappedScores: AssessmentScore = {
            overallScore: data.overallScore,
            overallPercentage: data.overallPercentage,
            categoryScores: data.categoryScores,
            totalAnswered: data.totalAnswered,
            totalQuestions: data.totalQuestions,
          };
          setScores(mappedScores);
        })
        .catch((err) => {
          console.error('Failed to fetch category scores:', err);
          setError(err instanceof Error ? err.message : 'Failed to load scores');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [autoFetch, propScores, storeScores, userId, assessmentId, setScores]);

  // Use propScores first, then storeScores, then apiScores
  const scores = propScores || storeScores || apiScores;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading category scores...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!scores || !scores.categoryScores || scores.categoryScores.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">No category scores available</div>
      </div>
    );
  }

  const categoryScores = scores.categoryScores;
  const overallScore = scores.overallScore;

  // Get color for score
  const getScoreColor = (score: number) => {
    if (score >= 70) return '#10B981'; // green
    if (score >= 40) return '#F59E0B'; // yellow
    return '#EF4444'; // red
  };

  // Prepare data for charts
  const barChartData = categoryScores.map((cat) => ({
    category: cat.category.charAt(0).toUpperCase() + cat.category.slice(1),
    score: cat.percentage,
    target: 70, // Target compliance score
    color: getScoreColor(cat.percentage),
  }));

  const radarChartData = categoryScores.map((cat) => ({
    category: cat.category.charAt(0).toUpperCase() + cat.category.slice(1),
    score: cat.percentage,
    fullMark: 100,
  }));

  // Sort by score (descending)
  const sortedData = [...barChartData].sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-6">
      {/* Bar Chart View */}
      {viewMode === 'bar' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Breakdown</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={sortedData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis type="number" domain={[0, 100]} stroke="#6B7280" fontSize={12} tickFormatter={(value) => `${value}%`} />
              <YAxis 
                dataKey="category" 
                type="category" 
                stroke="#6B7280" 
                fontSize={12}
                width={100}
              />
              <Tooltip 
                formatter={(value: number) => [`${value.toFixed(1)}%`, 'Score']}
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px' }}
              />
              <Legend />
              {showComparison && (
                <Bar 
                  dataKey="target" 
                  fill="#E5E7EB" 
                  name="Target (70%)"
                  opacity={0.5}
                />
              )}
              <Bar 
                dataKey="score" 
                name="Current Score"
              >
                {sortedData.map((entry, index) => (
                  <Bar key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Radar Chart View */}
      {viewMode === 'radar' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Comparison (Radar)</h3>
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart data={radarChartData}>
              <PolarGrid stroke="#E5E7EB" />
              <PolarAngleAxis 
                dataKey="category" 
                stroke="#6B7280"
                fontSize={12}
              />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 100]} 
                stroke="#6B7280"
                fontSize={10}
              />
              <Tooltip 
                formatter={(value: number) => `${value.toFixed(1)}%`}
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px' }}
              />
              <Radar 
                name="Score" 
                dataKey="score" 
                stroke="#2563EB" 
                fill="#2563EB" 
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categoryScores.map((category, index) => {
          const scoreColor = getScoreColor(category.percentage);
          const isAboveTarget = category.percentage >= 70;
          
          return (
            <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-gray-700 capitalize">{category.category}</h4>
                {isAboveTarget && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">✓</span>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-gray-900">{category.percentage.toFixed(0)}</span>
                  <span className="text-sm text-gray-500">%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${category.percentage}%`,
                      backgroundColor: scoreColor,
                    }}
                  />
                </div>
                {showComparison && (
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Target: 70%</span>
                    <span className={isAboveTarget ? 'text-green-600' : 'text-red-600'}>
                      {isAboveTarget ? '+' : '-'}
                      {Math.abs(category.percentage - 70).toFixed(0)}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h4 className="text-sm font-semibold text-gray-700 mb-4">Category Summary</h4>
        <div className="space-y-2">
          {categoryScores.map((category, index) => {
            const status = category.percentage >= 70 ? 'Compliant' : category.percentage >= 40 ? 'Needs Improvement' : 'Critical';
            const statusColor = category.percentage >= 70 ? 'text-green-600' : category.percentage >= 40 ? 'text-yellow-600' : 'text-red-600';
            
            return (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <span className="text-sm text-gray-700 capitalize">{category.category}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-900">{category.percentage.toFixed(0)}%</span>
                  <span className={`text-xs font-medium ${statusColor}`}>{status}</span>
                </div>
              </div>
            );
          })}
          <div className="flex items-center justify-between py-2 pt-4 border-t border-gray-200 mt-2">
            <span className="text-sm font-semibold text-gray-900">Overall Average</span>
            <span className="text-sm font-bold text-gray-900">{overallScore.toFixed(0)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
