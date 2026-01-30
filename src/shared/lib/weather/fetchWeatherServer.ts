import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { convertLatLonToGrid } from './convertCoordinates'
import type { WeatherData, HourlyWeather, DailyWeather } from '@/shared/types/weather'

dayjs.extend(utc)
dayjs.extend(timezone)

const KST = 'Asia/Seoul'

/** 현재 시각을 한국 시간(KST) 기준으로 반환 */
function nowKst() {
  return dayjs.tz(undefined, KST)
}

interface KMAItem {
  category: string
  fcstValue?: string
  obsrValue?: string
  fcstTime?: string
  fcstDate?: string
  baseDate?: string
  baseTime?: string
}

interface KMAResponse {
  response: {
    header: { resultCode: string; resultMsg: string }
    body: { items: { item: KMAItem[] } }
  }
}

function getUltraSrtBaseTime() {
  const now = nowKst()
  const currentHour = now.hour()
  const currentMinute = now.minute()
  let baseHour = currentHour
  let baseDate = now.format('YYYYMMDD')
  if (currentMinute < 30) {
    baseHour = currentHour - 1
    if (baseHour < 0) {
      baseHour = 23
      baseDate = now.subtract(1, 'day').format('YYYYMMDD')
    }
  }
  return { baseDate, baseTime: `${String(baseHour).padStart(2, '0')}00` }
}

function getVilageBaseTime() {
  const now = nowKst()
  const currentHour = now.hour()
  const forecastHours = [2, 5, 8, 11, 14, 17, 20, 23]
  let baseHour = forecastHours[forecastHours.length - 1]
  for (let i = forecastHours.length - 1; i >= 0; i--) {
    if (forecastHours[i] <= currentHour) {
      baseHour = forecastHours[i]
      break
    }
  }
  if (currentHour < 2) {
    const yesterday = now.subtract(1, 'day')
    return { baseDate: yesterday.format('YYYYMMDD'), baseTime: '2300' }
  }
  return { baseDate: now.format('YYYYMMDD'), baseTime: `${String(baseHour).padStart(2, '0')}00` }
}

function buildKmaUrl(path: string, params: Record<string, string | number>): string {
  const search = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    search.set(k, String(v))
  }
  return `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/${path}?${search.toString()}`
}

