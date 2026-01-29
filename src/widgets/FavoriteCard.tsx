'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil } from 'lucide-react'
import WeatherIcon from '@/shared/ui/WeatherIcon'
import { useWeather } from '@/shared/lib'
import { useFavoritesStore } from '@/entities/favorite'
import type { FavoriteLocation } from '@/entities/favorite'
import FavoriteButton from './FavoriteButton'

export interface FavoriteCardProps {
  favorite: FavoriteLocation
}

export default function FavoriteCard({ favorite }: FavoriteCardProps) {
  const router = useRouter()
  const { weather, isLoading, getWeather } = useWeather()
  const updateFavoriteNickName = useFavoritesStore((state) => state.updateFavoriteNickName)
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState('')

  const displayName = favorite.nickName ?? favorite.name

  useEffect(() => {
    getWeather(favorite.latitude, favorite.longitude)
  }, [favorite.latitude, favorite.longitude, getWeather])

  const handleClick = () => {
    if (isEditing) return
    router.push(`/weather/${favorite.latitude.toFixed(6)}/${favorite.longitude.toFixed(6)}`)
  }

  const handleSaveNickName = () => {
    const trimmed = editValue.trim()
    if (trimmed !== displayName) {
      updateFavoriteNickName(favorite.id, trimmed)
    }
    setIsEditing(false)
  }

  const handleStartEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    setEditValue(displayName)
    setIsEditing(true)
  }

  if (isLoading) {
    return (
      <div
        onClick={handleClick}
        className="w-full bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 cursor-pointer hover:shadow-2xl transition-shadow"
      >
        <div className="flex items-center justify-center min-h-[160px]">
          <div className="text-sm text-gray-500 dark:text-gray-400">날씨 정보를 불러오는 중...</div>
        </div>
      </div>
    )
  }

  if (!weather) {
    return (
      <div
        onClick={handleClick}
        className="w-full bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 cursor-pointer hover:shadow-2xl transition-shadow"
      >
        <div className="flex items-center justify-center min-h-[160px]">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            날씨 정보를 불러올 수 없습니다.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      onClick={handleClick}
      className="relative w-full cursor-pointer overflow-hidden rounded-3xl border border-gray-100 bg-white p-4 shadow-xl transition-shadow hover:shadow-2xl dark:border-gray-700 dark:bg-gray-800"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') handleClick()
      }}
      aria-label={`${displayName} 날씨 상세로 이동`}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 min-w-0 min-h-12">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {isEditing ? (
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={handleSaveNickName}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveNickName()
                  if (e.key === 'Escape') {
                    setEditValue('')
                    setIsEditing(false)
                  }
                }}
                onClick={(e) => e.stopPropagation()}
                className="flex-1 min-w-0 max-w-full text-sm font-medium text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#10a6c1]"
                aria-label="별명 입력"
                autoFocus
              />
            ) : (
              <div className="flex items-center gap-1.5 min-w-0 flex-1">
                <button
                  type="button"
                  onClick={handleStartEdit}
                  className="flex-shrink-0 p-0.5 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                  aria-label="별명 수정"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300 line-clamp-2 min-w-0 flex-1">
                  {displayName}
                </span>
              </div>
            )}
          </div>
          <div className="flex-shrink-0">
            <FavoriteButton
              latitude={favorite.latitude}
              longitude={favorite.longitude}
              name={displayName}
              size={28}
              idOverride={favorite.id}
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex-shrink-0">
              <WeatherIcon
                sky={weather.sky}
                precipitation={weather.precipitation}
                size={44}
                aria-label={`${weather.sky} ${weather.precipitation !== '없음' ? weather.precipitation : ''}`.trim()}
              />
            </div>

            <div className="min-w-0">
              <div className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                {Math.round(weather.temperature * 10) / 10}°
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {weather.sky}
                {weather.precipitation !== '없음' ? ` · ${weather.precipitation}` : ''}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="text-right">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400">최저</div>
              <div className="text-lg font-bold text-blue-500 dark:text-blue-400">
                {Math.round(weather.minTemp * 10) / 10}°
              </div>
            </div>
            <div className="text-gray-300 dark:text-gray-600">/</div>
            <div className="text-right">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400">최고</div>
              <div className="text-lg font-bold text-red-500 dark:text-red-400">
                {Math.round(weather.maxTemp * 10) / 10}°
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
