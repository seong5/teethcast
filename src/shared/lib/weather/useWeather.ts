'use client'

import { useState, useCallback } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { QUERY_CONFIG } from '@/shared/config/query'
import { apiClient, getApiErrorMessage } from '@/shared/api'
import type { WeatherData } from '@/shared/types/weather'

export interface UseWeatherReturn {
  weather: WeatherData | null
  error: string | null
  isLoading: boolean
  getWeather: (latitude: number, longitude: number) => Promise<void>
}

async function fetchWeatherFromApi(lat: number, lon: number): Promise<WeatherData> {
  try {
    const { data } = await apiClient.get<WeatherData>(`/api/weather?lat=${lat}&lon=${lon}`)
    return data
  } catch (err) {
    throw new Error(getApiErrorMessage(err))
  }
}

/* 기상청 API로 날씨 정보를 가져오는 Hook */
export function useWeather(): UseWeatherReturn {
  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null)
  const queryClient = useQueryClient()

  const {
    data: weather,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['weather', coordinates?.lat, coordinates?.lon],
    queryFn: () => {
      if (!coordinates) throw new Error('좌표가 설정되지 않았습니다.')
      return fetchWeatherFromApi(coordinates.lat, coordinates.lon)
    },
    enabled: !!coordinates,
    staleTime: QUERY_CONFIG.weather.staleTime,
    gcTime: QUERY_CONFIG.weather.gcTime,
  })

  const getWeather = useCallback(
    async (latitude: number, longitude: number) => {
      const queryKey = ['weather', latitude, longitude]

      const cachedData = queryClient.getQueryData<WeatherData>(queryKey)
      if (cachedData) {
        setCoordinates({ lat: latitude, lon: longitude })
        return
      }

      try {
        await queryClient.fetchQuery({
          queryKey,
          queryFn: () => fetchWeatherFromApi(latitude, longitude),
          staleTime: QUERY_CONFIG.weather.staleTime,
          gcTime: QUERY_CONFIG.weather.gcTime,
        })
        setCoordinates({ lat: latitude, lon: longitude })
      } catch {
        setCoordinates({ lat: latitude, lon: longitude })
      }
    },
    [queryClient],
  )

  return {
    weather: weather ?? null,
    error: error
      ? error instanceof Error
        ? error.message
        : '날씨 정보를 가져오는 중 오류가 발생했습니다.'
      : null,
    isLoading,
    getWeather,
  }
}