export async function fetchWeatherDataServer(
  latitude: number,
  longitude: number,
): Promise<WeatherData> {
  const apiKey =
    process.env.WEATHER_API_KEY || process.env.NEXT_PUBLIC_WEATHER_API_KEY
  if (!apiKey) {
    throw new Error('기상청 API 키가 설정되지 않았습니다.')
  }

  const { nx, ny } = convertLatLonToGrid(latitude, longitude)
  const { baseDate: ultraBaseDate, baseTime: ultraBaseTime } = getUltraSrtBaseTime()
  const { baseDate: vilageBaseDate, baseTime: vilageBaseTime } = getVilageBaseTime()

  const baseParams = {
    serviceKey: decodeURIComponent(apiKey),
    pageNo: 1,
    dataType: 'JSON',
    base_date: ultraBaseDate,
    base_time: ultraBaseTime,
    nx,
    ny,
  }

  const [currentRes, forecastRes, dailyRes] = await Promise.all([
    fetch(
      buildKmaUrl('getUltraSrtNcst', { ...baseParams, numOfRows: 10 }),
    ),
    fetch(
      buildKmaUrl('getUltraSrtFcst', { ...baseParams, numOfRows: 60 }),
    ),
    fetch(
      buildKmaUrl('getVilageFcst', {
        serviceKey: decodeURIComponent(apiKey),
        pageNo: 1,
        numOfRows: 100,
        dataType: 'JSON',
        base_date: vilageBaseDate,
        base_time: vilageBaseTime,
        nx,
        ny,
      }),
    ),
  ])

  const [currentData, forecastData, dailyData] = await Promise.all([
    currentRes.json() as Promise<KMAResponse>,
    forecastRes.json() as Promise<KMAResponse>,
    dailyRes.json() as Promise<KMAResponse>,
  ])

  const currentHeader = currentData.response?.header
  const forecastHeader = forecastData.response?.header
  const dailyHeader = dailyData.response?.header

  if (currentHeader?.resultCode !== '00') {
    throw new Error(`초단기실황 API 오류: ${currentHeader?.resultMsg ?? ''}`)
  }
  if (forecastHeader?.resultCode !== '00') {
    throw new Error(`초단기예보 API 오류: ${forecastHeader?.resultMsg ?? ''}`)
  }
  if (dailyHeader?.resultCode !== '00') {
    throw new Error(`단기예보 API 오류: ${dailyHeader?.resultMsg ?? ''}`)
  }

  const currentItems = currentData.response?.body?.items?.item ?? []
  const forecastItems = forecastData.response?.body?.items?.item ?? []
  const dailyItems = dailyData.response?.body?.items?.item ?? []

  if (currentItems.length === 0) throw new Error('초단기실황 데이터를 찾을 수 없습니다.')
  if (forecastItems.length === 0) throw new Error('초단기예보 데이터를 찾을 수 없습니다.')

  const now = nowKst()
  const currentTime = now.format('HHmm')

  const safeParseFloat = (v: string | undefined | null, def: number) => {
    if (!v || v.trim() === '') return def
    const p = parseFloat(v)
    return Number.isNaN(p) ? def : p
  }
  const safeParseInt = (v: string | undefined | null, def: number) => {
    if (!v || v.trim() === '') return def
    const p = parseInt(v, 10)
    return Number.isNaN(p) ? def : p
  }

  const getClosestForecastTime = (items: KMAItem[]): string => {
    const times = items
      .map((i) => i.fcstTime)
      .filter((t): t is string => typeof t === 'string' && t.length > 0)
    const unique = [...new Set(times)].sort()
    const currentNum = parseInt(currentTime, 10)
    for (const time of unique) {
      const n = parseInt(time, 10)
      if (!Number.isNaN(n) && n >= currentNum) return time
    }
    return unique[unique.length - 1] ?? currentTime
  }

  const forecastTime = getClosestForecastTime(forecastItems)
  const skyMap: Record<number, string> = { 1: '맑음', 3: '구름많음', 4: '흐림' }
  const ptyMap: Record<number, string> = {
    0: '없음', 1: '비', 2: '비/눈', 3: '눈', 4: '소나기',
  }

  const temperatureItem = currentItems.find((i) => i.category === 'T1H')
  const temperatureValue =
    temperatureItem?.obsrValue ?? temperatureItem?.fcstValue
  const temperature = safeParseFloat(temperatureValue, 0)

  const humidityItem = currentItems.find((i) => i.category === 'REH')
  const humidity = safeParseFloat(
    humidityItem?.obsrValue ?? humidityItem?.fcstValue,
    0,
  )

  const skyItems = forecastItems.filter(
    (i) => i.category === 'SKY' && i.fcstTime === forecastTime,
  )
  const skyCode = safeParseInt(skyItems[0]?.fcstValue, 1)
  const sky = skyMap[skyCode] ?? '맑음'

  const ptyItems = forecastItems.filter(
    (i) => i.category === 'PTY' && i.fcstTime === forecastTime,
  )
  const ptyCode = safeParseInt(ptyItems[0]?.fcstValue, 0)
  const precipitation = ptyMap[ptyCode] ?? '없음'

  const windItem = currentItems.find((i) => i.category === 'WSD')
  const windSpeed = safeParseFloat(
    windItem?.obsrValue ?? windItem?.fcstValue,
    0,
  )

  const today = nowKst().format('YYYYMMDD')
  const tomorrow = nowKst().add(1, 'day').format('YYYYMMDD')
  const dayAfterTomorrow = nowKst().add(2, 'day').format('YYYYMMDD')

  const getDateLabel = (dateStr: string, index: number): string => {
    const d = dayjs(dateStr, 'YYYYMMDD')
    if (index === 0) return '오늘'
    if (index === 1) return '내일'
    if (index === 2) return '모레'
    return d.format('MM/DD')
  }

  const minTempItems = dailyItems.filter((i) => i.category === 'TMN')
  const minTempItem =
    minTempItems.find((i) => i.baseTime === '0200' && i.fcstDate === today) ??
    minTempItems.find((i) => i.baseTime === '0200' && i.fcstDate === tomorrow) ??
    minTempItems.find((i) => i.baseTime === '0500' && i.fcstDate === today) ??
    minTempItems.find((i) => i.baseTime === '0500' && i.fcstDate === tomorrow) ??
    minTempItems.find((i) => i.fcstDate === today) ??
    minTempItems.find((i) => i.fcstDate === tomorrow) ??
    minTempItems[0]

  const parsedMinTemp = minTempItem?.fcstValue
    ? safeParseFloat(minTempItem.fcstValue, temperature - 5)
    : temperature - 5
  const minTemp = parsedMinTemp > temperature ? temperature - 2 : parsedMinTemp

  const maxTempItems = dailyItems.filter((i) => i.category === 'TMX')
  const maxTempItem =
    maxTempItems.find((i) => i.baseTime === '0200' && i.fcstDate === today) ??
    maxTempItems.find((i) => i.baseTime === '0200' && i.fcstDate === tomorrow) ??
    maxTempItems.find((i) => i.baseTime === '0500' && i.fcstDate === today) ??
    maxTempItems.find((i) => i.baseTime === '0500' && i.fcstDate === tomorrow) ??
    maxTempItems.find((i) => i.fcstDate === today) ??
    maxTempItems.find((i) => i.fcstDate === tomorrow) ??
    maxTempItems[0]

  const parsedMaxTemp = maxTempItem?.fcstValue
    ? safeParseFloat(maxTempItem.fcstValue, temperature + 5)
    : temperature + 5
  const maxTemp = parsedMaxTemp < temperature ? temperature + 2 : parsedMaxTemp

  const dailyWeather: DailyWeather[] = []
  const forecastDates = [today, tomorrow, dayAfterTomorrow]

  for (let i = 0; i < forecastDates.length; i++) {
    const forecastDate = forecastDates[i]
    const dateMinTempItems = minTempItems.filter(
      (item) => item.fcstDate === forecastDate && item.baseTime === '0200',
    )
    const dateMinTempItem =
      dateMinTempItems.find((item) => item.baseTime === '0200') ??
      minTempItems.find((item) => item.fcstDate === forecastDate)
    const dateMaxTempItems = maxTempItems.filter(
      (item) => item.fcstDate === forecastDate && item.baseTime === '0200',
    )
    const dateMaxTempItem =
      dateMaxTempItems.find((item) => item.baseTime === '0200') ??
      maxTempItems.find((item) => item.fcstDate === forecastDate)

    const dateSkyItems = dailyItems.filter(
      (item) =>
        item.category === 'SKY' &&
        item.fcstDate === forecastDate &&
        item.fcstTime &&
        parseInt(item.fcstTime, 10) >= 1200 &&
        parseInt(item.fcstTime, 10) <= 1800,
    )
    const skyCodeCounts: Record<number, number> = {}
    dateSkyItems.forEach((item) => {
      const code = safeParseInt(item.fcstValue, 1)
      skyCodeCounts[code] = (skyCodeCounts[code] ?? 0) + 1
    })
    const mostCommonSkyCode =
      Object.keys(skyCodeCounts).length > 0
        ? parseInt(
            Object.entries(skyCodeCounts).sort((a, b) => b[1] - a[1])[0][0],
            10,
          )
        : 1
    const dateSky = skyMap[mostCommonSkyCode] ?? '맑음'

    const datePtyItems = dailyItems.filter(
      (item) =>
        item.category === 'PTY' &&
        item.fcstDate === forecastDate &&
        item.fcstTime &&
        parseInt(item.fcstTime, 10) >= 1200 &&
        parseInt(item.fcstTime, 10) <= 1800,
    )
    const ptyCodeCounts: Record<number, number> = {}
    datePtyItems.forEach((item) => {
      const code = safeParseInt(item.fcstValue, 0)
      ptyCodeCounts[code] = (ptyCodeCounts[code] ?? 0) + 1
    })
    const mostCommonPtyCode =
      Object.keys(ptyCodeCounts).length > 0
        ? parseInt(
            Object.entries(ptyCodeCounts).sort((a, b) => b[1] - a[1])[0][0],
            10,
          )
        : 0
    const datePrecipitation = ptyMap[mostCommonPtyCode] ?? '없음'

    const dateMinTemp = dateMinTempItem?.fcstValue
      ? safeParseFloat(dateMinTempItem.fcstValue, temperature - 5)
      : i === 0
        ? minTemp
        : temperature - 5 - i * 2
    const dateMaxTemp = dateMaxTempItem?.fcstValue
      ? safeParseFloat(dateMaxTempItem.fcstValue, temperature + 5)
      : i === 0
        ? maxTemp
        : temperature + 5 - i * 2

    dailyWeather.push({
      date: dayjs(forecastDate, 'YYYYMMDD').format('YYYY-MM-DD'),
      dateLabel: getDateLabel(forecastDate, i),
      minTemp: dateMinTemp,
      maxTemp: dateMaxTemp,
      sky: dateSky,
      precipitation: datePrecipitation,
    })
  }

  const uniqueForecastTimes = [
    ...new Set(
      forecastItems
        .map((i) => i.fcstTime)
        .filter((t): t is string => typeof t === 'string' && t.length > 0),
    ),
  ].sort()
  const currentHourTime = `${String(now.hour()).padStart(2, '0')}00`
  const currentHourTimeNum = parseInt(currentHourTime, 10)
  const futureTimes = uniqueForecastTimes
    .filter((time) => {
      const n = parseInt(time, 10)
      return !Number.isNaN(n) && n >= currentHourTimeNum
    })
    .slice(0, 6)

  const hourlyWeather: HourlyWeather[] = []
  for (const fcstTime of futureTimes) {
    const timeItems = forecastItems.filter((i) => i.fcstTime === fcstTime)
    const tempItem = timeItems.find((i) => i.category === 'T1H')
    const skyItem = timeItems.find((i) => i.category === 'SKY')
    const ptyItem = timeItems.find((i) => i.category === 'PTY')
    const hour = fcstTime.substring(0, 2)
    hourlyWeather.push({
      time: `${hour}시`,
      temperature: safeParseFloat(tempItem?.fcstValue, temperature),
      sky: skyMap[safeParseInt(skyItem?.fcstValue, 1)] ?? '맑음',
      precipitation: ptyMap[safeParseInt(ptyItem?.fcstValue, 0)] ?? '없음',
    })
  }

  const baseTimeFormatted = dayjs
    .tz(
      `${ultraBaseDate} ${ultraBaseTime.substring(0, 2)}:${ultraBaseTime.substring(2, 4)}`,
      'YYYYMMDD HH:mm',
      KST,
    )
    .format('YYYY-MM-DD HH:mm')
  const dailyBaseTimeFormatted = dayjs
    .tz(
      `${vilageBaseDate} ${vilageBaseTime.substring(0, 2)}:${vilageBaseTime.substring(2, 4)}`,
      'YYYYMMDD HH:mm',
      KST,
    )
    .format('YYYY-MM-DD HH:mm')

  return {
    temperature,
    humidity,
    sky,
    precipitation,
    windSpeed,
    minTemp,
    maxTemp,
    hourly: hourlyWeather,
    daily: dailyWeather,
    baseTime: baseTimeFormatted,
    dailyBaseTime: dailyBaseTimeFormatted,
  }
}
