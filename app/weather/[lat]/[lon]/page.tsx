'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { ClockIcon, CloudIcon } from '@/shared/ui/WeatherIcon'
import WeatherCard from '@/widgets/WeatherCard'
import HourlyWeatherCard from '@/widgets/HourlyWeather'
import { useReverseGeocoding, useWeather } from '@/shared/lib'
import type { WeatherData } from '@/shared/lib/useWeather'

export default function WeatherDetailPage() {
  const router = useRouter()
  const params = useParams()
  const lat = params?.lat ? parseFloat(params.lat as string) : NaN
  const lon = params?.lon ? parseFloat(params.lon as string) : NaN

  const {
    address,
    error: addressError,
    isLoading: addressLoading,
    getAddressFromCoordinates,
  } = useReverseGeocoding()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const { weather, error: weatherError, isLoading: weatherLoading, getWeather } = useWeather()

  useEffect(() => {
    if (!Number.isNaN(lat) && !Number.isNaN(lon)) {
      getAddressFromCoordinates(lat, lon)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      getWeather(lat, lon)
    }
  }, [lat, lon, getAddressFromCoordinates, getWeather])

  // 좌표가 유효하지 않은 경우
  if (Number.isNaN(lat) || Number.isNaN(lon)) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16 lg:p-10 bg-white dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            잘못된 위치 정보입니다
          </h1>
          <p className="text-gray-500 dark:text-gray-400">올바른 좌표 정보가 필요합니다.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16 lg:p-10 bg-white dark:bg-gray-900">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <div className="w-full max-w-3xl mx-auto mb-8">
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
