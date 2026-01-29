'use client'

import { useState, useCallback } from 'react'
import { useLocationSearch, useKakaoSearch } from '@/shared/lib'
import type { UseLocationSearchReturn } from '@/shared/lib'
import type { LocationSearchResult } from '@/shared/lib'

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
