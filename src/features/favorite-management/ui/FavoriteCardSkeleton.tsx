'use client'

import { Skeleton } from '@/shared/ui'

export default function FavoriteCardSkeleton() {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-gray-100 bg-white p-3 shadow-xl dark:border-gray-700 dark:bg-gray-800 md:rounded-3xl md:p-4">
      <div className="flex flex-col gap-3 md:gap-4">
        <div className="flex items-center gap-2 min-w-0 min-h-10 md:min-h-12">
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <Skeleton variant="circle" className="h-4 w-4 shrink-0" />
            <Skeleton variant="bar" className="h-4 flex-1 min-w-0 max-w-[180px] md:h-4" />
          </div>
          <Skeleton variant="circle" className="h-7 w-7 shrink-0" />
        </div>
        <div className="flex items-center justify-between gap-3 md:gap-4">
          <div className="flex items-center gap-2 min-w-0 md:gap-3">
            <Skeleton variant="circle" className="h-11 w-11 md:h-12 md:w-12" />
            <div className="min-w-0 space-y-1">
              <Skeleton variant="bar" className="h-7 w-16 rounded md:h-8 md:w-20" />
              <Skeleton variant="bar" className="h-3 w-24 md:h-4 md:w-28" />
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 md:gap-3">
            <div className="text-right">
              <Skeleton variant="bar" className="h-3 w-8 mb-0.5 md:w-10" />
              <Skeleton variant="bar" className="h-5 w-10 rounded md:h-6 md:w-12" />
            </div>
            <div className="w-2" />
            <div className="text-right">
              <Skeleton variant="bar" className="h-3 w-8 mb-0.5 md:w-10" />
              <Skeleton variant="bar" className="h-5 w-10 rounded md:h-6 md:w-12" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
