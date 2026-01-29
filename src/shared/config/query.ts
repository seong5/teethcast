/* TanStack Query 설정 상수 */

const MINUTE = 1000 * 60
const HOUR = MINUTE * 60
const DAY = HOUR * 24

export const QUERY_CONFIG = {
  // 날씨 데이터 쿼리 설정
  weather: {
    staleTime: 10 * MINUTE, // 10분간 fresh 상태 유지
    gcTime: 30 * MINUTE, // 30분간 캐시 유지
  },

  // 지역 검색 쿼리 설정
  locationSearch: {
    staleTime: 5 * MINUTE, // 5분간 fresh 상태 유지
    gcTime: 30 * MINUTE, // 30분간 캐시 유지
  },

  // 카카오 검색 쿼리 설정 (좌표 검색)
  kakaoSearch: {
    staleTime: HOUR, // 1시간간 fresh 상태 유지 (좌표는 자주 바뀌지 않음)
    gcTime: DAY, // 24시간간 캐시 유지
  },

  // 역지오코딩 쿼리 설정 (좌표 → 주소)
  reverseGeocoding: {
    staleTime: HOUR, // 1시간간 fresh 상태 유지 (주소는 자주 바뀌지 않음)
    gcTime: DAY, // 24시간간 캐시 유지
  },

  // 기본 쿼리 설정 (QueryProvider에서 사용)
  default: {
    staleTime: 5 * MINUTE, // 5분
    gcTime: 10 * MINUTE, // 10분
    retry: 1,
    refetchOnWindowFocus: false,
  },
} as const
