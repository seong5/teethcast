'use client'

import WeatherIcon, { WindIcon, HumidityIcon } from '@/shared/ui/WeatherIcon'
import type { WeatherData } from '@/shared/lib/useWeather'

interface WeatherCardProps {
  weather: WeatherData
  address?: string
}

export default function WeatherCard({ weather, address }: WeatherCardProps) {
  return (
    <div className="w-full">
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-6 shadow-xl border border-white/20 dark:border-gray-700">
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-blue-400/20 blur-2xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 rounded-full bg-purple-400/20 blur-2xl pointer-events-none"></div>

        <div className="relative flex flex-col items-center gap-6 text-center">
          {address && (
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              {address}
            </div>
          )}
          <div className="flex flex-col items-center gap-2">
            <div className="relative flex items-center justify-center">
              <div>
                <WeatherIcon
                  sky={weather.sky}
                  precipitation={weather.precipitation}
                  size={80}
                  aria-label={`${weather.sky} ${weather.precipitation !== '없음' ? weather.precipitation : ''}`.trim()}
                />
              </div>
              <div className="text-5xl font-extrabold text-gray-800 dark:text-white tracking-tight relative">
                {weather.temperature}°
              </div>
            </div>

            <div className="text-lg font-medium text-gray-600 dark:text-gray-300 bg-white/30 dark:bg-black/20 px-4 py-1 rounded-full">
              {weather.sky}
              {weather.precipitation !== '없음' ? ` · ${weather.precipitation}` : ''}
            </div>
          </div>
          <div className="grid grid-cols-4 gap-3 w-full">
            <div className="bg-white/60 dark:bg-gray-800/50 rounded-2xl p-4 flex flex-col items-center justify-center backdrop-blur-sm shadow-sm">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                최저기온
              </span>
              <span className="text-xl font-bold text-blue-500 dark:text-blue-400">
                {weather.minTemp}°
              </span>
            </div>
            <div className="bg-white/60 dark:bg-gray-800/50 rounded-2xl p-4 flex flex-col items-center justify-center backdrop-blur-sm shadow-sm">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                최고기온
              </span>
              <span className="text-xl font-bold text-red-500 dark:text-red-400">
                {weather.maxTemp}°
              </span>
            </div>
            <div className="bg-white/60 dark:bg-gray-800/50 rounded-2xl p-4 flex flex-row items-center justify-between backdrop-blur-sm shadow-sm">
              <div className="flex flex-col items-start">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">습도</span>
                <span className="text-lg font-bold text-gray-800 dark:text-gray-100">
                  {weather.humidity}%
                </span>
              </div>
              <HumidityIcon size={24} className="opacity-80" />
            </div>
            <div className="bg-white/60 dark:bg-gray-800/50 rounded-2xl p-4 flex flex-row items-center justify-between backdrop-blur-sm shadow-sm">
              <div className="flex flex-col items-start">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">풍속</span>
                <span className="text-lg font-bold text-gray-800 dark:text-gray-100">
                  {weather.windSpeed}
                  <span className="text-xs font-normal ml-0.5">m/s</span>
                </span>
              </div>
              <WindIcon size={24} className="opacity-80" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
