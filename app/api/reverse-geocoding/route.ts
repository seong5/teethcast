import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const latitude = searchParams.get('latitude')
  const longitude = searchParams.get('longitude')

  if (!latitude || !longitude) {
    return NextResponse.json({ error: 'latitude와 longitude가 필요합니다.' }, { status: 400 })
  }

  const apiKey = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      { error: '카카오 API 키가 설정되지 않았습니다.' },
      { status: 500 },
    )
  }

  try {
    const response = await axios.get('https://dapi.kakao.com/v2/local/geo/coord2regioncode.json', {
      params: {
        x: longitude,
        y: latitude,
      },
      headers: {
        Authorization: `KakaoAK ${apiKey}`,
      },
    })

    return NextResponse.json(response.data)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const errorData = error.response.data as unknown
        let errorMessage = '카카오 API 오류가 발생했습니다.'
        if (typeof errorData === 'object' && errorData !== null && 'error' in errorData) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          errorMessage = String((errorData as { error?: unknown }).error || errorMessage)
        }
        return NextResponse.json({ error: errorMessage }, { status: error.response.status })
      }
      return NextResponse.json({ error: '네트워크 오류가 발생했습니다.' }, { status: 500 })
    }
    return NextResponse.json({ error: '알 수 없는 오류가 발생했습니다.' }, { status: 500 })
  }
}
