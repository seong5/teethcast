'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { ClockIcon, CloudIcon } from '@/shared/ui/WeatherIcon'
import WeatherCard from '@/widgets/WeatherCard'
import HourlyWeatherCard from '@/widgets/HourlyWeather'
import DailyWeatherCard from '@/widgets/DailyWeather'
import { useReverseGeocoding, useWeather } from '@/shared/lib'
import type { UseWeatherReturn } from '@/shared/lib'

export interface WeatherDetailPageProps {
  lat: number
  lon: number
  favoriteId?: string
}

export function WeatherDetailPage({ lat, lon, favoriteId: favoriteIdProp }: WeatherDetailPageProps) {
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

  useEffect(() => {
    // 좌표가 유효한지 확인 (NaN이 아니고 0이 아닌 경우)
    if (
      !Number.isNaN(lat) &&
      !Number.isNaN(lon) &&
      lat !== 0 &&
      lon !== 0 &&
      lat >= -90 &&
      lat <= 90 &&
      lon >= -180 &&
      lon <= 180
    ) {
      getAddressFromCoordinates(lat, lon)
      getWeather(lat, lon)
    }
  }, [lat, lon, getAddressFromCoordinates, getWeather])

  return (
    <main className="flex min-h-screen flex-col items-center px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16 lg:p-10 bg-white dark:bg-gray-900">
      <div className="z-10 max-w-7xl w-full items-center justify-between font-mono text-sm">
        <div className="w-full max-w-5xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">뒤로가기</span>
            </button>
          </div>
        </div>
        {(addressLoading || weatherLoading) && (
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 mb-4">
            날씨를 확인하는 중...
          </div>
        )}
        {(addressError || weatherError) && (
          <div className="text-center text-sm text-red-500 dark:text-red-400 mb-4">
            {addressError || weatherError}
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
                        latitude={lat}
                        longitude={lon}
                        favoriteIdOverride={favoriteId}
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

