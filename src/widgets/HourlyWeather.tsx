'use client'

import WeatherIcon from '@/shared/ui/WeatherIcon'
import type { HourlyWeather } from '@/shared/lib'

export interface HourlyWeatherCardProps {
  hourly: HourlyWeather[]
  baseTime?: string
}

export default function HourlyWeatherCard({ hourly, baseTime }: HourlyWeatherCardProps) {
  if (!hourly || hourly.length === 0) {
    return null
  }

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-xl border border-gray-100 dark:border-gray-700 md:rounded-3xl md:p-6">
      {baseTime && (
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-3 text-center md:mb-4">
          업데이트: {baseTime}
        </div>
      )}
      <div className="w-full overflow-x-auto -mx-1 px-1 md:overflow-visible md:mx-0 md:px-0">
        <div className="flex items-stretch gap-2 w-max min-w-full md:w-full md:min-w-0 md:gap-3">
          {hourly.map((hourlyItem, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-[88px] bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-center border border-transparent flex flex-col items-center md:flex-1 md:min-w-0 md:rounded-2xl"
            >
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 md:text-[15px] md:mb-2">
                {hourlyItem.time}
              </div>

              <div className="flex flex-col items-center gap-1 mb-1 md:gap-2 md:mb-2">
                <div className="p-1 bg-white dark:bg-gray-600 rounded-full shadow-sm md:p-1.5">
                  <WeatherIcon
                    sky={hourlyItem.sky}
                    precipitation={hourlyItem.precipitation}
                    size={28}
                    aria-label={`${hourlyItem.sky} ${hourlyItem.precipitation !== '없음' ? hourlyItem.precipitation : ''}`.trim()}
                  />
                </div>
                <div className="text-lg font-bold text-gray-900 dark:text-white tracking-tight md:text-xl">
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
                <div className="text-xs text-gray-400 dark:text-gray-500 mt-1 text-center md:text-[15px]">
                  {hourlyItem.sky}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
