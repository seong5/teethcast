'use client'

import { useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useKakaoSearch } from '@/shared/lib'
import type { LocationSearchResult } from '@/shared/lib'
import { DEBOUNCE_CONFIG } from '@/shared/config/debounce'

export interface UseLocationSelectionReturn {
  handleSelectLocation: (result: LocationSearchResult) => void
}

/**
 * 위치 선택 기능을 관리하는 훅
 * 디바운싱을 포함하여 빠른 연속 클릭을 방지합니다.
 */
export function useLocationSelection(
  onSelectComplete?: () => void,
): UseLocationSelectionReturn {
  const router = useRouter()
  const { searchCoordinates } = useKakaoSearch()
  const selectLocationTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleSelectLocation = useCallback(
    (result: LocationSearchResult) => {
      // 이전 타이머가 있으면 취소
      if (selectLocationTimeoutRef.current !== null) {
        clearTimeout(selectLocationTimeoutRef.current)
      }

      // 새로운 타이머 설정 (디바운싱 지연)
      selectLocationTimeoutRef.current = setTimeout(async () => {
        let lat = result.y
        let lon = result.x

        // 좌표가 없으면 카카오 API로 검색하여 좌표 가져오기
        if (lat === 0 && lon === 0) {
          try {
            const coordinates = await searchCoordinates(result.formattedAddress)
            if (!coordinates) {
              alert('해당 주소의 좌표를 찾을 수 없습니다.')
              return
            }
            lat = coordinates.latitude
            lon = coordinates.longitude
          } catch (err) {
            console.error('좌표 가져오기 실패:', err)
            alert(
              err instanceof Error ? err.message : '좌표를 가져오는데 실패했습니다. 다시 시도해주세요.',
            )
            return
          }
        }

        // 유효한 좌표인지 확인
        if (Number.isNaN(lat) || Number.isNaN(lon) || lat === 0 || lon === 0) {
          alert('유효한 좌표 정보가 없습니다. 다시 검색해주세요.')
          return
        }

        // 다이나믹 라우트로 이동: /weather/[lat]/[lon]
        router.push(`/weather/${lat.toFixed(6)}/${lon.toFixed(6)}`)
        
        // 선택 완료 콜백 호출
        if (onSelectComplete) {
          onSelectComplete()
        }
      }, DEBOUNCE_CONFIG.locationSelection)
    },
    [router, searchCoordinates, onSelectComplete],
  )

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (selectLocationTimeoutRef.current !== null) {
        clearTimeout(selectLocationTimeoutRef.current)
      }
    }
  }, [])

  return {
    handleSelectLocation,
  }
}
