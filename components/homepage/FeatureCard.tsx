'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui';

export interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  delay?: number;
  onClick?: () => void;
  className?: string;
}

const FeatureCard = ({
  icon,
  title,
  description,
  delay = 0,
  onClick,
  className = '',
}: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      <Card
        variant="elevated"
        hover
        onClick={onClick}
        className="h-full p-6 text-center group cursor-pointer border border-gray-200 dark:border-gray-600 hover:border-primary/30 dark:hover:border-primary/50 transition-all duration-300"
      >
        {/* Icon */}
        <motion.div
          className="mb-4 flex justify-center"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.2 }}
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center text-white shadow-primary-lg dark:shadow-primary">
            {icon}
          </div>
        </motion.div>

        {/* Title */}
        <h3 className="text-h5 text-gray-900 dark:text-slate-100 font-semibold mb-3 group-hover:text-primary dark:group-hover:text-primary transition-colors duration-200">
          {title}
        </h3>

        {/* Description */}
        <p className="text-body text-gray-600 dark:text-slate-300 leading-relaxed">
          {description}
        </p>
      </Card>
    </motion.div>
  );
};

export default FeatureCard;
