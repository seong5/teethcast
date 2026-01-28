'use client'

import WeatherIcon from '@/shared/ui/WeatherIcon'
import type { DailyWeather } from '@/shared/lib/useWeather'

export interface DailyWeatherCardProps {
  daily: DailyWeather[]
}

export default function DailyWeatherCard({ daily }: DailyWeatherCardProps) {
  if (!daily || daily.length === 0) {
    return null
  }

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 h-full flex flex-col gap-3">
      {daily.map((day) => (
        <div
          key={day.date}
          className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-transparent hover:border-gray-200 dark:hover:border-gray-600 transition-colors flex-1"
        >
            <div className="flex items-center gap-4 flex-1">
              <div className="flex-shrink-0">
                <div className="text-sm font-bold text-gray-900 dark:text-white min-w-[3rem]">
                  {day.dateLabel}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {day.date.split('-').slice(1).join('/')}
                </div>
              </div>

              <div className="flex-shrink-0">
                <WeatherIcon
                  sky={day.sky}
                  precipitation={day.precipitation}
                  size={40}
                  aria-label={`${day.sky} ${day.precipitation !== '없음' ? day.precipitation : ''}`.trim()}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                  {day.sky}
                  {day.precipitation !== '없음' && ` · ${day.precipitation}`}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">최저</div>
                <div className="text-lg font-bold text-blue-500 dark:text-blue-400">
                  {Math.round(day.minTemp * 10) / 10}°
                </div>
              </div>
              <div className="text-gray-300 dark:text-gray-600">/</div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">최고</div>
                <div className="text-lg font-bold text-red-500 dark:text-red-400">
                  {Math.round(day.maxTemp * 10) / 10}°
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  )
}
