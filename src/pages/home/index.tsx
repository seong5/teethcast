'use client'

import { useEffect, useMemo, useRef } from 'react'
import { SearchBar } from '@/shared/ui'
import { useFavoritesStore, generateFavoriteIdCoarse } from '@/entities/favorite'
import { ClockIcon, CloudIcon } from '@/shared/ui/WeatherIcon'
import { SectionTitleWithUpdate } from '@/shared/ui'
import WeatherCard from '@/widgets/WeatherCard'
import HourlyWeatherCard from '@/widgets/HourlyWeather'
import DailyWeatherCard from '@/widgets/DailyWeather'
import WeatherCardSkeleton from '@/widgets/WeatherCardSkeleton'
import DailyWeatherSkeleton from '@/widgets/DailyWeatherSkeleton'
import HourlyWeatherSkeleton from '@/widgets/HourlyWeatherSkeleton'
import { SearchResults } from '@/features/search'
import { useSearch } from '@/features/search'
import { useLocationSelection } from '@/features/location-selection'
import {
  useGeolocation,
  useReverseGeocoding,
  useWeather,
  useMinimumLoadingState,
} from '@/shared/lib'

const SKELETON_MIN_MS = 200

export function HomePage() {
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const { position, error, isLoading } = useGeolocation()
  const {
    address,
    error: addressError,
    isLoading: addressLoading,
    getAddressFromCoordinates,
  } = useReverseGeocoding()
  const { weather, error: weatherError, isLoading: weatherLoading, getWeather } = useWeather()

  // 위치는 있지만 주소/날씨가 아직 없을 때도 스켈레톤 유지 (깜빡임 방지)
  const isPending =
    isLoading ||
    addressLoading ||
    weatherLoading ||
    (position != null && (address == null || weather === null))

  const showSkeleton = useMinimumLoadingState(isPending, SKELETON_MIN_MS)
  const favorites = useFavoritesStore((state) => state.favorites)
  const favoriteIdOverride = useMemo(() => {
    if (position == null) return undefined
    const coarse = generateFavoriteIdCoarse(position.latitude, position.longitude)
    const matched = favorites.find(
      (fav) => generateFavoriteIdCoarse(fav.latitude, fav.longitude) === coarse,
    )
    return matched?.id
  }, [position, favorites])

  const {
    searchValue,
    setSearchValue,
    handleSearch,
    searchResults,
    searchError,
    searchLoading,
    isGettingCoordinates,
    kakaoSearchError,
    clearResults,
  } = useSearch()

  // 위치 선택 기능
  const { handleSelectLocation } = useLocationSelection(() => {
    setSearchValue('')
    clearResults()
  })

  useEffect(() => {
    if (position) {
      getAddressFromCoordinates(position.latitude, position.longitude)
      getWeather(position.latitude, position.longitude)
    }
  }, [position, getAddressFromCoordinates, getWeather])

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
      <div className="z-10 max-w-7xl w-full items-center justify-between font-mono text-xs md:text-sm">
        <div ref={searchContainerRef} className="w-full max-w-5xl mx-auto mb-6 md:mb-8 relative">
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
                  <div className="text-center text-xs text-gray-500 dark:text-gray-400 md:text-sm">
                    좌표 정보를 가져오는 중...
                  </div>
                </div>
              ) : (
                <SearchResults
                  key={searchValue}
                  results={searchResults}
                  onSelect={handleSelectLocation}
                  isLoading={searchLoading}
                />
              )}
            </div>
          )}
          {(searchError || kakaoSearchError) && (
            <div className="mt-2 text-center text-xs text-red-500 dark:text-red-400 md:text-sm">
              {searchError || kakaoSearchError}
            </div>
          )}
        </div>

        {(error || addressError || weatherError) && (
          <div className="text-center text-xs text-red-500 dark:text-red-400 mb-4 md:text-sm">
            {error || addressError || weatherError}
          </div>
        )}

        {showSkeleton && (
          <div className="space-y-6 max-w-5xl mx-auto w-full min-h-[720px] md:min-h-[800px]">
            <div className="flex flex-col lg:flex-row lg:items-stretch gap-4 md:gap-6">
              <div className="flex-1 flex flex-col">
                <SectionTitleWithUpdate icon={<CloudIcon size={20} />} title="현재 날씨" />
                <div className="flex-1">
                  <WeatherCardSkeleton />
                </div>
              </div>
              <div className="flex-1 lg:max-w-md flex flex-col">
                <SectionTitleWithUpdate icon={<CloudIcon size={20} />} title="단기 예보" />
                <div className="flex-1">
                  <DailyWeatherSkeleton />
                </div>
              </div>
            </div>
            <div>
              <SectionTitleWithUpdate icon={<ClockIcon size={20} />} title="시간대별 날씨" />
              <HourlyWeatherSkeleton />
            </div>
          </div>
        )}

        {address && weather !== null && !showSkeleton && (
          <div className="space-y-6 max-w-5xl mx-auto w-full min-h-[720px] md:min-h-[800px]">
            <div className="flex flex-col lg:flex-row lg:items-stretch gap-4 md:gap-6">
              <div className="flex-1 flex flex-col">
                <SectionTitleWithUpdate
                  icon={<CloudIcon size={20} />}
                  title="현재 날씨"
                  updateTime={weather.baseTime}
                />
                <div className="flex-1">
                  <WeatherCard
                    weather={weather}
                    address={address.fullAddress}
                    latitude={position?.latitude}
                    longitude={position?.longitude}
                    favoriteIdOverride={favoriteIdOverride}
                  />
                </div>
              </div>

              {weather.daily && weather.daily.length > 0 && (
                <div className="flex-1 lg:max-w-md flex flex-col">
                  <SectionTitleWithUpdate
                    icon={<CloudIcon size={20} />}
                    title="단기 예보"
                    updateTime={weather.dailyBaseTime}
                  />
                  <div className="flex-1">
                    <DailyWeatherCard daily={weather.daily} />
                  </div>
                </div>
              )}
            </div>

            {weather.hourly && (
              <div>
                <SectionTitleWithUpdate
                  icon={<ClockIcon size={20} />}
                  title="시간대별 날씨"
                  updateTime={weather.baseTime}
                />
                <HourlyWeatherCard hourly={weather.hourly} />
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
