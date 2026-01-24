'use client';

import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartData {
  date: string;
  progress: number;
  answeredCount: number;
}

interface EnhancedAreaChartProps {
  data: ChartData[];
  formatDate: (dateString: string) => string;
}

/**
 * EnhancedAreaChart Component
 * 
 * Enhanced area chart with:
 * - Glassmorphism container
 * - Gradient fills
 * - Custom tooltips
 * - Smooth animations
 */
export default function EnhancedAreaChart({ data, formatDate }: EnhancedAreaChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 dark:text-slate-400">
        No progress data available
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="backdrop-blur-xl bg-white/90 dark:bg-slate-800/90 border border-white/40 dark:border-slate-600/40 rounded-xl p-4 shadow-2xl">
          <p className="font-semibold text-gray-900 dark:text-slate-100 mb-2">
            {formatDate(label)}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(1)}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      className="flex-1"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      {/* Glassmorphism chart container */}
      <div className="relative p-4 rounded-2xl backdrop-blur-sm bg-white/40 dark:bg-slate-700/40 border border-white/40 dark:border-slate-600/40">
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.8}/>
                <stop offset="50%" stopColor="#10B981" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(229, 231, 235, 0.3)" className="dark:stroke-slate-600/30" />
            <XAxis 
              dataKey="date" 
              stroke="#6B7280"
              className="dark:stroke-slate-400"
              fontSize={12}
              tickFormatter={formatDate}
            />
            <YAxis 
              stroke="#6B7280"
              className="dark:stroke-slate-400"
              fontSize={12}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{
                paddingTop: '10px',
              }}
            />
            <Area 
              type="monotone" 
              dataKey="progress" 
              stroke="#14B8A6" 
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorProgress)"
              name="Progress %"
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
        
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/5 via-transparent to-primary/5 pointer-events-none" />
      </div>
    </motion.div>
  );
}
