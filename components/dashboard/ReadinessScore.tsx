'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAssessmentStore, AssessmentScore } from '@/stores/assessmentStore';
import { DashboardAPI, AssessmentScore as DashboardAssessmentScore } from '@/lib/api/dashboardApi';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card } from '@/components/ui';
import { Skeleton } from '@/components/ui/Loading';

interface ReadinessScoreProps {
  scores?: AssessmentScore | null;
  size?: number;
  showBreakdown?: boolean;
  userId?: string;
  assessmentId?: string;
  autoFetch?: boolean;
}

export function ReadinessScore({ 
  scores: propScores, 
  size = 200, 
  showBreakdown = true,
  userId,
  assessmentId,
  autoFetch = false,
}: ReadinessScoreProps) {
  const { scores: storeScores, setScores } = useAssessmentStore();
  const [apiScores, setApiScores] = useState<DashboardAssessmentScore | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [animatedScore, setAnimatedScore] = useState(0);

  // Auto-fetch scores from API if enabled and no scores provided
  useEffect(() => {
    if (autoFetch && !propScores && !storeScores) {
      setLoading(true);
      setError(null);
      DashboardAPI.getReadinessScore({ userId, assessmentId })
        .then((data) => {
          setApiScores(data);
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
          console.error('Failed to fetch readiness score:', err);
          setError(err instanceof Error ? err.message : 'Failed to load scores');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [autoFetch, propScores, storeScores, userId, assessmentId, setScores]);

  // Animate score counter
  useEffect(() => {
    const scores = propScores || storeScores || apiScores;
    if (scores) {
      const targetScore = scores.overallScore;
      const duration = 2000;
      const steps = 60;
      const increment = targetScore / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= targetScore) {
          setAnimatedScore(targetScore);
          clearInterval(timer);
        } else {
          setAnimatedScore(current);
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [propScores, storeScores, apiScores]);

  const scores = propScores || storeScores || apiScores;

  if (loading) {
    return (
      <Card className="p-8">
        <div className="flex flex-col items-center gap-4">
          <Skeleton width={200} height={200} rounded="full" />
          <SkeletonText lines={2} />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-8">
        <div className="text-center text-error">
          <p className="font-semibold">Error loading scores</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      </Card>
    );
  }

  if (!scores) {
    return (
      <Card className="p-8">
        <div className="text-center text-gray-500">
          <p>No scores available</p>
        </div>
      </Card>
    );
  }

  const overallScore = scores.overallScore;
  const categoryScores = scores.categoryScores || [];

  const getScoreColor = (score: number) => {
    if (score >= 70) return '#10B981';
    if (score >= 40) return '#F59E0B';
    return '#EF4444';
  };

  const pieData = [
    { name: 'Compliant', value: overallScore, color: getScoreColor(overallScore) },
    { name: 'Remaining', value: 100 - overallScore, color: '#E5E7EB' },
  ];

  const categoryPieData = categoryScores.map((cat) => ({
    name: cat.category.charAt(0).toUpperCase() + cat.category.slice(1),
    value: cat.percentage,
    color: getScoreColor(cat.percentage),
  }));

  const circumference = 2 * Math.PI * (size / 2 - 10);
  const offset = circumference - (overallScore / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Overall Score - Circular Progress */}
      <div className="flex flex-col items-center justify-center">
        <motion.div
          className="relative"
          style={{ width: size, height: size }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <svg width={size} height={size} className="transform -rotate-90">
            <circle
              cx={size / 2}
              cy={size / 2}
              r={size / 2 - 10}
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="20"
            />
            <motion.circle
              cx={size / 2}
              cy={size / 2}
              r={size / 2 - 10}
              fill="none"
              stroke={getScoreColor(overallScore)}
              strokeWidth="20"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 2, ease: 'easeOut' }}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              className="text-4xl font-bold text-gray-900"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {Math.round(animatedScore)}
            </motion.span>
            <span className="text-sm text-gray-500">% Ready</span>
          </div>
        </motion.div>
        <motion.div
          className="mt-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <h3 className="text-lg font-semibold text-gray-900">Overall Readiness Score</h3>
          <p className="text-sm text-gray-500 mt-1">
            {overallScore >= 70
              ? 'High readiness'
              : overallScore >= 40
              ? 'Moderate readiness'
              : 'Low readiness'}
          </p>
        </motion.div>
      </div>

      {/* Score Breakdown */}
      {showBreakdown && (
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h4 className="text-sm font-semibold text-gray-700">Category Breakdown</h4>
          
          <div className="space-y-3">
            {categoryScores.map((category, index) => (
              <motion.div
                key={index}
                className="space-y-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700 capitalize">{category.category}</span>
                  <span className="text-gray-900 font-semibold">{category.percentage.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-2 rounded-full"
                    style={{ backgroundColor: getScoreColor(category.percentage) }}
                    initial={{ width: 0 }}
                    animate={{ width: `${category.percentage}%` }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.1, ease: 'easeOut' }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {categoryPieData.length > 0 && (
            <motion.div
              className="mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
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
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Status Badge */}
      <motion.div
        className="flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
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
      </motion.div>
    </motion.div>
  );
}
