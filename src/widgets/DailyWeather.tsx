'use client'

import WeatherIcon from '@/shared/ui/WeatherIcon'
import type { DailyWeather } from '@/shared/lib'

export interface DailyWeatherCardProps {
  daily: DailyWeather[]
}

export default function DailyWeatherCard({ daily }: DailyWeatherCardProps) {
  if (!daily || daily.length === 0) {
    return null
  }

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-xl border border-gray-100 dark:border-gray-700 h-full flex flex-col gap-2 min-h-[260px] md:rounded-3xl md:p-6 md:gap-3 md:min-h-[300px]">
      {daily.map((day) => (
        <div
          key={day.date}
          className="flex flex-col items-center gap-2 rounded-xl p-3 bg-gray-50 dark:bg-gray-700/50 border border-transparent min-h-[72px] hover:border-gray-200 dark:hover:border-gray-600 transition-colors sm:flex-row sm:items-center sm:justify-between sm:gap-4 md:rounded-2xl md:p-4 md:flex-1 md:min-h-[80px]"
        >
            <div className="flex items-center gap-3 flex-1 min-w-0 sm:gap-4">
              <div className="flex-shrink-0 text-center sm:text-left">
                <div className="text-xs font-bold text-gray-900 dark:text-white min-w-[2.5rem] md:text-sm md:min-w-[3rem]">
                  {day.dateLabel}
                </div>
                <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 md:text-xs">
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

              <div className="flex-1 min-w-0 text-center sm:text-left">
                <div className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate md:text-sm">
                  {day.sky}
                  {day.precipitation !== '없음' && ` · ${day.precipitation}`}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0 sm:gap-3">
              <div className="text-center sm:text-right">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 md:text-sm">최저</div>
                <div className="text-base font-bold text-blue-500 dark:text-blue-400 md:text-lg">
                  {Math.round(day.minTemp * 10) / 10}°
                </div>
              </div>
              <div className="text-gray-300 dark:text-gray-600">/</div>
              <div className="text-center sm:text-right">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 md:text-sm">최고</div>
                <div className="text-base font-bold text-red-500 dark:text-red-400 md:text-lg">
                  {Math.round(day.maxTemp * 10) / 10}°
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  )
}
