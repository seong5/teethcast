'use client'

import { Skeleton } from '@/shared/ui'

const DAY_COUNT = 3

export default function DailyWeatherSkeleton() {
  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-xl border border-gray-100 dark:border-gray-700 h-full flex flex-col gap-2 min-h-[260px] md:rounded-3xl md:p-6 md:gap-3 md:min-h-[300px]">
      {Array.from({ length: DAY_COUNT }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col items-center gap-2 rounded-xl p-3 bg-gray-50 dark:bg-gray-700/50 border border-transparent min-h-[72px] sm:flex-row sm:items-center sm:justify-between sm:gap-4 md:rounded-2xl md:p-4 md:flex-1 md:min-h-[80px]"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0 sm:gap-4 w-full sm:w-auto">
            <div className="flex-shrink-0 text-center sm:text-left">
              <div className="h-3.5 w-10 md:h-4 md:w-12">
                <Skeleton variant="bar" className="h-full w-full" />
              </div>
              <div className="h-2.5 w-8 mt-0.5 md:h-3 md:w-10">
                <Skeleton variant="bar" className="h-full w-full" />
              </div>
            </div>
            <Skeleton variant="circle" className="h-10 w-10 flex-shrink-0" />
            <div className="h-3 flex-1 min-w-0 max-w-[80px] md:h-4 md:max-w-[100px]">
              <Skeleton variant="bar" className="h-full w-full" />
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 sm:gap-3">
            <div className="text-center sm:text-right">
              <Skeleton variant="bar" className="h-3 w-8 mb-1 md:w-10" />
              <Skeleton variant="bar" className="h-5 w-10 rounded md:h-6 md:w-12" />
            </div>
            <div className="w-2 shrink-0" aria-hidden />
            <div className="text-center sm:text-right">
              <Skeleton variant="bar" className="h-3 w-8 mb-1 md:w-10" />
              <Skeleton variant="bar" className="h-5 w-10 rounded md:h-6 md:w-12" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
