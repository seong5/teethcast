'use client'

import { useState, useCallback } from 'react'
import { apiClient } from '@/shared/api'
import { convertLatLonToGrid } from './convertCoordinates'
import dayjs from 'dayjs'

export interface HourlyWeather {
  time: string // 시간 (예: "14:00")
  date?: string // 날짜 (예: "01/27")
  temperature: number // 기온
  sky: string // 하늘상태
  precipitation: string // 강수형태
}

export interface WeatherData {
  temperature: number // 현재 기온
  humidity: number // 습도
  sky: string // 하늘상태 (맑음, 구름많음, 흐림)
  precipitation: string // 강수형태 (없음, 비, 눈, 비/눈)
  windSpeed: number // 풍속
  minTemp: number // 최저기온
  maxTemp: number // 최고기온
  hourly: HourlyWeather[] // 시간대별 날씨 (6시간)
  baseTime?: string // 업데이트 기준 시간 (예: "2026-01-28 14:00")
}

export interface UseWeatherReturn {
  weather: WeatherData | null
  error: string | null
  isLoading: boolean
  getWeather: (latitude: number, longitude: number) => Promise<void>
}

// 기상청 API 응답 타입
interface KMAItem {
  category: string
  fcstValue?: string // 예보용
  obsrValue?: string // 실황용
  fcstTime?: string
  fcstDate?: string
  baseDate?: string
  baseTime?: string
}

interface KMAResponse {
  response: {
    header: {
      resultCode: string
      resultMsg: string
    }
    body: {
      items: {
        item: KMAItem[]
      }
      numOfRows: number
      pageNo: number
      totalCount: number
    }
  }
}

