/**
 * 즐겨찾기 엔티티 모델
 */

export interface FavoriteLocation {
  id: string // 고유 ID (lat-lon 기반)
  name: string // 주소명 (예: "서울특별시 종로구 청운동")
  latitude: number // 위도
  longitude: number // 경도
  createdAt: string // 추가한 시간 (ISO string)
}
