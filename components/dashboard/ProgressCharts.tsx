'use client';

import { useAssessmentStore } from '@/stores/assessmentStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface ProgressChartsProps {
  history?: Array<{ date: string; progress: number; answeredCount: number }>;
  showAreaChart?: boolean;
}

export function ProgressCharts({ history, showAreaChart = true }: ProgressChartsProps) {
  const { progress, answeredCount, totalCount, answers } = useAssessmentStore();

  // Generate mock history if not provided (based on answers)
  const generateHistory = (): Array<{ date: string; progress: number; answeredCount: number }> => {
    if (!history && answers.length > 0) {
      const historyData: Array<{ date: string; progress: number; answeredCount: number }> = [];
      const sortedAnswers = [...answers].sort((a, b) => {
        const dateA = a.timestamp instanceof Date ? a.timestamp : new Date(a.timestamp);
        const dateB = b.timestamp instanceof Date ? b.timestamp : new Date(b.timestamp);
        return dateA.getTime() - dateB.getTime();
      });

      let cumulativeCount = 0;
      const currentDate = new Date();
      
      // Create data points for each answer
      sortedAnswers.forEach((answer, index) => {
        cumulativeCount++;
        const timestamp = answer.timestamp instanceof Date ? answer.timestamp : new Date(answer.timestamp);
        const progressValue = totalCount > 0 ? (cumulativeCount / totalCount) * 100 : 0;
        
        // Group by day or hour
        const timeKey = timestamp.toISOString().split('T')[0];
        const existingIndex = historyData.findIndex(d => d.date === timeKey);
        
        if (existingIndex >= 0) {
          historyData[existingIndex].progress = progressValue;
          historyData[existingIndex].answeredCount = cumulativeCount;
        } else {
          historyData.push({
            date: timeKey,
            progress: progressValue,
            answeredCount: cumulativeCount,
          });
        }
      });

      // Add current point
      if (historyData.length === 0 || historyData[historyData.length - 1].date !== currentDate.toISOString().split('T')[0]) {
        historyData.push({
          date: currentDate.toISOString().split('T')[0],
          progress,
          answeredCount,
        });
      }

      return historyData;
    }

    return history || [
      { date: new Date().toISOString().split('T')[0], progress, answeredCount },
    ];
  };

  const chartData = generateHistory();

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {/* Progress Over Time - Line Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress Over Time</h3>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="date" 
                stroke="#6B7280"
                fontSize={12}
                tickFormatter={formatDate}
              />
              <YAxis 
                stroke="#6B7280"
                fontSize={12}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                formatter={(value: number) => [`${value.toFixed(1)}%`, 'Progress']}
                labelFormatter={(label) => `Date: ${formatDate(label)}`}
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="progress" 
                stroke="#2563EB" 
                strokeWidth={2}
                name="Progress %"
                dot={{ fill: '#2563EB', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500">
            No progress data available
          </div>
        )}
      </div>

      {/* Questions Answered Over Time - Area Chart */}
      {showAreaChart && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Questions Answered Over Time</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorAnswered" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6B7280"
                  fontSize={12}
                  tickFormatter={formatDate}
                />
                <YAxis 
                  stroke="#6B7280"
                  fontSize={12}
                />
                <Tooltip 
                  formatter={(value: number) => [value, 'Questions Answered']}
                  labelFormatter={(label) => `Date: ${formatDate(label)}`}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="answeredCount" 
                  stroke="#10B981" 
                  fillOpacity={1}
                  fill="url(#colorAnswered)"
                  name="Questions Answered"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No data available
            </div>
          )}
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="text-sm text-gray-600 mb-1">Current Progress</div>
          <div className="text-2xl font-bold text-gray-900">{progress.toFixed(0)}%</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="text-sm text-gray-600 mb-1">Questions Answered</div>
          <div className="text-2xl font-bold text-gray-900">{answeredCount} / {totalCount}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="text-sm text-gray-600 mb-1">Data Points</div>
          <div className="text-2xl font-bold text-gray-900">{chartData.length}</div>
        </div>
      </div>
    </div>
  );
}
