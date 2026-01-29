'use client'

import { useState, useCallback } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import type { KakaoSearchResponse } from '@/shared/types/kakao'
import { isKakaoSearchResponse } from '@/shared/types/guards'

export interface Coordinates {
  latitude: number
  longitude: number
}

// 카카오 키워드 검색 API 호출 함수
async function fetchKakaoSearch(query: string): Promise<KakaoSearchResponse> {
  const response = await fetch(`/api/kakao-search?query=${encodeURIComponent(query)}`)

  if (!response.ok) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const errorData = (await response.json().catch(() => ({}))) as { error?: string }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    throw new Error(errorData.error || `HTTP 오류: ${response.status}`)
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const data = (await response.json()) as unknown

  if (!isKakaoSearchResponse(data)) {
    throw new Error('카카오 API 응답 형식이 올바르지 않습니다.')
  }

  return data
}

// 응답에서 좌표 추출
function extractCoordinates(response: KakaoSearchResponse): Coordinates | null {
  if (!response.documents || response.documents.length === 0) {
    return null
  }

  const doc = response.documents[0]
  const latitude = parseFloat(doc.y)
  const longitude = parseFloat(doc.x)

  if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
    return null
  }

  return { latitude, longitude }
}

export interface UseKakaoSearchReturn {
  coordinates: Coordinates | null
  error: string | null
  isLoading: boolean
  searchCoordinates: (query: string) => Promise<Coordinates | null>
}

export function useKakaoSearch(): UseKakaoSearchReturn {
  const [query, setQuery] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const {
    data: coordinates,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['kakaoSearch', query],
    queryFn: async () => {
      if (!query) throw new Error('검색어가 설정되지 않았습니다.')
      const response = await fetchKakaoSearch(query)
      return extractCoordinates(response)
    },
    enabled: !!query,
    staleTime: 1000 * 60 * 60, // 1시간간 fresh 상태 유지 (좌표는 자주 바뀌지 않음)
    gcTime: 1000 * 60 * 60 * 24, // 24시간간 캐시 유지
  })

  const searchCoordinates = useCallback(
    async (searchQuery: string): Promise<Coordinates | null> => {
      const queryKey = ['kakaoSearch', searchQuery]

      // queryClient.fetchQuery를 사용하여 쿼리 실행 (캐시 확인 포함)
      try {
        const result = await queryClient.fetchQuery({
          queryKey,
          queryFn: async () => {
            const response = await fetchKakaoSearch(searchQuery)
            return extractCoordinates(response)
          },
          staleTime: 1000 * 60 * 60, // 1시간간 fresh 상태 유지
          gcTime: 1000 * 60 * 60 * 24, // 24시간간 캐시 유지
        })
        // 쿼리 성공 후 query 설정
        setQuery(searchQuery)
        return result
      } catch {
        // 에러 발생 시에도 query는 설정하여 useQuery가 에러를 처리하도록 함
        setQuery(searchQuery)
        return null
      }
    },
    [queryClient],
  )

  return {
    coordinates: coordinates ?? null,
    error: error
      ? error instanceof Error
        ? error.message
        : '좌표 검색 중 오류가 발생했습니다.'
      : null,
    isLoading,
    searchCoordinates,
  }
}
