'use client'

import { useMemo } from 'react'
import { Star } from 'lucide-react'
import { showToast } from '@/shared/ui/toast'
import { useFavoritesStore } from '@/entities/favorite'

export interface FavoriteButtonProps {
  latitude: number
  longitude: number
  name: string
  className?: string
  size?: number
  idOverride?: string
}

function generateFavoriteId(lat: number, lon: number): string {
  const roundedLat = Math.round(lat * 1000000) / 1000000
  const roundedLon = Math.round(lon * 1000000) / 1000000
  return `${roundedLat}-${roundedLon}`
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
    return favorites.some((fav) => fav.id === favoriteId)
  }, [favorites, favoriteId, hasHydrated])

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()

    if (isFav) {
      removeFavorite(favoriteId)
      showToast.success('즐겨찾기에서 제거했습니다.')
    } else {
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
