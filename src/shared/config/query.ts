/* TanStack Query 설정 상수 */

const MINUTE = 1000 * 60
const HOUR = MINUTE * 60
const DAY = HOUR * 24

export const QUERY_CONFIG = {
  // 날씨 데이터 쿼리 설정
  weather: {
    staleTime: 10 * MINUTE,
    gcTime: 30 * MINUTE,
  },

  // 지역 검색 쿼리 설정
  locationSearch: {
    staleTime: 5 * MINUTE,
    gcTime: 30 * MINUTE,
  },

  // 카카오 검색 쿼리 설정 (좌표 검색)
  kakaoSearch: {
    staleTime: HOUR,
    gcTime: DAY,
  },

  // 역지오코딩 쿼리 설정 (좌표 → 주소)
  reverseGeocoding: {
    staleTime: HOUR,
    gcTime: DAY,
  },

  // 현재 위치(Geolocation) 쿼리 설정
  geolocation: {
    staleTime: 5 * MINUTE,
    gcTime: 30 * MINUTE,
    retry: 0,
  },

  // 기본 쿼리 설정 (QueryProvider에서 사용)
  default: {
    staleTime: 5 * MINUTE,
    gcTime: 10 * MINUTE,
    retry: 1,
    refetchOnWindowFocus: false,
  },
} as const
