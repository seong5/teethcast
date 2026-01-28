'use client'

import { useState, useCallback } from 'react'
import { apiClient } from '@/shared/api'

export interface LocationSearchResult {
  id: string
  placeName: string // 장소명
  addressName: string // 전체 지번 주소
  roadAddressName: string // 전체 도로명 주소
  x: number // 경도
  y: number // 위도
  region1depthName: string // 시/도
  region2depthName: string // 시/군/구
  region3depthName?: string // 동/읍/면
}

interface UseLocationSearchReturn {
  results: LocationSearchResult[]
  error: string | null
  isLoading: boolean
  search: (query: string) => Promise<void>
  clearResults: () => void
}

// 카카오 API 응답 타입
interface KakaoSearchDocument {
  id: string
  place_name: string
  address_name: string
  road_address_name?: string
  x: string // 경도 (문자열)
  y: string // 위도 (문자열)
  address?: {
    region_1depth_name: string
    region_2depth_name: string
    region_3depth_name?: string
  }
  road_address?: {
    region_1depth_name: string
    region_2depth_name: string
    region_3depth_name?: string
  }
}

interface KakaoSearchResponse {
  documents: KakaoSearchDocument[]
  meta: {
    total_count: number
    pageable_count: number
    is_end: boolean
  }
}

export function useLocationSearch(): UseLocationSearchReturn {
  const [results, setResults] = useState<LocationSearchResult[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const search = useCallback(async (query: string) => {
    if (!query || query.trim() === '') {
      setResults([])
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const apiKey = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY

      if (!apiKey) {
        throw new Error(
          '카카오 API 키가 설정되지 않았습니다. 환경변수에 NEXT_PUBLIC_KAKAO_REST_API_KEY를 설정해주세요.',
        )
      }

      // 카카오 키워드 검색 API
      const response = await apiClient.get<KakaoSearchResponse>(
        `https://dapi.kakao.com/v2/local/search/keyword.json`,
        {
          params: {
            query: query.trim(),
            size: 10,
          },
          headers: {
            Authorization: `KakaoAK ${apiKey}`,
          },
        },
      )

      const documents = response.data.documents

      // 검색 결과를 LocationSearchResult 형식으로 변환
      const searchResults: LocationSearchResult[] = documents.map((doc) => {
        // 주소 정보는 road_address 우선, 없으면 address 사용
        const addressData = doc.road_address || doc.address

        return {
          id: doc.id,
          placeName: doc.place_name,
          addressName: doc.address_name,
          roadAddressName: doc.road_address_name || doc.address_name,
          x: parseFloat(doc.x),
          y: parseFloat(doc.y),
          region1depthName: addressData?.region_1depth_name || '',
          region2depthName: addressData?.region_2depth_name || '',
          region3depthName: addressData?.region_3depth_name,
        }
      })

      setResults(searchResults)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('검색 중 오류가 발생했습니다.')
      }
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearResults = useCallback(() => {
    setResults([])
    setError(null)
  }, [])

  return {
    results,
    error,
    isLoading,
    search,
    clearResults,
  }
}
