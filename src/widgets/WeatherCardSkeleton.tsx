'use client'

import { Skeleton } from '@/shared/ui'

const CARD_MIN_HEIGHT = 'min-h-[340px] md:min-h-[380px]'

export default function WeatherCardSkeleton() {
  return (
    <div className={`w-full h-full ${CARD_MIN_HEIGHT}`}>
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-4 shadow-xl border border-white/20 dark:border-gray-700 h-full flex flex-col md:rounded-3xl md:p-6">
        <div className="relative flex flex-col items-center gap-4 text-center flex-1 justify-center md:gap-6">
          <div className="h-4 w-3/4 max-w-[200px] md:h-5 md:mb-1">
            <Skeleton variant="bar" className="h-full w-full" />
          </div>
          <div className="flex flex-col items-center gap-2 md:gap-3">
            <div className="relative flex items-center justify-center gap-2 md:gap-3">
              <div className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24">
                <Skeleton variant="circle" className="h-full w-full" />
              </div>
              <div className="h-10 w-20 md:h-12 md:w-24">
                <Skeleton variant="bar" className="h-full w-full rounded" />
              </div>
            </div>
            <div className="h-6 w-28 md:h-7 md:w-36">
              <Skeleton variant="bar" className="h-full w-full rounded-full" />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full md:gap-3">
            <div className="bg-white/60 dark:bg-gray-800/50 rounded-xl p-3 flex flex-col items-center justify-center backdrop-blur-sm shadow-sm min-h-[72px] md:rounded-2xl md:p-4 md:min-h-[80px]">
              <Skeleton variant="bar" className="h-3 w-14 mb-1 md:mb-1.5 md:w-16" />
              <Skeleton variant="bar" className="h-6 w-10 rounded md:h-7 md:w-12" />
            </div>
            <div className="bg-white/60 dark:bg-gray-800/50 rounded-xl p-3 flex flex-col items-center justify-center backdrop-blur-sm shadow-sm min-h-[72px] md:rounded-2xl md:p-4 md:min-h-[80px]">
              <Skeleton variant="bar" className="h-3 w-14 mb-1 md:mb-1.5 md:w-16" />
              <Skeleton variant="bar" className="h-6 w-10 rounded md:h-7 md:w-12" />
            </div>
            <div className="bg-white/60 dark:bg-gray-800/50 rounded-xl p-3 flex flex-row items-center justify-between backdrop-blur-sm shadow-sm min-h-[72px] gap-2 md:rounded-2xl md:p-4 md:min-h-[80px]">
              <div className="flex flex-col items-start flex-1 min-w-0 gap-0.5">
                <Skeleton variant="bar" className="h-3 w-10 md:w-12" />
                <Skeleton variant="bar" className="h-4 w-12 rounded md:h-5 md:w-14" />
              </div>
              <Skeleton variant="circle" className="h-7 w-7 flex-shrink-0 md:h-8 md:w-8" />
            </div>
            <div className="bg-white/60 dark:bg-gray-800/50 rounded-xl p-3 flex flex-row items-center justify-between backdrop-blur-sm shadow-sm min-h-[72px] gap-2 md:rounded-2xl md:p-4 md:min-h-[80px]">
              <div className="flex flex-col items-start flex-1 min-w-0 gap-0.5">
                <Skeleton variant="bar" className="h-3 w-10 md:w-12" />
                <Skeleton variant="bar" className="h-4 w-12 rounded md:h-5 md:w-14" />
              </div>
              <Skeleton variant="circle" className="h-7 w-7 flex-shrink-0 md:h-8 md:w-8" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
