'use client';

import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface CategoryData {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number;
}

interface CategoryPieChartProps {
  data: CategoryData[];
}

/**
 * CategoryPieChart Component
 * 
 * Enhanced pie chart with:
 * - Glassmorphism container
 * - Custom styling
 * - Smooth animations
 * - Interactive tooltips
 */
export default function CategoryPieChart({ data }: CategoryPieChartProps) {
  if (data.length === 0) return null;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="backdrop-blur-xl bg-white/90 dark:bg-slate-800/90 border border-white/40 dark:border-slate-600/40 rounded-xl p-3 shadow-2xl">
          <p className="font-semibold text-gray-900 dark:text-slate-100">
            {payload[0].name}
          </p>
          <p className="text-sm" style={{ color: payload[0].color }}>
            {payload[0].value.toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      className="mt-8"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.5 }}
    >
      <h4 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-6">
        Category Distribution
      </h4>
      
      {/* Glassmorphism container */}
      <div className="relative p-6 rounded-2xl backdrop-blur-sm bg-white/40 dark:bg-slate-700/40 border border-white/40 dark:border-slate-600/40">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => 
                `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`
              }
              outerRadius={100}
              innerRadius={40}
              paddingAngle={2}
              dataKey="value"
              animationBegin={0}
              animationDuration={1000}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  style={{
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
                  }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{
                paddingTop: '20px',
              }}
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      </div>
    </motion.div>
  );
}
