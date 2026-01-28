'use client'

import { Star } from 'lucide-react'
import { useFavorites } from '@/entities/favorite'

export interface FavoriteButtonProps {
  latitude: number
  longitude: number
  name: string
  className?: string
  size?: number
}

export default function FavoriteButton({
  latitude,
  longitude,
  name,
  className = '',
  size = 24,
}: FavoriteButtonProps) {
  const { isFavorite, addFavorite, removeFavorite, getFavoriteId } = useFavorites()
  const favoriteId = getFavoriteId(latitude, longitude)
  const isFav = isFavorite(latitude, longitude)

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()

    if (isFav) {
      removeFavorite(favoriteId)
    } else {
      addFavorite({
        name,
        latitude,
        longitude,
      })
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
