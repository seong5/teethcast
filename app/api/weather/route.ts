import { NextRequest, NextResponse } from 'next/server'
import { fetchWeatherDataServer } from '@/shared/lib/weather/fetchWeatherServer'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const lat = searchParams.get('lat')
  const lon = searchParams.get('lon')

  if (!lat || !lon) {
    return NextResponse.json(
      { error: 'lat와 lon 쿼리 파라미터가 필요합니다.' },
      { status: 400 },
    )
  }

  const latitude = parseFloat(lat)
  const longitude = parseFloat(lon)

  if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
    return NextResponse.json(
      { error: 'lat, lon은 숫자여야 합니다.' },
      { status: 400 },
    )
  }

  try {
    const data = await fetchWeatherDataServer(latitude, longitude)
    return NextResponse.json(data)
  } catch (error) {
    const message = error instanceof Error ? error.message : '날씨 API 오류가 발생했습니다.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
