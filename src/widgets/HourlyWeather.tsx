'use client'

import WeatherIcon from '@/shared/ui/WeatherIcon'
import type { HourlyWeather } from '@/shared/lib/useWeather'

export interface HourlyWeatherCardProps {
  hourly: HourlyWeather[]
  baseTime?: string
}

export default function HourlyWeatherCard({ hourly, baseTime }: HourlyWeatherCardProps) {
  if (!hourly || hourly.length === 0) {
    return null
  }

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700">
      {baseTime && (
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-4 text-center">
          업데이트: {baseTime}
        </div>
      )}
      <div className="relative">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-3 w-max px-1 mx-auto">
            {hourly.map((hourlyItem, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-24 bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-3 text-center border border-transparent flex flex-col items-center"
              >
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                  {hourlyItem.time}
                </div>

                <div className="flex flex-col items-center gap-2 mb-2">
                  <div className="p-1.5 bg-white dark:bg-gray-600 rounded-full shadow-sm">
                    <WeatherIcon
                      sky={hourlyItem.sky}
                      precipitation={hourlyItem.precipitation}
                      size={28}
                      aria-label={`${hourlyItem.sky} ${hourlyItem.precipitation !== '없음' ? hourlyItem.precipitation : ''}`.trim()}
                    />
                  </div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                    {Math.round(hourlyItem.temperature * 10) / 10}°
                  </div>
                </div>

                {hourlyItem.precipitation !== '없음' && (
                  <div className="flex items-center justify-center">
                    <div className="inline-block px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40">
                      <div className="text-[10px] font-bold text-blue-600 dark:text-blue-300">
                        {hourlyItem.precipitation}
                      </div>
                    </div>
                  </div>
                )}

                {hourlyItem.precipitation === '없음' && (
                  <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 text-center">
                    {hourlyItem.sky}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-white dark:from-gray-800 to-transparent pointer-events-none" />
      </div>
    </div>
  )
}
