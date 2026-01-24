'use client';

import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface CategoryData {
  category: string;
  score: number;
  target: number;
  color: string;
}

interface EnhancedCategoryBarsProps {
  data: CategoryData[];
}

/**
 * EnhancedCategoryBars Component
 * 
 * Enhanced bar chart with:
 * - Glassmorphism container
 * - Custom tooltips
 * - Gradient fills
 * - Smooth animations
 */
export default function EnhancedCategoryBars({ data }: EnhancedCategoryBarsProps) {
  const sortedData = [...data].sort((a, b) => b.score - a.score);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="backdrop-blur-xl bg-white/90 dark:bg-slate-800/90 border border-white/40 dark:border-slate-600/40 rounded-xl p-4 shadow-2xl">
          <p className="font-semibold text-gray-900 dark:text-slate-100 mb-2">
            {payload[0].payload.category}
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
          <BarChart data={sortedData} layout="horizontal" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(229, 231, 235, 0.3)" className="dark:stroke-slate-600/30" />
            <XAxis 
              type="number" 
              domain={[0, 100]} 
              stroke="#6B7280" 
              className="dark:stroke-slate-400"
              fontSize={12} 
              tickFormatter={(value) => `${value}%`} 
            />
            <YAxis 
              dataKey="category" 
              type="category" 
              stroke="#6B7280"
              className="dark:stroke-slate-400"
              fontSize={12}
              width={100}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{
                paddingTop: '10px',
              }}
            />
            <Bar 
              dataKey="target" 
              fill="rgba(229, 231, 235, 0.5)"
              name="Target (70%)"
              opacity={0.5}
              radius={[0, 4, 4, 0]}
            />
            <Bar 
              dataKey="score" 
              name="Current Score"
              radius={[0, 4, 4, 0]}
            >
              {sortedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      </div>
    </motion.div>
  );
}
