/**
 * 카카오 API 응답 타입 정의
 */

// 카카오 키워드 검색 API 응답 타입
export interface KakaoSearchDocument {
  id: string
  place_name: string
  x: string // 경도 (문자열)
  y: string // 위도 (문자열)
  address_name: string
  road_address_name?: string
  category_name?: string
  phone?: string
  place_url?: string
}

export interface KakaoSearchResponse {
  documents: KakaoSearchDocument[]
  meta: {
    total_count: number
    pageable_count: number
    is_end: boolean
  }
}

// 카카오 좌표→행정구역 코드 변환 API 응답 타입
export interface KakaoRegionDocument {
  region_type: 'B' | 'H' // B: 법정동, H: 행정동
  address_name: string
  region_1depth_name: string
  region_2depth_name: string
  region_3depth_name: string
  region_4depth_name: string
  code: string // 행정구역 코드
  x: number // 경도
  y: number // 위도
}

export interface KakaoRegionCodeResponse {
  documents: KakaoRegionDocument[]
  meta: {
    total_count: number
  }
}
