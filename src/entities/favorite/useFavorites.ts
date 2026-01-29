'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { FavoriteLocation } from './model'
import {
  roundTo6Decimals,
  generateFavoriteId,
} from './lib/coordinates'

interface FavoritesStore {
  favorites: FavoriteLocation[]
  _hasHydrated: boolean
  setHasHydrated: (hasHydrated: boolean) => void
  addFavorite: (location: Omit<FavoriteLocation, 'id' | 'createdAt'>, customId?: string) => void
  removeFavorite: (id: string) => void
  updateFavoriteNickName: (id: string, nickName: string) => void
  isFavorite: (lat: number, lon: number) => boolean
  getFavoriteId: (lat: number, lon: number) => string
  clearAll: () => void
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
       * 좌표는 소수 6자리로 반올림해 저장·ID와 통일
       * @param location 즐겨찾기할 위치 정보
       * @param customId 커스텀 ID (없으면 좌표 기반 ID 사용)
       */
      addFavorite: (location, customId) => {
        const roundedLat = roundTo6Decimals(location.latitude)
        const roundedLon = roundTo6Decimals(location.longitude)
        const id = customId ?? generateFavoriteId(roundedLat, roundedLon)

        // 이미 같은 ID의 즐겨찾기가 있는지 확인
        const exists = get().favorites.some((fav) => fav.id === id)
        if (exists) {
          return
        }

        const newFavorite: FavoriteLocation = {
          ...location,
          latitude: roundedLat,
          longitude: roundedLon,
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
       * 즐겨찾기 별칭(닉네임) 변경
       * @param id 즐겨찾기 ID
       * @param nickName 새 별칭
       */
      updateFavoriteNickName: (id, nickName) => {
        const trimmed = nickName.trim()
        set((state) => ({
          favorites: state.favorites.map((fav) =>
            fav.id === id ? { ...fav, nickName: trimmed || undefined } : fav,
          ),
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
  const updateFavoriteNickName = useFavoritesStore((state) => state.updateFavoriteNickName)
  const isFavorite = useFavoritesStore((state) => state.isFavorite)
  const getFavoriteId = useFavoritesStore((state) => state.getFavoriteId)
  const clearAll = useFavoritesStore((state) => state.clearAll)

  return {
    favorites,
    hasHydrated,
    addFavorite,
    removeFavorite,
    updateFavoriteNickName,
    isFavorite,
    getFavoriteId,
    clearAll,
  }
}
