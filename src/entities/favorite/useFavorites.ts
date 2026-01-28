'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { FavoriteLocation } from './model'

interface FavoritesStore {
  favorites: FavoriteLocation[]
  addFavorite: (location: Omit<FavoriteLocation, 'id' | 'createdAt'>) => void
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

      /**
       * 즐겨찾기 추가
       * @param location 즐겨찾기할 위치 정보
       */
      addFavorite: (location) => {
        const id = generateFavoriteId(location.latitude, location.longitude)
        
        // 이미 즐겨찾기에 있는지 확인
        if (get().isFavorite(location.latitude, location.longitude)) {
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

      /**
       * 모든 즐겨찾기 제거
       */
      clearAll: () => {
        set({ favorites: [] })
      },
    }),
    {
      name: 'teethcast-favorites', // localStorage 키 이름
      version: 1, // 스키마 버전 (나중에 마이그레이션 시 사용)
    },
  ),
)

/**
 * 즐겨찾기 Hook (편의를 위한 wrapper)
 * 컴포넌트에서 사용하기 편하도록 hook 형태로 제공
 */
export function useFavorites() {
  const favorites = useFavoritesStore((state) => state.favorites)
  const addFavorite = useFavoritesStore((state) => state.addFavorite)
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite)
  const isFavorite = useFavoritesStore((state) => state.isFavorite)
  const getFavoriteId = useFavoritesStore((state) => state.getFavoriteId)
  const clearAll = useFavoritesStore((state) => state.clearAll)

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    getFavoriteId,
    clearAll,
  }
}
