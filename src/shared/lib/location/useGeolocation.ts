'use client'

import { useQuery } from '@tanstack/react-query'
import { QUERY_CONFIG } from '@/shared/config/query'

export interface Position {
  latitude: number
  longitude: number
  accuracy: number
}

interface UseGeolocationReturn {
  position: Position | null
  error: string | null
  isLoading: boolean
  getCurrentPosition: () => void
}

function getGeoPosition(): Promise<Position> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      reject(new Error('이 브라우저는 위치 정보를 지원하지 않습니다.'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (geoPosition) => {
        resolve({
          latitude: geoPosition.coords.latitude,
          longitude: geoPosition.coords.longitude,
          accuracy: geoPosition.coords.accuracy,
        })
      },
      (geoError) => {
        let errorMessage = '위치 정보를 가져올 수 없습니다.'
        switch (geoError.code) {
          case geoError.PERMISSION_DENIED:
            errorMessage = '위치 정보 권한이 거부되었습니다.'
            break
          case geoError.POSITION_UNAVAILABLE:
            errorMessage = '위치 정보를 사용할 수 없습니다.'
            break
          case geoError.TIMEOUT:
            errorMessage = '위치 정보 요청 시간이 초과되었습니다.'
            break
        }
        reject(new Error(errorMessage))
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    )
  })
}

export function useGeolocation(): UseGeolocationReturn {
  const {
    data: position,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['geolocation'],
    queryFn: getGeoPosition,
    enabled: true,
    staleTime: QUERY_CONFIG.geolocation.staleTime,
    gcTime: QUERY_CONFIG.geolocation.gcTime,
    retry: QUERY_CONFIG.geolocation.retry,
  })

  const errorMessage =
    error != null
      ? error instanceof Error
        ? error.message
        : '위치 정보를 가져오는 중 오류가 발생했습니다.'
      : null

  return {
    position: position ?? null,
    error: errorMessage,
    isLoading,
    getCurrentPosition: () => {
      refetch()
    },
  }
}
