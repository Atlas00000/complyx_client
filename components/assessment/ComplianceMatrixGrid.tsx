'use client';

import { motion } from 'framer-motion';
import { RequirementStatus } from '@/lib/api/complianceApi';
import RequirementCard from './RequirementCard';

interface ComplianceMatrixGridProps {
  requirements: RequirementStatus[];
  onRequirementClick?: (requirement: RequirementStatus) => void;
}

/**
 * ComplianceMatrixGrid Component
 * 
 * Responsive grid layout for requirements with:
 * - Smooth animations
 * - Staggered entrance
 */
export default function ComplianceMatrixGrid({ 
  requirements, 
  onRequirementClick 
}: ComplianceMatrixGridProps) {
  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h4
        className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Requirement Status
      </motion.h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {requirements.map((requirement, index) => (
          <RequirementCard
            key={requirement.requirementId}
            requirement={requirement}
            onRequirementClick={onRequirementClick}
            index={index}
          />
        ))}
      </div>
    </motion.div>
  );
}
