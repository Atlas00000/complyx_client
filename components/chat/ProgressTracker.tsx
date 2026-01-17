'use client';

interface ProgressTrackerProps {
  progress: number;
  answeredCount: number;
  totalCount: number;
}

export default function ProgressTracker({ progress, answeredCount, totalCount }: ProgressTrackerProps) {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-2">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">
          Assessment Progress
        </span>
        <span className="text-sm text-gray-600">
          {answeredCount} / {totalCount} questions
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-primary h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="text-xs text-gray-500 mt-1 text-center">
        {progress}% Complete
      </div>
    </div>
  );
}
