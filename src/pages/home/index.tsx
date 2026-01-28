'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { SearchBar } from '@/shared/ui'
import { ClockIcon, CloudIcon } from '@/shared/ui/WeatherIcon'
import WeatherCard from '@/widgets/WeatherCard'
import HourlyWeatherCard from '@/widgets/HourlyWeather'
import SearchResults from '@/features/search/SearchResults'
import {
  useGeolocation,
  useReverseGeocoding,
  useWeather,
  useLocationSearch,
} from '@/shared/lib'
import type { WeatherData } from '@/shared/lib/useWeather'
import type { LocationSearchResult } from '@/shared/lib/useLocationSearch'

export function HomePage() {
  const router = useRouter()
  const [searchValue, setSearchValue] = useState('')
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const { position, error, isLoading, getCurrentPosition } = useGeolocation()
  const {
    address,
    error: addressError,
    isLoading: addressLoading,
    getAddressFromCoordinates,
  } = useReverseGeocoding()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const { weather, error: weatherError, isLoading: weatherLoading, getWeather } = useWeather()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const {
    results: searchResults,
    error: searchError,
    isLoading: searchLoading,
    search: searchLocation,
    clearResults,
  } = useLocationSearch()

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
    if (searchValue.trim()) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      searchLocation(searchValue)
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      clearResults()
    }
  }

  const handleSelectLocation = (result: LocationSearchResult) => {
    // 다이나믹 라우트로 이동: /weather/[lat]/[lon]
    const lat = result.y.toFixed(6)
    const lon = result.x.toFixed(6)
    router.push(`/weather/${lat}/${lon}`)
    setSearchValue('')
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    clearResults()
  }

  // 검색 결과 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        clearResults()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [clearResults])

  return (
    <main className="flex min-h-screen flex-col items-center px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16 lg:p-10 bg-white dark:bg-gray-900">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <div ref={searchContainerRef} className="w-full max-w-3xl mx-auto mb-8 relative">
          <SearchBar
            value={searchValue}
            onChange={setSearchValue}
            placeholder="지역을 검색하세요 (예: 서울특별시, 종로구, 청운동)"
            onSearchClick={handleSearch}
          />
          {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
          {(searchResults.length > 0 || searchLoading) && (
            <div className="absolute top-full left-0 right-0 z-50 mt-2">
              {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
              <SearchResults
                results={searchResults}
                onSelect={handleSelectLocation}
                isLoading={searchLoading}
              />
            </div>
          )}
          {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
          {searchError && (
            <div className="mt-2 text-center text-sm text-red-500 dark:text-red-400">
              {searchError}
            </div>
          )}
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
                  <div className="mb-4 flex items-center gap-4">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                      <CloudIcon size={20} />
                      현재 날씨
                    </h2>
                    {(weather as WeatherData).baseTime && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        업데이트: {(weather as WeatherData).baseTime}
                      </span>
                    )}
                  </div>
                  <WeatherCard weather={weather as WeatherData} address={address.fullAddress} />
                </div>

                {(weather as WeatherData).hourly && (
                  <div>
                    <div className="mb-4 flex items-center gap-4">
                      <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <ClockIcon size={20} />
                        시간대별 날씨
                      </h2>
                      {(weather as WeatherData).baseTime && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          업데이트: {(weather as WeatherData).baseTime}
                        </span>
                      )}
                    </div>
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
