'use client'

import { useMemo } from 'react'
import { Star } from 'lucide-react'
import { showToast } from '@/shared/ui/toast'
import {
  useFavoritesStore,
  generateFavoriteId,
  generateFavoriteIdCoarse,
} from '@/entities/favorite'

export interface FavoriteButtonProps {
  latitude: number
  longitude: number
  name: string
  className?: string
  size?: number
  idOverride?: string
}

export default function FavoriteButton({
  latitude,
  longitude,
  name,
  className = '',
  size = 24,
  idOverride,
}: FavoriteButtonProps) {
  // favorites 배열과 hydration 상태를 직접 구독
  const favorites = useFavoritesStore((state) => state.favorites)
  const hasHydrated = useFavoritesStore((state) => state._hasHydrated)
  const addFavorite = useFavoritesStore((state) => state.addFavorite)
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite)

  const favoriteId = useMemo(
    () => (idOverride ? idOverride : generateFavoriteId(latitude, longitude)),
    [latitude, longitude, idOverride],
  )

  // hydration이 완료된 후에만 즐겨찾기 여부를 계산
  const isFav = useMemo(() => {
    if (!hasHydrated) return false
    // 정확한 ID 매칭
    if (favorites.some((fav) => fav.id === favoriteId)) return true
    // idOverride 없을 때(홈의 현재 위치): GPS 오차로 ID가 달라질 수 있으므로, 소수 5자리(coarse)로도 비교
    if (idOverride == null) {
      const coarseId = generateFavoriteIdCoarse(latitude, longitude)
      return favorites.some(
        (fav) => generateFavoriteIdCoarse(fav.latitude, fav.longitude) === coarseId,
      )
    }
    return false
  }, [favorites, favoriteId, hasHydrated, idOverride, latitude, longitude])

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()

    if (isFav) {
      // idOverride 없을 때(홈): coarse로 매칭된 항목의 실제 id로 제거
      const idToRemove =
        idOverride != null
          ? favoriteId
          : (favorites.find((fav) => fav.id === favoriteId)?.id ??
            favorites.find(
              (fav) =>
                generateFavoriteIdCoarse(fav.latitude, fav.longitude) ===
                generateFavoriteIdCoarse(latitude, longitude),
            )?.id ??
            favoriteId)
      removeFavorite(idToRemove)
      showToast.success('즐겨찾기에서 제거했습니다.')
    } else {
      if (favorites.length >= 6) {
        showToast.error('즐겨찾기는 최대 6개까지 추가할 수 있습니다.')
        return
      }

      addFavorite(
        {
          name,
          latitude,
          longitude,
        },
        idOverride,
      )
      showToast.favoriteAdded(name)
    }
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`relative flex items-center justify-center transition-all duration-200 active:scale-95 ${className}`}
      aria-label={isFav ? '즐겨찾기에서 제거' : '즐겨찾기에 추가'}
      aria-pressed={isFav}
    >
      <Star
        size={size}
        className={`transition-all duration-200 ${
          isFav ? 'fill-yellow-500 text-yellow-500' : 'fill-none text-gray-400'
        }`}
        strokeWidth={2}
      />
      <span
        className={`absolute inset-0 rounded-full transition-all duration-200 ${
          isFav ? 'bg-yellow-500/20 scale-100' : 'bg-gray-400/0'
        }`}
        aria-hidden="true"
      />
    </button>
  )
}
