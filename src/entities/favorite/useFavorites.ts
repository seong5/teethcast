'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { FavoriteLocation } from './model'

interface FavoritesStore {
  favorites: FavoriteLocation[]
  _hasHydrated: boolean
  setHasHydrated: (hasHydrated: boolean) => void
  addFavorite: (location: Omit<FavoriteLocation, 'id' | 'createdAt'>, customId?: string) => void
  removeFavorite: (id: string) => void
  isFavorite: (lat: number, lon: number) => boolean
  getFavoriteId: (lat: number, lon: number) => string
  clearAll: () => void
}

/**
 * 좌표를 기반으로 고유 ID 생성
 * @param lat 위도
 * @param lon 경도
 * @returns 고유 ID 문자열
 */
function generateFavoriteId(lat: number, lon: number): string {
  // 소수점 6자리까지 반올림하여 ID 생성
  const roundedLat = Math.round(lat * 1000000) / 1000000
  const roundedLon = Math.round(lon * 1000000) / 1000000
  return `${roundedLat}-${roundedLon}`
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      _hasHydrated: false,

      /* Hydration 완료 상태 설정 */
      setHasHydrated: (hasHydrated: boolean) => {
        set({ _hasHydrated: hasHydrated })
      },

      /**
       * 즐겨찾기 추가
       * @param location 즐겨찾기할 위치 정보
       * @param customId 커스텀 ID (예: 현재 위치용 'current-location')
       */
      addFavorite: (location, customId) => {
        const id = customId ?? generateFavoriteId(location.latitude, location.longitude)

        // 이미 같은 ID의 즐겨찾기가 있는지 확인
        const exists = get().favorites.some((fav) => fav.id === id)
        if (exists) {
          return
        }

        const newFavorite: FavoriteLocation = {
          ...location,
          id,
          createdAt: new Date().toISOString(),
        }

        set((state) => ({
          favorites: [...state.favorites, newFavorite],
        }))
      },

      /**
       * 즐겨찾기 제거
       * @param id 즐겨찾기 ID
       */
      removeFavorite: (id) => {
        set((state) => ({
          favorites: state.favorites.filter((fav) => fav.id !== id),
        }))
      },

      /**
       * 즐겨찾기 여부 확인
       * @param lat 위도
       * @param lon 경도
       * @returns 즐겨찾기 여부
       */
      isFavorite: (lat, lon) => {
        const id = generateFavoriteId(lat, lon)
        return get().favorites.some((fav) => fav.id === id)
      },

      /**
       * 좌표로 즐겨찾기 ID 가져오기
       * @param lat 위도
       * @param lon 경도
       * @returns 즐겨찾기 ID
       */
      getFavoriteId: (lat, lon) => {
        return generateFavoriteId(lat, lon)
      },

      /* 모든 즐겨찾기 제거 */
      clearAll: () => {
        set({ favorites: [] })
      },
    }),
    {
      name: 'teethcast-favorites', // localStorage 키 이름
      version: 1, // 스키마 버전 (나중에 마이그레이션 시 사용)
      onRehydrateStorage: () => (state) => {
        // hydration 완료 시 플래그 설정
        if (state) {
          state.setHasHydrated(true)
        }
      },
      partialize: (state) => ({
        favorites: state.favorites,
      }),
    },
  ),
)

/* 즐겨찾기 Hook 컴포넌트에서 사용하기 편하도록 hook 형태로 제공 */
export function useFavorites() {
  const favorites = useFavoritesStore((state) => state.favorites)
  const hasHydrated = useFavoritesStore((state) => state._hasHydrated)
  const addFavorite = useFavoritesStore((state) => state.addFavorite)
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite)
  const isFavorite = useFavoritesStore((state) => state.isFavorite)
  const getFavoriteId = useFavoritesStore((state) => state.getFavoriteId)
  const clearAll = useFavoritesStore((state) => state.clearAll)

  return {
    favorites,
    hasHydrated,
    addFavorite,
    removeFavorite,
    isFavorite,
    getFavoriteId,
    clearAll,
  }
}
