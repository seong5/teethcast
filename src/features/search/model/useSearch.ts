'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useLocationSearch, useKakaoSearch } from '@/shared/lib'
import type { UseLocationSearchReturn } from '@/shared/lib'
import type { LocationSearchResult } from '@/shared/lib'

const SEARCH_DEBOUNCE_MS = 300

export interface UseSearchReturn {
  searchValue: string
  setSearchValue: (value: string) => void
  handleSearch: () => void
  searchResults: LocationSearchResult[]
  searchError: string | null
  searchLoading: boolean
  isGettingCoordinates: boolean
  kakaoSearchError: string | null
  clearResults: () => void
}

/**
 * 검색 기능을 관리하는 훅
 * 검색어 입력 시 디바운스(300ms) 후 자동 검색되어 실시간으로 결과가 갱신됩니다.
 */
export function useSearch(): UseSearchReturn {
  const [searchValue, setSearchValue] = useState('')
  const {
    results: searchResults,
    error: searchError,
    isLoading: searchLoading,
    search: searchLocation,
    clearResults,
  }: UseLocationSearchReturn = useLocationSearch()
  const {
    isLoading: isGettingCoordinates,
    error: kakaoSearchError,
  } = useKakaoSearch()

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
      debounceRef.current = null
    }

    const trimmed = searchValue.trim()
    if (trimmed) {
      debounceRef.current = setTimeout(() => {
        searchLocation(searchValue)
        debounceRef.current = null
      }, SEARCH_DEBOUNCE_MS)
    } else {
      clearResults()
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
        debounceRef.current = null
      }
    }
  }, [searchValue, searchLocation, clearResults])

  const handleSearch = useCallback(() => {
    if (searchValue.trim()) {
      searchLocation(searchValue)
    } else {
      clearResults()
    }
  }, [searchValue, searchLocation, clearResults])

  return {
    searchValue,
    setSearchValue,
    handleSearch,
    searchResults,
    searchError,
    searchLoading,
    isGettingCoordinates,
    kakaoSearchError,
    clearResults,
  }
}
