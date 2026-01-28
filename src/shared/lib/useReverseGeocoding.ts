'use client'

import { useState, useCallback } from 'react'
import { apiClient } from '@/shared/api'
import type { KakaoRegionCodeResponse } from '@/shared/types/kakao'
import { isKakaoRegionCodeResponse } from '@/shared/types/guards'

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

export function useReverseGeocoding(): UseReverseGeocodingReturn {
  const [address, setAddress] = useState<Address | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const getAddressFromCoordinates = useCallback(async (latitude: number, longitude: number) => {
    setIsLoading(true)
    setError(null)

    try {
      // 카카오 로컬 API를 사용한 역지오코딩
      const apiKey = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY

      if (!apiKey) {
        throw new Error(
          '카카오 API 키가 설정되지 않았습니다. 환경변수에 NEXT_PUBLIC_KAKAO_REST_API_KEY를 설정해주세요.',
        )
      }

      // 카카오 좌표→행정구역 코드 변환 API (coord2regioncode)
      const response = await apiClient.get<KakaoRegionCodeResponse>(
        `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json`,
        {
          params: {
            x: longitude,
            y: latitude,
          },
          headers: {
            Authorization: `KakaoAK ${apiKey}`,
          },
        },
      )

      // 타입 가드로 검증 (axios는 response.data에 실제 데이터가 있음)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const responseData = response.data
      if (!isKakaoRegionCodeResponse(responseData)) {
        throw new Error('카카오 API 응답 형식이 올바르지 않습니다.')
      }

      const documents = responseData.documents

      if (documents && documents.length > 0) {
        // 행정동(H) 우선, 없으면 법정동(B) 사용
        const administrativeRegion = documents.find((doc) => doc.region_type === 'H')
        const legalRegion = documents.find((doc) => doc.region_type === 'B')
        const regionData = administrativeRegion || legalRegion || documents[0]

        if (regionData) {
          const sido = regionData.region_1depth_name || ''
          const sigungu = regionData.region_2depth_name || ''
          const dong = regionData.region_3depth_name || undefined

          // 주소 구성: 시/구/동 (동이 있으면 반드시 포함)
          const addressParts: string[] = []
          if (sido) addressParts.push(sido)
          if (sigungu) addressParts.push(sigungu)
          if (dong) addressParts.push(dong)

          const fullAddress = addressParts.join(' ') || regionData.address_name || ''

          setAddress({
            fullAddress,
            sido,
            sigungu,
            dong,
          })
        } else {
          throw new Error('주소 정보를 찾을 수 없습니다.')
        }
      } else {
        throw new Error('해당 위치의 주소 정보가 없습니다.')
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('주소 변환 중 오류가 발생했습니다.')
      }
      setAddress(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    address,
    error,
    isLoading,
    getAddressFromCoordinates,
  }
}
