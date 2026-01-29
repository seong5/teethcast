'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { SearchBar } from '@/shared/ui'
import { ClockIcon, CloudIcon } from '@/shared/ui/WeatherIcon'
import WeatherCard from '@/widgets/WeatherCard'
import HourlyWeatherCard from '@/widgets/HourlyWeather'
import DailyWeatherCard from '@/widgets/DailyWeather'
import SearchResults from '@/features/search/SearchResults'
import {
  useGeolocation,
  useReverseGeocoding,
  useWeather,
  useLocationSearch,
  useKakaoSearch,
} from '@/shared/lib'
import type { UseLocationSearchReturn } from '@/shared/lib'
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
  const { weather, error: weatherError, isLoading: weatherLoading, getWeather } = useWeather()
  const {
    results: searchResults,
    error: searchError,
    isLoading: searchLoading,
    search: searchLocation,
    clearResults,
  }: UseLocationSearchReturn = useLocationSearch()
  const {
    isLoading: isGettingCoordinates,
    error: kakaoSearchError,
    searchCoordinates,
  } = useKakaoSearch()

  useEffect(() => {
    // 페이지 로드 시 자동으로 현재 위치 감지
    getCurrentPosition()
  }, [getCurrentPosition])

  useEffect(() => {
    if (position) {
      getAddressFromCoordinates(position.latitude, position.longitude)
      getWeather(position.latitude, position.longitude)
    }
  }, [position, getAddressFromCoordinates, getWeather])

  const handleSearch = () => {
    if (searchValue.trim()) {
      searchLocation(searchValue)
    } else {
      clearResults()
    }
  }

  // 디바운싱 타이머를 위한 ref
  const selectLocationTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleSelectLocation = useCallback(
    (result: LocationSearchResult) => {
      // 이전 타이머가 있으면 취소
      if (selectLocationTimeoutRef.current !== null) {
        clearTimeout(selectLocationTimeoutRef.current)
      }

      // 새로운 타이머 설정 (500ms 지연)
      selectLocationTimeoutRef.current = setTimeout(async () => {
        let lat = result.y
        let lon = result.x

        // 좌표가 없으면 카카오 API로 검색하여 좌표 가져오기
        if (lat === 0 && lon === 0) {
          try {
            const coordinates = await searchCoordinates(result.formattedAddress)
            if (!coordinates) {
              alert('해당 주소의 좌표를 찾을 수 없습니다.')
              return
            }
            lat = coordinates.latitude
            lon = coordinates.longitude
          } catch (err) {
            console.error('좌표 가져오기 실패:', err)
            alert(
              err instanceof Error ? err.message : '좌표를 가져오는데 실패했습니다. 다시 시도해주세요.',
            )
            return
          }
        }

        // 유효한 좌표인지 확인
        if (Number.isNaN(lat) || Number.isNaN(lon) || lat === 0 || lon === 0) {
          alert('유효한 좌표 정보가 없습니다. 다시 검색해주세요.')
          return
        }

        // 다이나믹 라우트로 이동: /weather/[lat]/[lon]
        router.push(`/weather/${lat.toFixed(6)}/${lon.toFixed(6)}`)
        setSearchValue('')
        clearResults()
      }, 500)
    },
    [router, searchCoordinates, setSearchValue, clearResults],
  )

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (selectLocationTimeoutRef.current !== null) {
        clearTimeout(selectLocationTimeoutRef.current)
      }
    }
  }, [])

  // 검색 결과 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
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
      <div className="z-10 max-w-7xl w-full items-center justify-between font-mono text-sm">
        <div ref={searchContainerRef} className="w-full max-w-5xl mx-auto mb-8 relative">
          <SearchBar
            value={searchValue}
            onChange={setSearchValue}
            placeholder="지역을 검색하세요 (예: 서울특별시, 종로구, 청운동)"
            onSearchClick={handleSearch}
          />
          {(searchResults.length > 0 || searchLoading || isGettingCoordinates) && (
            <div className="absolute top-full left-0 right-0 z-50 mt-2">
              {isGettingCoordinates ? (
                <div className="mt-2 rounded-2xl border border-gray-100 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                  <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                    좌표 정보를 가져오는 중...
                  </div>
                </div>
              ) : (
                <SearchResults
                  results={searchResults}
                  onSelect={handleSelectLocation}
                  isLoading={searchLoading}
                />
              )}
            </div>
          )}
          {(searchError || kakaoSearchError) && (
            <div className="mt-2 text-center text-sm text-red-500 dark:text-red-400">
              {searchError || kakaoSearchError}
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
          <div className="space-y-6 max-w-5xl mx-auto w-full">
            {weather !== null && (
              <>
                <div className="flex flex-col lg:flex-row lg:items-stretch gap-6">
                  <div className="flex-1 flex flex-col">
                    <div className="mb-4 flex items-center gap-4">
                      <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <CloudIcon size={20} />
                        현재 날씨
                      </h2>
                      {weather.baseTime && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          업데이트: {weather.baseTime}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <WeatherCard
                        weather={weather}
                        address={address.fullAddress}
                        latitude={position?.latitude}
                        longitude={position?.longitude}
                        favoriteIdOverride="current-location"
                      />
                    </div>
                  </div>

                  {weather.daily && weather.daily.length > 0 && (
                    <div className="flex-1 lg:max-w-md flex flex-col">
                      <div className="mb-4 flex items-center gap-4">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                          <CloudIcon size={20} />
                          단기 예보
                        </h2>
                      </div>
                      <div className="flex-1">
                        <DailyWeatherCard daily={weather.daily} />
                      </div>
                    </div>
                  )}
                </div>

                {weather.hourly && (
                  <div>
                    <div className="mb-4 flex items-center gap-4">
                      <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <ClockIcon size={20} />
                        시간대별 날씨
                      </h2>
                      {weather.baseTime && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          업데이트: {weather.baseTime}
                        </span>
                      )}
                    </div>
                    <HourlyWeatherCard hourly={weather.hourly} />
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
