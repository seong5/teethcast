'use client'

import WeatherIcon, { WindIcon, HumidityIcon } from '@/shared/ui/WeatherIcon'
import type { WeatherData } from '@/shared/lib'
import { FavoriteButton } from '@/features/favorite-management'

export interface WeatherCardProps {
  weather: WeatherData
  address?: string
  latitude?: number
  longitude?: number
  favoriteIdOverride?: string
}

export default function WeatherCard({
  weather,
  address,
  latitude,
  longitude,
  favoriteIdOverride,
}: WeatherCardProps) {
  return (
    <div className="w-full h-full">
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-4 shadow-xl border border-white/20 dark:border-gray-700 h-full flex flex-col md:rounded-3xl md:p-6">
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-blue-400/20 blur-2xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 rounded-full bg-purple-400/20 blur-2xl pointer-events-none"></div>

        {latitude !== undefined &&
          longitude !== undefined &&
          address &&
          !Number.isNaN(latitude) &&
          !Number.isNaN(longitude) && (
            <div className="absolute top-4 right-4 z-10">
              <FavoriteButton
                latitude={latitude}
                longitude={longitude}
                name={address}
                size={28}
                idOverride={favoriteIdOverride}
              />
            </div>
          )}

        <div className="relative flex flex-col items-center gap-4 text-center flex-1 justify-center md:gap-6">
          {address && (
            <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 line-clamp-2 md:text-sm md:mb-2">
              {address}
            </div>
          )}
          <div className="flex flex-col items-center gap-2 md:gap-3">
            <div className="relative flex items-center justify-center gap-2 md:gap-3">
              <div className="flex-shrink-0">
                <WeatherIcon
                  sky={weather.sky}
                  precipitation={weather.precipitation}
                  size={80}
                  aria-label={`${weather.sky} ${weather.precipitation !== '없음' ? weather.precipitation : ''}`.trim()}
                  className="w-20 h-20 md:w-24 md:h-24"
                />
              </div>
              <div className="text-4xl font-extrabold text-gray-800 dark:text-white tracking-tight relative md:text-5xl">
                {Math.round(weather.temperature * 10) / 10}°
              </div>
            </div>

            <div className="text-sm font-medium text-gray-600 dark:text-gray-300 bg-white/30 dark:bg-black/20 px-3 py-1 rounded-full md:text-lg md:px-4">
              {weather.sky}
              {weather.precipitation !== '없음' ? ` · ${weather.precipitation}` : ''}
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full md:gap-3">
            <div className="bg-white/60 dark:bg-gray-800/50 rounded-xl p-3 flex flex-col items-center justify-center backdrop-blur-sm shadow-sm min-h-[72px] md:rounded-2xl md:p-4 md:min-h-[80px]">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 md:mb-1.5">
                최저기온
              </span>
              <span className="text-lg font-bold text-blue-500 dark:text-blue-400 md:text-xl">
                {Math.round(weather.minTemp * 10) / 10}°
              </span>
            </div>
            <div className="bg-white/60 dark:bg-gray-800/50 rounded-xl p-3 flex flex-col items-center justify-center backdrop-blur-sm shadow-sm min-h-[72px] md:rounded-2xl md:p-4 md:min-h-[80px]">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 md:mb-1.5">
                최고기온
              </span>
              <span className="text-lg font-bold text-red-500 dark:text-red-400 md:text-xl">
                {Math.round(weather.maxTemp * 10) / 10}°
              </span>
            </div>
            <div className="bg-white/60 dark:bg-gray-800/50 rounded-xl p-3 flex flex-row items-center justify-between backdrop-blur-sm shadow-sm min-h-[72px] gap-2 md:rounded-2xl md:p-4 md:min-h-[80px]">
              <div className="flex flex-col items-start flex-1 min-w-0">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">
                  습도
                </span>
                <span className="text-base font-bold text-gray-800 dark:text-gray-100 md:text-lg">
                  {weather.humidity}%
                </span>
              </div>
              <HumidityIcon size={28} className="opacity-80 flex-shrink-0 md:w-8 md:h-8" />
            </div>
            <div className="bg-white/60 dark:bg-gray-800/50 rounded-xl p-3 flex flex-row items-center justify-between backdrop-blur-sm shadow-sm min-h-[72px] gap-2 md:rounded-2xl md:p-4 md:min-h-[80px]">
              <div className="flex flex-col items-start flex-1 min-w-0">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">
                  풍속
                </span>
                <span className="text-base font-bold text-gray-800 dark:text-gray-100 md:text-lg">
                  {weather.windSpeed}
                  <span className="text-xs font-normal ml-0.5">m/s</span>
                </span>
              </div>
              <WindIcon size={28} className="opacity-80 flex-shrink-0 md:w-8 md:h-8" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
