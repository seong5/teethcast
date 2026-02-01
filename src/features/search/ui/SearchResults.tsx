'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import type { LocationSearchResult } from '@/shared/lib'
import { SearchResultsSkeleton } from './SearchResultsSkeleton'

const ITEMS_PER_PAGE = 10

export interface SearchResultsProps {
  results: LocationSearchResult[]
  onSelect: (result: LocationSearchResult) => void
  isLoading?: boolean
}

export function SearchResults({
  results,
  onSelect,
  isLoading = false,
}: SearchResultsProps) {
  const [currentPage, setCurrentPage] = useState(0)

  if (isLoading) {
    return <SearchResultsSkeleton />
  }

  if (results.length === 0) {
    return null
  }

  const totalPages = Math.ceil(results.length / ITEMS_PER_PAGE)
  const start = currentPage * ITEMS_PER_PAGE
  const displayedResults = results.slice(start, start + ITEMS_PER_PAGE)

  return (
    <div className="mt-2 rounded-2xl border border-gray-100 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
      <ul className="divide-y divide-gray-100 dark:divide-gray-700">
        {displayedResults.map((result) => {
          const isErrorMessage = result.formattedAddress === '해당 장소의 정보가 제공되지 않습니다.'
          return (
            <li key={`${result.id}-${start}`}>
              {isErrorMessage ? (
                <div className="w-full px-4 py-3 text-left">
                  <div className="text-xs font-medium text-red-500 dark:text-red-400 md:text-sm">
                    {result.formattedAddress}
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => onSelect(result)}
                  className="w-full px-4 py-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <div className="text-xs font-medium text-gray-900 dark:text-white md:text-sm">
                    {result.formattedAddress}
                  </div>
                </button>
              )}
            </li>
          )
        })}
      </ul>
      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-1 border-t border-gray-100 dark:border-gray-700 px-3 py-2">
          <span className="text-xs text-gray-500 dark:text-gray-400 md:text-sm mr-2">
            {currentPage + 1} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            className="flex items-center gap-0.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed md:text-sm"
          >
            <ChevronLeft className="size-3.5 md:size-4 shrink-0" aria-hidden />
            이전
          </button>
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={currentPage >= totalPages - 1}
            className="ml-3 flex items-center gap-0.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed md:text-sm"
          >
            다음
            <ChevronRight className="size-3.5 md:size-4 shrink-0" aria-hidden />
          </button>
        </div>
      )}
    </div>
  )
}
