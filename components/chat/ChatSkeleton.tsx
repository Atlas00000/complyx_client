'use client';

import { Skeleton } from '@/components/ui';

export default function ChatSkeleton() {
  return (
    <div className="space-y-4">
      {/* System / assistant bubble */}
      <div className="flex items-start gap-3">
        <Skeleton width={32} height={32} rounded="full" className="shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton width="60%" height="0.9rem" rounded="lg" />
          <Skeleton width="80%" height="0.9rem" rounded="lg" />
        </div>
      </div>

      {/* User bubble */}
      <div className="flex items-start gap-3 justify-end">
        <div className="flex-1 flex justify-end">
          <div className="space-y-2 max-w-[70%]">
            <Skeleton width="70%" height="0.9rem" rounded="lg" />
          </div>
        </div>
        <Skeleton width={32} height={32} rounded="full" className="shrink-0" />
      </div>

      {/* Another assistant bubble */}
      <div className="flex items-start gap-3">
        <Skeleton width={32} height={32} rounded="full" className="shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton width="90%" height="0.9rem" rounded="lg" />
          <Skeleton width="75%" height="0.9rem" rounded="lg" />
          <Skeleton width="50%" height="0.9rem" rounded="lg" />
        </div>
      </div>
    </div>
  );
}

