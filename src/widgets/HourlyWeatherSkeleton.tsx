'use client'

import { Skeleton } from '@/shared/ui'

const SLOT_COUNT = 6

const SLOT_MIN_HEIGHT = 'min-h-[132px] md:min-h-[140px]'

export default function HourlyWeatherSkeleton() {
  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-xl border border-gray-100 dark:border-gray-700 md:rounded-3xl md:p-6">
      <div className="w-full overflow-x-auto -mx-1 px-1 md:overflow-visible md:mx-0 md:px-0">
        <div className="flex items-stretch gap-2 w-max min-w-full md:w-full md:min-w-0 md:gap-3">
          {Array.from({ length: SLOT_COUNT }).map((_, i) => (
            <div
              key={i}
              className={`flex-shrink-0 w-[88px] bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 flex flex-col items-center border border-transparent ${SLOT_MIN_HEIGHT} md:flex-1 md:min-w-0 md:rounded-2xl`}
            >
              <div className="h-3 w-12 mb-1 md:h-4 md:w-14 md:mb-2">
                <Skeleton variant="bar" className="h-full w-full" />
              </div>
              <div className="flex flex-col items-center gap-1 mb-1 md:gap-2 md:mb-2">
                <div className="p-1 md:p-1.5">
                  <Skeleton variant="circle" className="h-7 w-7 md:h-8 md:w-8" />
                </div>
                <div className="h-6 w-10 md:h-7 md:w-12">
                  <Skeleton variant="bar" className="h-full w-full rounded" />
                </div>
              </div>
              <div className="h-3 w-14 mt-1 text-center md:h-4 md:w-16">
                <Skeleton variant="bar" className="h-full w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
