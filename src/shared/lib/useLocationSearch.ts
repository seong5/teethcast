'use client'

import { useState, useCallback } from 'react'
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
      // 행정구역 JSON 파일 로드
      const regions = await loadRegions()

      if (Object.keys(regions).length === 0) {
        throw new Error('행정구역 데이터를 불러올 수 없습니다.')
      }

      // 검색 수행 (계층 구조에서 검색)
      const searchResults = searchRegions(query.trim(), regions)

      // 검색 결과를 LocationSearchResult 형식으로 변환
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
      const uniqueResults = results.reduce((acc, current) => {
        const exists = acc.find((item) => item.formattedAddress === current.formattedAddress)
        if (!exists) {
          acc.push(current)
        }
        return acc
      }, [] as LocationSearchResult[])

      setResults(uniqueResults)
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
