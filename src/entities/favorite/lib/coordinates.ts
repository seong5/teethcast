/* 즐겨찾기 좌표·ID 통일용 유틸 */

const PRECISION_6 = 1_000_000
const PRECISION_5 = 100_000

/* 좌표를 소수 6자리로 반올림 (저장·ID·URL 통일용) */
export function roundTo6Decimals(value: number): number {
  return Math.round(value * PRECISION_6) / PRECISION_6
}

/* 좌표를 소수 5자리로 반올림 (GPS 오차 허용, 같은 장소 판별용) */
export function roundTo5Decimals(value: number): number {
  return Math.round(value * PRECISION_5) / PRECISION_5
}

/* 좌표 기반 즐겨찾기 ID 생성 (소수 6자리) */
export function generateFavoriteId(lat: number, lon: number): string {
  const roundedLat = roundTo6Decimals(lat)
  const roundedLon = roundTo6Decimals(lon)
  return `${roundedLat}-${roundedLon}`
}

/* 같은 장소인지 비교할 때 사용 (소수 5자리, GPS 오차 허용) */
export function generateFavoriteIdCoarse(lat: number, lon: number): string {
  const roundedLat = roundTo5Decimals(lat)
  const roundedLon = roundTo5Decimals(lon)
  return `${roundedLat}-${roundedLon}`
}
