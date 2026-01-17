'use client';

import { useAssessmentStore, AssessmentScore } from '@/stores/assessmentStore';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface ReadinessScoreProps {
  scores?: AssessmentScore | null;
  size?: number;
  showBreakdown?: boolean;
}

export function ReadinessScore({ scores: propScores, size = 200, showBreakdown = true }: ReadinessScoreProps) {
  const { scores: storeScores } = useAssessmentStore();
  const scores = propScores || storeScores;

  if (!scores) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">No scores available</div>
      </div>
    );
  }

  const overallScore = scores.overallScore;
  const categoryScores = scores.categoryScores || [];

  // Color scheme based on score
  const getScoreColor = (score: number) => {
    if (score >= 70) return '#10B981'; // green
    if (score >= 40) return '#F59E0B'; // yellow
    return '#EF4444'; // red
  };

  // Pie chart data for overall score
  const pieData = [
    { name: 'Compliant', value: overallScore, color: getScoreColor(overallScore) },
    { name: 'Remaining', value: 100 - overallScore, color: '#E5E7EB' },
  ];

  // Category breakdown data for pie chart
  const categoryPieData = categoryScores.map((cat) => ({
    name: cat.category.charAt(0).toUpperCase() + cat.category.slice(1),
    value: cat.percentage,
    color: getScoreColor(cat.percentage),
  }));

  // Calculate stroke dasharray for circular progress
  const circumference = 2 * Math.PI * (size / 2 - 10);
  const offset = circumference - (overallScore / 100) * circumference;

  return (
    <div className="space-y-6">
      {/* Overall Score - Circular Progress */}
      <div className="flex flex-col items-center justify-center">
        <div className="relative" style={{ width: size, height: size }}>
          {/* Background circle */}
          <svg width={size} height={size} className="transform -rotate-90">
            <circle
              cx={size / 2}
              cy={size / 2}
              r={size / 2 - 10}
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="20"
            />
            {/* Progress circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={size / 2 - 10}
              fill="none"
              stroke={getScoreColor(overallScore)}
              strokeWidth="20"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          </svg>
          {/* Score text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-gray-900">{overallScore.toFixed(0)}</span>
            <span className="text-sm text-gray-500">% Ready</span>
          </div>
        </div>
        <div className="mt-4 text-center">
          <h3 className="text-lg font-semibold text-gray-900">Overall Readiness Score</h3>
          <p className="text-sm text-gray-500 mt-1">
            {overallScore >= 70
              ? 'High readiness'
              : overallScore >= 40
              ? 'Moderate readiness'
              : 'Low readiness'}
          </p>
        </div>
      </div>

      {/* Score Breakdown */}
      {showBreakdown && (
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-700">Category Breakdown</h4>
          
          {/* Category bars */}
          <div className="space-y-3">
            {categoryScores.map((category, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700 capitalize">{category.category}</span>
                  <span className="text-gray-900 font-semibold">{category.percentage.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${category.percentage}%`,
                      backgroundColor: getScoreColor(category.percentage),
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Category Pie Chart */}
          {categoryPieData.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-4">Category Distribution</h4>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryPieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* Status Badge */}
      <div className="flex items-center justify-center">
        <div
          className="px-4 py-2 rounded-full text-sm font-semibold"
          style={{
            backgroundColor: `${getScoreColor(overallScore)}20`,
            color: getScoreColor(overallScore),
          }}
        >
          {overallScore >= 70
            ? '✓ Ready for Compliance'
            : overallScore >= 40
            ? '⚠ Needs Improvement'
            : '✗ Critical Gaps Identified'}
        </div>
      </div>
    </div>
  );
}
