'use client'

import type { LocationSearchResult } from '@/shared/lib'

export interface SearchResultsProps {
  results: LocationSearchResult[]
  onSelect: (result: LocationSearchResult) => void
  isLoading?: boolean
}

export default function SearchResults({
  results,
  onSelect,
  isLoading = false,
}: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="mt-2 rounded-2xl border border-gray-100 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800">
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">검색 중...</div>
      </div>
    )
  }

  if (results.length === 0) {
    return null
  }

  return (
    <div className="mt-2 rounded-2xl border border-gray-100 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
      <ul className="divide-y divide-gray-100 dark:divide-gray-700">
        {results.map((result) => {
          const isErrorMessage = result.formattedAddress === '해당 장소의 정보가 제공되지 않습니다.'
          return (
            <li key={result.id}>
              {isErrorMessage ? (
                <div className="w-full px-4 py-3 text-left">
                  <div className="font-medium text-red-500 dark:text-red-400">
                    {result.formattedAddress}
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => onSelect(result)}
                  className="w-full px-4 py-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <div className="font-medium text-gray-900 dark:text-white">
                    {result.formattedAddress}
                  </div>
                </button>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