/* 기상청 API로 날씨 정보를 가져오는 Hook */
export function useWeather(): UseWeatherReturn {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  /* 초단기실황/예보 base_time 계산 매 시간 정각(00분)에 발표 */
  const getUltraSrtBaseTime = useCallback(() => {
    const now = dayjs()
    const currentHour = now.hour()
    const currentMinute = now.minute()

    // 초단기실황은 매 시간 정각에 발표되지만, 실제로는 약 10-20분 지연될 수 있음
    // 현재 시간이 정각에서 30분 이내라면 이전 시간의 데이터 사용
    let baseHour = currentHour
    let baseDate = now.format('YYYYMMDD')

    if (currentMinute < 30) {
      // 30분 이전이면 이전 시간의 데이터 사용
      baseHour = currentHour - 1

      // 자정 이전 처리
      if (baseHour < 0) {
        baseHour = 23
        baseDate = now.subtract(1, 'day').format('YYYYMMDD')
      }
    }

    return {
      baseDate,
      baseTime: `${String(baseHour).padStart(2, '0')}00`,
    }
  }, [])

  /* 단기예보 base_time 계산 02, 05, 08, 11, 14, 17, 20, 23시에 발표 가장 최근 발표 시간을 찾음 */
  const getVilageBaseTime = useCallback(() => {
    const now = dayjs()
    const currentHour = now.hour()

    // 단기예보 발표 시간: 02, 05, 08, 11, 14, 17, 20, 23
    const forecastHours = [2, 5, 8, 11, 14, 17, 20, 23]

    // 현재 시간보다 작거나 같은 가장 최근 발표 시간 찾기
    let baseHour = forecastHours[forecastHours.length - 1] // 기본값: 23시

    for (let i = forecastHours.length - 1; i >= 0; i--) {
      if (forecastHours[i] <= currentHour) {
        baseHour = forecastHours[i]
        break
      }
    }

    // 현재 시간이 02시 이전이면 전날 23시 데이터 사용
    if (currentHour < 2) {
      const yesterday = now.subtract(1, 'day')
      return {
        baseDate: yesterday.format('YYYYMMDD'),
        baseTime: '2300',
      }
    }

    return {
      baseDate: now.format('YYYYMMDD'),
      baseTime: `${String(baseHour).padStart(2, '0')}00`,
    }
  }, [])

  const getWeather = useCallback(
    async (latitude: number, longitude: number) => {
      setIsLoading(true)
      setError(null)

      try {
        const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY

        if (!apiKey) {
          throw new Error(
            '기상청 API 키가 설정되지 않았습니다. 환경변수에 NEXT_PUBLIC_WEATHER_API_KEY를 설정해주세요.',
          )
        }

        // 격자 좌표 변환
        const { nx, ny } = convertLatLonToGrid(latitude, longitude)

        // base_time 계산
        const { baseDate: ultraBaseDate, baseTime: ultraBaseTime } = getUltraSrtBaseTime()
        const { baseDate: vilageBaseDate, baseTime: vilageBaseTime } = getVilageBaseTime()

        // 현재 시간 계산 (예보 시간 선택용)
        const now = dayjs()
        const currentTime = now.format('HHmm') // 예: "1430"

        // 초단기실황 API 호출 (현재 날씨)
        const currentResponse = await apiClient.get<KMAResponse>(
          `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst`,
          {
            params: {
              serviceKey: decodeURIComponent(apiKey),
              pageNo: 1,
              numOfRows: 10,
              dataType: 'JSON',
              base_date: ultraBaseDate,
              base_time: ultraBaseTime,
              nx,
              ny,
            },
          },
        )

        // 초단기예보 API 호출 (6시간 예보)
        const forecastResponse = await apiClient.get<KMAResponse>(
          `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst`,
          {
            params: {
              serviceKey: decodeURIComponent(apiKey),
              pageNo: 1,
              numOfRows: 60,
              dataType: 'JSON',
              base_date: ultraBaseDate,
              base_time: ultraBaseTime,
              nx,
              ny,
            },
          },
        )

        // 단기예보 API 호출 (최저/최고 기온)
        const dailyResponse = await apiClient.get<KMAResponse>(
          `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst`,
          {
            params: {
              serviceKey: decodeURIComponent(apiKey),
              pageNo: 1,
              numOfRows: 100,
              dataType: 'JSON',
              base_date: vilageBaseDate,
              base_time: vilageBaseTime,
              nx,
              ny,
            },
          },
        )

        // API 응답 검증
        const currentHeader = currentResponse.data.response.header
        const forecastHeader = forecastResponse.data.response.header
        const dailyHeader = dailyResponse.data.response.header

        if (currentHeader.resultCode !== '00') {
          throw new Error(
            `초단기실황 API 오류: ${currentHeader.resultMsg} (코드: ${currentHeader.resultCode})`,
          )
        }
        if (forecastHeader.resultCode !== '00') {
          throw new Error(
            `초단기예보 API 오류: ${forecastHeader.resultMsg} (코드: ${forecastHeader.resultCode})`,
          )
        }
        if (dailyHeader.resultCode !== '00') {
          throw new Error(
            `단기예보 API 오류: ${dailyHeader.resultMsg} (코드: ${dailyHeader.resultCode})`,
          )
        }

        // 응답 데이터 추출
        const currentItems = currentResponse.data.response.body?.items?.item || []
        const forecastItems = forecastResponse.data.response.body?.items?.item || []
        const dailyItems = dailyResponse.data.response.body?.items?.item || []

        if (currentItems.length === 0) {
          throw new Error('초단기실황 데이터를 찾을 수 없습니다.')
        }
        if (forecastItems.length === 0) {
          throw new Error('초단기예보 데이터를 찾을 수 없습니다.')
        }

        // 안전한 숫자 파싱 함수
        const safeParseFloat = (
          value: string | undefined | null,
          defaultValue: number = 0,
        ): number => {
          if (!value || value.trim() === '') return defaultValue
          const parsed = parseFloat(value)
          return Number.isNaN(parsed) ? defaultValue : parsed
        }

        const safeParseInt = (
          value: string | undefined | null,
          defaultValue: number = 0,
        ): number => {
          if (!value || value.trim() === '') return defaultValue
          const parsed = parseInt(value, 10)
          return Number.isNaN(parsed) ? defaultValue : parsed
        }

        // 현재 시간에 가장 가까운 예보 시간 찾기
        // 초단기예보는 현재 시간 이후의 가장 가까운 시간 사용
        const getClosestForecastTime = (items: KMAItem[]): string => {
          const times = items
            .map((item) => item.fcstTime)
            .filter((time): time is string => typeof time === 'string' && time.length > 0)
          const uniqueTimes = [...new Set(times)].sort()
          const currentTimeNum = parseInt(currentTime, 10)

          // 현재 시간 이후의 가장 가까운 시간 찾기
          for (const time of uniqueTimes) {
            const timeNum = parseInt(time, 10)
            if (!Number.isNaN(timeNum) && timeNum >= currentTimeNum) {
              return time
            }
          }

          // 현재 시간 이후 데이터가 없으면 가장 최근 시간 사용
          return uniqueTimes[uniqueTimes.length - 1] || currentTime
        }

        const forecastTime = getClosestForecastTime(forecastItems)

        // 현재 기온 (T1H) - 초단기실황은 실시간 데이터 (obsrValue 사용)
        const temperatureItem = currentItems.find((item) => item.category === 'T1H')

        // 초단기실황은 obsrValue 사용, 없으면 fcstValue 사용
        const temperatureValue =
          temperatureItem?.obsrValue || temperatureItem?.fcstValue || undefined
        const temperature = safeParseFloat(temperatureValue, 0)

        // 현재 습도 (REH) - 초단기실황은 실시간 데이터 (obsrValue 사용)
        const humidityItem = currentItems.find((item) => item.category === 'REH')
        const humidityValue = humidityItem?.obsrValue || humidityItem?.fcstValue
        const humidity = safeParseFloat(humidityValue, 0)

        // 하늘상태 (SKY) - 현재 시간에 가장 가까운 예보 시간의 데이터 사용
        const skyItems = forecastItems.filter(
          (item) => item.category === 'SKY' && item.fcstTime === forecastTime,
        )
        const skyItem = skyItems[0]
        const skyCode = safeParseInt(skyItem?.fcstValue, 1)
        const skyMap: Record<number, string> = {
          1: '맑음',
          3: '구름많음',
          4: '흐림',
        }
        const sky = skyMap[skyCode] || '맑음'

        // 강수형태 (PTY) - 현재 시간에 가장 가까운 예보 시간의 데이터 사용
        const ptyItems = forecastItems.filter(
          (item) => item.category === 'PTY' && item.fcstTime === forecastTime,
        )
        const ptyItem = ptyItems[0]
        const ptyCode = safeParseInt(ptyItem?.fcstValue, 0)
        const ptyMap: Record<number, string> = {
          0: '없음',
          1: '비',
          2: '비/눈',
          3: '눈',
          4: '소나기',
        }
        const precipitation = ptyMap[ptyCode] || '없음'

        // 풍속 (WSD) - 초단기실황은 실시간 데이터 (obsrValue 사용)
        const windItem = currentItems.find((item) => item.category === 'WSD')
        const windSpeedValue = windItem?.obsrValue || windItem?.fcstValue
        const windSpeed = safeParseFloat(windSpeedValue, 0)

        // 최저기온 (TMN) - 단기예보에서 오늘 날짜 찾기
        // 기상청 단기예보 API에서 fcstDate는 예보 대상 날짜입니다
        const today = dayjs().format('YYYYMMDD')
        const tomorrow = dayjs().add(1, 'day').format('YYYYMMDD')

        // 최저기온 (TMN) 찾기 - 오늘 날짜의 예보 찾기
        const minTempItems = dailyItems.filter((item) => item.category === 'TMN')
        // 오늘 날짜의 예보를 우선 찾고, 없으면 내일 날짜의 예보 사용
        const minTempItem =
          minTempItems.find((item) => item.fcstDate === today) ||
          minTempItems.find((item) => item.fcstDate === tomorrow) ||
          minTempItems[0]

        // fcstValue가 없거나 파싱 실패 시 기본값을 현재 기온보다 낮은 값으로 설정
        // 최저기온은 현재 기온보다 낮거나 같아야 함
        const minTempValue = minTempItem?.fcstValue
        const parsedMinTemp = minTempValue
          ? safeParseFloat(minTempValue, temperature - 5)
          : temperature - 5
        // 최저기온이 현재 기온보다 높으면 현재 기온으로 설정 (데이터 오류 방지)
        const minTemp = parsedMinTemp > temperature ? temperature - 2 : parsedMinTemp

        // 최고기온 (TMX) 찾기 - 오늘 날짜의 예보 찾기
        const maxTempItems = dailyItems.filter((item) => item.category === 'TMX')
        // 오늘 날짜의 예보를 우선 찾고, 없으면 내일 날짜의 예보 사용
        const maxTempItem =
          maxTempItems.find((item) => item.fcstDate === today) ||
          maxTempItems.find((item) => item.fcstDate === tomorrow) ||
          maxTempItems[0]

        // fcstValue가 없거나 파싱 실패 시 기본값을 현재 기온보다 높은 값으로 설정
        // 최고기온은 현재 기온보다 높거나 같아야 함
        const maxTempValue = maxTempItem?.fcstValue
        const parsedMaxTemp = maxTempValue
          ? safeParseFloat(maxTempValue, temperature + 5)
          : temperature + 5
        // 최고기온이 현재 기온보다 낮으면 현재 기온으로 설정 (데이터 오류 방지)
        const maxTemp = parsedMaxTemp < temperature ? temperature + 2 : parsedMaxTemp

        // 시간대별 날씨 데이터 생성 (초단기예보에서 앞으로 6시간)
        const hourlyWeather: HourlyWeather[] = []
        const uniqueForecastTimes = [
          ...new Set(
            forecastItems
              .map((item) => item.fcstTime)
              .filter((time): time is string => typeof time === 'string' && time.length > 0),
          ),
        ].sort()

        // 현재 시간의 정각 시간을 기준으로 필터링 (예: 15:30 -> 1500 기준)
        const currentHour = now.hour()
        const currentHourTime = `${String(currentHour).padStart(2, '0')}00`
        const currentHourTimeNum = parseInt(currentHourTime, 10)

        // 현재 시간의 정각 이후의 시간대만 선택 (최대 6개)
        const futureTimes = uniqueForecastTimes
          .filter((time) => {
            const timeNum = parseInt(time, 10)
            return !Number.isNaN(timeNum) && timeNum >= currentHourTimeNum
          })
          .slice(0, 6) // 최대 6시간

        for (const fcstTime of futureTimes) {
          // 해당 시간대의 데이터 추출
          const timeItems = forecastItems.filter((item) => item.fcstTime === fcstTime)

          const tempItem = timeItems.find((item) => item.category === 'T1H')
          const skyItem = timeItems.find((item) => item.category === 'SKY')
          const ptyItem = timeItems.find((item) => item.category === 'PTY')

          const hourlyTemp = safeParseFloat(tempItem?.fcstValue, temperature)
          const hourlySkyCode = safeParseInt(skyItem?.fcstValue, 1)
          const hourlyPtyCode = safeParseInt(ptyItem?.fcstValue, 0)

          const hour = fcstTime.substring(0, 2)
          const timeString = `${hour}시`

          hourlyWeather.push({
            time: timeString,
            temperature: hourlyTemp,
            sky: skyMap[hourlySkyCode] || '맑음',
            precipitation: ptyMap[hourlyPtyCode] || '없음',
          })
        }

        // 업데이트 기준 시간 포맷팅
        const baseTimeFormatted = dayjs(
          `${ultraBaseDate} ${ultraBaseTime.substring(0, 2)}:${ultraBaseTime.substring(2, 4)}`,
        ).format('YYYY-MM-DD HH:mm')

        const weatherData = {
          temperature,
          humidity,
          sky,
          precipitation,
          windSpeed,
          minTemp,
          maxTemp,
          hourly: hourlyWeather,
          baseTime: baseTimeFormatted,
        }

        setWeather(weatherData)
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('날씨 정보를 가져오는 중 오류가 발생했습니다.')
        }
        setWeather(null)
      } finally {
        setIsLoading(false)
      }
    },
    [getUltraSrtBaseTime, getVilageBaseTime],
  )

  const returnValue: UseWeatherReturn = {
    weather,
    error,
    isLoading,
    getWeather,
  }

  return returnValue
}
