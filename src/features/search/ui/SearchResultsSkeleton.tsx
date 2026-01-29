'use client'

import { Skeleton } from '@/shared/ui'

const ROW_COUNT = 5

export function SearchResultsSkeleton() {
  return (
    <div className="mt-2 rounded-2xl border border-gray-100 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
      <ul className="divide-y divide-gray-100 dark:divide-gray-700">
        {Array.from({ length: ROW_COUNT }).map((_, i) => (
          <li key={i} className="px-4 py-3">
            <Skeleton variant="bar" className="h-4 w-full max-w-[280px] md:h-4" />
          </li>
        ))}
      </ul>
    </div>
  )
}
