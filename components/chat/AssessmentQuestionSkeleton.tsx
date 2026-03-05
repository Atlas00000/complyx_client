'use client';

import { Skeleton } from '@/components/ui';

interface AssessmentQuestionSkeletonProps {
  className?: string;
}

export default function AssessmentQuestionSkeleton({
  className = '',
}: AssessmentQuestionSkeletonProps) {
  return (
    <div
      className={`rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900/80 shadow-sm p-4 space-y-4 ${className}`}
      aria-busy="true"
      aria-label="Loading assessment question"
    >
      {/* Question text */}
      <div className="space-y-2">
        <Skeleton width="70%" height="1rem" />
        <Skeleton width="55%" height="1rem" />
      </div>

      {/* Options / answer area */}
      <div className="space-y-2">
        <Skeleton width="90%" height="2.5rem" rounded="lg" />
        <Skeleton width="85%" height="2.5rem" rounded="lg" />
        <Skeleton width="80%" height="2.5rem" rounded="lg" />
      </div>
    </div>
  );
}

