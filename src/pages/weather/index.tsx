'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { ClockIcon, CloudIcon } from '@/shared/ui/WeatherIcon'
import { SectionTitleWithUpdate } from '@/shared/ui'
import WeatherCard from '@/widgets/WeatherCard'
import HourlyWeatherCard from '@/widgets/HourlyWeather'
import DailyWeatherCard from '@/widgets/DailyWeather'
import WeatherCardSkeleton from '@/widgets/WeatherCardSkeleton'
import DailyWeatherSkeleton from '@/widgets/DailyWeatherSkeleton'
import HourlyWeatherSkeleton from '@/widgets/HourlyWeatherSkeleton'
import { useReverseGeocoding, useWeather, useMinimumLoadingState } from '@/shared/lib'
import type { UseWeatherReturn } from '@/shared/lib'

const SKELETON_MIN_MS = 200

export interface WeatherDetailPageProps {
  lat: number
  lon: number
  favoriteId?: string
}

export function WeatherDetailPage({
  lat,
  lon,
  favoriteId: favoriteIdProp,
}: WeatherDetailPageProps) {
  const searchParams = useSearchParams()
  // URL 쿼리 파라미터에서 favoriteId를 직접 읽어옴 (prop보다 우선)
  const favoriteIdFromUrl = searchParams?.get('favoriteId') ?? undefined
  const favoriteId = favoriteIdFromUrl ?? favoriteIdProp
  const router = useRouter()

  const {
    address,
    error: addressError,
    isLoading: addressLoading,
    getAddressFromCoordinates,
  } = useReverseGeocoding()
  const {
    weather,
    error: weatherError,
    isLoading: weatherLoading,
    getWeather,
  }: UseWeatherReturn = useWeather()

  const isValidCoords =
    !Number.isNaN(lat) &&
    !Number.isNaN(lon) &&
    lat !== 0 &&
    lon !== 0 &&
    lat >= -90 &&
    lat <= 90 &&
    lon >= -180 &&
    lon <= 180

  const isPending =
    isValidCoords && (addressLoading || weatherLoading || address == null || weather === null)

  const showSkeleton = useMinimumLoadingState(isPending, SKELETON_MIN_MS)

  useEffect(() => {
    if (isValidCoords) {
      getAddressFromCoordinates(lat, lon)
      getWeather(lat, lon)
    }
  }, [lat, lon, isValidCoords, getAddressFromCoordinates, getWeather])

  return (
    <main className="flex min-h-screen flex-col items-center px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16 lg:p-10 bg-white dark:bg-gray-900">
      <div className="z-10 max-w-7xl w-full items-center justify-between font-mono text-xs md:text-sm">
        <div className="w-full max-w-5xl mx-auto mb-6 md:mb-8">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-xs font-medium md:text-sm">뒤로가기</span>
            </button>
          </div>
        </div>
        {(addressError || weatherError) && (
          <div className="text-center text-xs text-red-500 dark:text-red-400 mb-4 md:text-sm">
            {addressError || weatherError}
          </div>
        )}

        {showSkeleton && (
          <div className="space-y-4 md:space-y-6 max-w-5xl mx-auto w-full min-h-[720px] md:min-h-[800px]">
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
          <div className="space-y-4 md:space-y-6 max-w-5xl mx-auto w-full min-h-[720px] md:min-h-[800px]">
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
                    latitude={lat}
                    longitude={lon}
                    favoriteIdOverride={favoriteId}
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
