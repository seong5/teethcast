/* 날씨 관련 타입 정의 */

/* 시간대별 날씨 정보 */
export interface HourlyWeather {
  time: string // 시간 (예: "14:00")
  date?: string // 날짜 (예: "01/27")
  temperature: number // 기온
  sky: string // 하늘상태
  precipitation: string // 강수형태
}

/* 일별 날씨 정보 */
export interface DailyWeather {
  date: string // 날짜 (예: "2026-01-28")
  dateLabel: string // 날짜 라벨 (예: "오늘 (토)", "내일 (일)")
  dayOfWeek: string // 요일 한 글자 (일, 월, 화, 수, 목, 금, 토) — 주말 색상용
  minTemp: number // 최저기온
  maxTemp: number // 최고기온
  sky: string // 하늘상태 (맑음, 구름많음, 흐림)
  precipitation: string // 강수형태 (없음, 비, 눈, 비/눈)
}

/* 날씨 데이터 전체 정보 */
export interface WeatherData {
  temperature: number // 현재 기온
  humidity: number // 습도
  sky: string // 하늘상태 (맑음, 구름많음, 흐림)
  precipitation: string // 강수형태 (없음, 비, 눈, 비/눈)
  windSpeed: number // 풍속
  minTemp: number // 최저기온
  maxTemp: number // 최고기온
  hourly: HourlyWeather[] // 시간대별 날씨 (6시간)
  daily: DailyWeather[] // 일별 날씨 (3일)
  baseTime?: string // 시간대별(초단기) 업데이트 기준 시간 (예: "2026-01-28 14:00")
  dailyBaseTime?: string // 단기예보(일별) 업데이트 기준 시간 (예: "2026-01-28 05:00")
}
