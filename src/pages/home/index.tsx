'use client'

import { useState, useEffect } from 'react'
import { SearchBar } from '@/shared/ui'
import { ClockIcon } from '@/shared/ui/WeatherIcon'
import WeatherCard from '@/widgets/WeatherCard'
import HourlyWeatherCard from '@/widgets/HourlyWeather'
import { useGeolocation, useReverseGeocoding, useWeather } from '@/shared/lib'
import type { WeatherData } from '@/shared/lib/useWeather'

export function HomePage() {
  const [searchValue, setSearchValue] = useState('')
  const { position, error, isLoading, getCurrentPosition } = useGeolocation()
  const {
    address,
    error: addressError,
    isLoading: addressLoading,
    getAddressFromCoordinates,
  } = useReverseGeocoding()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const { weather, error: weatherError, isLoading: weatherLoading, getWeather } = useWeather()

  useEffect(() => {
    // 페이지 로드 시 자동으로 현재 위치 감지
    getCurrentPosition()
  }, [getCurrentPosition])

  useEffect(() => {
    if (position) {
      getAddressFromCoordinates(position.latitude, position.longitude)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      getWeather(position.latitude, position.longitude)
    }
  }, [position, getAddressFromCoordinates, getWeather])

  const handleSearch = () => {
    console.log('검색:', searchValue)
  }

  return (
    <main className="flex min-h-screen flex-col items-center px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16 lg:p-10 bg-white dark:bg-gray-900">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <div className="w-full max-w-3xl mx-auto mb-8">
          <SearchBar
            value={searchValue}
            onChange={setSearchValue}
            placeholder="지역을 검색하세요 (예: 서울특별시, 종로구, 청운동)"
            onSearchClick={handleSearch}
          />
        </div>

        {(isLoading || addressLoading || weatherLoading) && (
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 mb-4">
            현재 위치와 날씨를 확인하는 중...
          </div>
        )}
        {(error || addressError || weatherError) && (
          <div className="text-center text-sm text-red-500 dark:text-red-400 mb-4">
            {error || addressError || weatherError}
          </div>
        )}

        {address && (
          <div className="space-y-6 max-w-3xl mx-auto w-full">
            {weather !== null && (
              <>
                <div>
                  <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                      />
                    </svg>
                    현재 날씨
                  </h2>
                  <WeatherCard weather={weather as WeatherData} address={address.fullAddress} />
                </div>

                {(weather as WeatherData).hourly && (
                  <div>
                    <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                      <ClockIcon size={20} />
                      시간대별 날씨
                    </h2>
                    <HourlyWeatherCard hourly={(weather as WeatherData).hourly} />
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
