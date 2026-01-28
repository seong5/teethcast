/* 타입 가드 함수들 */

import type { KakaoSearchResponse, KakaoRegionCodeResponse } from './kakao'
import type { HierarchicalRegions } from '@/shared/lib/regionSearch'

/* 카카오 검색 API 응답 타입 가드 */
export function isKakaoSearchResponse(data: unknown): data is KakaoSearchResponse {
  if (typeof data !== 'object' || data === null) {
    return false
  }

  const obj = data as Record<string, unknown>

  if (!('documents' in obj) || !('meta' in obj)) {
    return false
  }

  if (!Array.isArray(obj.documents)) {
    return false
  }

  // documents 배열의 첫 번째 항목 검증
  if (obj.documents.length > 0) {
    const firstDoc = obj.documents[0] as Record<string, unknown>
    if (
      typeof firstDoc.x !== 'string' ||
      typeof firstDoc.y !== 'string' ||
      typeof firstDoc.place_name !== 'string'
    ) {
      return false
    }
  }

  // meta 객체 검증
  const meta = obj.meta as Record<string, unknown>
  if (typeof meta.total_count !== 'number') {
    return false
  }

  return true
}

/* 카카오 행정구역 코드 API 응답 타입 가드 */
export function isKakaoRegionCodeResponse(data: unknown): data is KakaoRegionCodeResponse {
  if (typeof data !== 'object' || data === null) {
    return false
  }

  const obj = data as Record<string, unknown>

  if (!('documents' in obj) || !('meta' in obj)) {
    return false
  }

  if (!Array.isArray(obj.documents)) {
    return false
  }

  // documents 배열의 첫 번째 항목 검증
  if (obj.documents.length > 0) {
    const firstDoc = obj.documents[0] as Record<string, unknown>
    if (
      typeof firstDoc.region_type !== 'string' ||
      typeof firstDoc.region_1depth_name !== 'string' ||
      typeof firstDoc.region_2depth_name !== 'string'
    ) {
      return false
    }
  }

  // meta 객체 검증
  const meta = obj.meta as Record<string, unknown>
  if (typeof meta.total_count !== 'number') {
    return false
  }

  return true
}

/* 계층 구조 행정구역 데이터 타입 가드 */
export function isHierarchicalRegions(data: unknown): data is HierarchicalRegions {
  if (typeof data !== 'object' || data === null) {
    return false
  }

  const obj = data as Record<string, unknown>

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key]
      if (typeof value !== 'object' || value === null) {
        return false
      }

      const sigunguObj = value as Record<string, unknown>
      for (const sigunguKey in sigunguObj) {
        if (Object.prototype.hasOwnProperty.call(sigunguObj, sigunguKey)) {
          const dongArray = sigunguObj[sigunguKey]
          if (!Array.isArray(dongArray)) {
            return false
          }
          if (!dongArray.every((dong) => typeof dong === 'string')) {
            return false
          }
        }
      }
    }
  }

  return true
}
