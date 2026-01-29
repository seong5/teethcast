'use client'

import { useState, useCallback } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { normalizeSidoName } from './formatAddress'
import { loadRegions, searchRegions, parseAddress } from './regionSearch'

export interface LocationSearchResult {
  id: string
  formattedAddress: string // 포맷팅된 주소 (예: "대전광역시 서구 복수동")
  region1depthName: string // 시/도
  region2depthName: string // 시/군/구
  region3depthName?: string // 동/읍/면
  x: number // 경도 (초기값 0, 선택 시 카카오 API로 가져옴)
  y: number // 위도 (초기값 0, 선택 시 카카오 API로 가져옴)
}

export interface UseLocationSearchReturn {
  results: LocationSearchResult[]
  error: string | null
  isLoading: boolean
  search: (query: string) => Promise<void>
  clearResults: () => void
}

// 검색 결과를 LocationSearchResult로 변환하는 함수
function transformSearchResults(searchResults: string[]): LocationSearchResult[] {
  const results: LocationSearchResult[] = searchResults.map((address, index) => {
    const parsed = parseAddress(address)

    // region1depthName을 풀네임으로 정규화
    const normalizedSido = normalizeSidoName(parsed.sido)

    // formattedAddress도 정규화된 시/도로 업데이트
    const parts = address.split(' ')
    parts[0] = normalizedSido
    const normalizedFormattedAddress = parts.join(' ')

    return {
      id: `region-${index}-${address}`,
      formattedAddress: normalizedFormattedAddress,
      region1depthName: normalizedSido,
      region2depthName: parsed.sigungu,
      region3depthName: parsed.dong,
      x: 0, // 초기값, 선택 시 카카오 API로 가져옴
      y: 0, // 초기값, 선택 시 카카오 API로 가져옴
    }
  })

  // 중복 제거 (같은 formattedAddress를 가진 결과는 하나만)
  return results.reduce((acc, current) => {
    const exists = acc.find((item) => item.formattedAddress === current.formattedAddress)
    if (!exists) {
      acc.push(current)
    }
    return acc
  }, [] as LocationSearchResult[])
}

// 검색 수행 함수 (TanStack Query에서 사용)
async function performLocationSearch(searchQuery: string): Promise<LocationSearchResult[]> {
  // 행정구역 JSON 파일 로드
  const regions = await loadRegions()

  if (Object.keys(regions).length === 0) {
    throw new Error('행정구역 데이터를 불러올 수 없습니다.')
  }

  // 검색 수행 (계층 구조에서 검색)
  const searchResults = searchRegions(searchQuery.trim(), regions)

  // 검색 결과를 LocationSearchResult 형식으로 변환
  return transformSearchResults(searchResults)
}

export function useLocationSearch(): UseLocationSearchReturn {
  const [searchQuery, setSearchQuery] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const {
    data: results,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['locationSearch', searchQuery],
    queryFn: () => {
      if (!searchQuery) throw new Error('검색어가 설정되지 않았습니다.')
      return performLocationSearch(searchQuery)
    },
    enabled: !!searchQuery && searchQuery.trim() !== '',
    staleTime: 1000 * 60 * 5, // 5분간 fresh 상태 유지
    gcTime: 1000 * 60 * 30, // 30분간 캐시 유지
  })

  const search = useCallback(
    async (query: string) => {
      const trimmed = query.trim()
      if (!trimmed) {
        setSearchQuery(null)
        return
      }

      const queryKey = ['locationSearch', trimmed]

      // queryClient.fetchQuery를 사용하여 쿼리 실행 (캐시 확인 포함)
      try {
        await queryClient.fetchQuery({
          queryKey,
          queryFn: () => performLocationSearch(trimmed),
          staleTime: 1000 * 60 * 5, // 5분간 fresh 상태 유지
          gcTime: 1000 * 60 * 30, // 30분간 캐시 유지
        })
        // 쿼리 성공 후 검색어 설정
        setSearchQuery(trimmed)
      } catch {
        // 에러 발생 시에도 검색어는 설정하여 useQuery가 에러를 처리하도록 함
        setSearchQuery(trimmed)
      }
    },
    [queryClient],
  )

  const clearResults = useCallback(() => {
    setSearchQuery(null)
  }, [])

  return {
    results: results ?? [],
    error: error
      ? error instanceof Error
        ? error.message
        : '검색 중 오류가 발생했습니다.'
      : null,
    isLoading,
    search,
    clearResults,
  }
}
