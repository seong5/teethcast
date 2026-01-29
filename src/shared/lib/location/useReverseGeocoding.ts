'use client'

import { useState, useCallback } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import type { KakaoRegionCodeResponse } from '@/shared/types/kakao'
import { isKakaoRegionCodeResponse } from '@/shared/types/guards'
import { QUERY_CONFIG } from '@/shared/config/query'

export interface Address {
  fullAddress: string
  sido: string
  sigungu: string
  dong?: string
}

export interface UseReverseGeocodingReturn {
  address: Address | null
  error: string | null
  isLoading: boolean
  getAddressFromCoordinates: (latitude: number, longitude: number) => Promise<void>
}

// 역지오코딩 API 호출 함수
async function fetchReverseGeocoding(
  latitude: number,
  longitude: number,
): Promise<KakaoRegionCodeResponse> {
  const response = await fetch(`/api/reverse-geocoding?latitude=${latitude}&longitude=${longitude}`)

  if (!response.ok) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const errorData = (await response.json().catch(() => ({}))) as { error?: string }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    throw new Error(errorData.error || `HTTP 오류: ${response.status}`)
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const data = (await response.json()) as unknown

  if (!isKakaoRegionCodeResponse(data)) {
    throw new Error('카카오 API 응답 형식이 올바르지 않습니다.')
  }

  return data
}

// 응답 데이터를 Address로 변환
function parseAddressFromResponse(response: KakaoRegionCodeResponse): Address {
  const documents = response.documents

  if (!documents || documents.length === 0) {
    throw new Error('해당 위치의 주소 정보가 없습니다.')
  }

  // 행정동(H) 우선, 없으면 법정동(B) 사용
  const administrativeRegion = documents.find((doc) => doc.region_type === 'H')
  const legalRegion = documents.find((doc) => doc.region_type === 'B')
  const regionData = administrativeRegion || legalRegion || documents[0]

  if (!regionData) {
    throw new Error('주소 정보를 찾을 수 없습니다.')
  }

  const sido = regionData.region_1depth_name || ''
  const sigungu = regionData.region_2depth_name || ''
  const dong = regionData.region_3depth_name || undefined

  // 주소 구성: 시/구/동 (동이 있으면 반드시 포함)
  const addressParts: string[] = []
  if (sido) addressParts.push(sido)
  if (sigungu) addressParts.push(sigungu)
  if (dong) addressParts.push(dong)

  const fullAddress = addressParts.join(' ') || regionData.address_name || ''

  return {
    fullAddress,
    sido,
    sigungu,
    dong,
  }
}

export function useReverseGeocoding(): UseReverseGeocodingReturn {
  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null)
  const queryClient = useQueryClient()

  const {
    data: address,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['reverseGeocoding', coordinates?.lat, coordinates?.lon],
    queryFn: async () => {
      if (!coordinates) throw new Error('좌표가 설정되지 않았습니다.')
      const response = await fetchReverseGeocoding(coordinates.lat, coordinates.lon)
      return parseAddressFromResponse(response)
    },
    enabled: !!coordinates,
    staleTime: QUERY_CONFIG.reverseGeocoding.staleTime,
    gcTime: QUERY_CONFIG.reverseGeocoding.gcTime,
  })

  const getAddressFromCoordinates = useCallback(
    async (latitude: number, longitude: number) => {
      const queryKey = ['reverseGeocoding', latitude, longitude]

      try {
        await queryClient.fetchQuery({
          queryKey,
          queryFn: async () => {
            const response = await fetchReverseGeocoding(latitude, longitude)
            return parseAddressFromResponse(response)
          },
          staleTime: QUERY_CONFIG.reverseGeocoding.staleTime,
          gcTime: QUERY_CONFIG.reverseGeocoding.gcTime,
        })
        setCoordinates({ lat: latitude, lon: longitude })
      } catch {
        setCoordinates({ lat: latitude, lon: longitude })
      }
    },
    [queryClient],
  )

  return {
    address: address ?? null,
    error: error
      ? error instanceof Error
        ? error.message
        : '주소 변환 중 오류가 발생했습니다.'
      : null,
    isLoading,
    getAddressFromCoordinates,
  }
}
