'use client'

import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { WeatherDetailPage } from '@/pages/weather'

export default function Page() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const lat = params?.lat ? parseFloat(params.lat as string) : NaN
  const lon = params?.lon ? parseFloat(params.lon as string) : NaN
  const favoriteId = searchParams?.get('favoriteId') ?? undefined

  // 좌표가 유효하지 않은 경우
  if (
    Number.isNaN(lat) ||
    Number.isNaN(lon) ||
    lat === 0 ||
    lon === 0 ||
    lat < -90 ||
    lat > 90 ||
    lon < -180 ||
    lon > 180
  ) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16 lg:p-10 bg-white dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white mb-4 md:text-2xl">
            잘못된 위치 정보입니다
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 md:text-base">올바른 좌표 정보가 필요합니다.</p>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-xs font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors md:text-sm"
          >
            뒤로가기
          </button>
        </div>
      </main>
    )
  }

  // 좌표가 유효하면 실제 상세 페이지 컴포넌트 렌더링
  return <WeatherDetailPage lat={lat} lon={lon} favoriteId={favoriteId} />
}
