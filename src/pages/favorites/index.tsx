'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { useFavorites } from '@/entities/favorite'
import { FavoriteCard, FavoriteCardSkeleton } from '@/features/favorite-management'

const FAVORITES_SKELETON_COUNT = 6

export function FavoritesPage() {
  const router = useRouter()
  const { favorites, hasHydrated } = useFavorites()

  return (
    <main className="flex min-h-screen flex-col items-center px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16 lg:p-10 bg-white dark:bg-gray-900">
      <div className="z-10 max-w-7xl w-full items-center justify-between font-mono text-xs md:text-sm">
        <div className="w-full max-w-5xl mx-auto mb-6 md:mb-8">
          <div className="flex items-center justify-between mb-3 sm:mb-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-xs font-medium md:text-sm">뒤로가기</span>
            </button>
          </div>
          <p className="text-center text-sm text-gray-600 dark:text-gray-300 sm:text-base md:text-lg">
            자주 방문하는 지역의 날씨 정보를 확인할 수 있습니다.
          </p>
        </div>

        {!hasHydrated ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto w-full">
            {Array.from({ length: FAVORITES_SKELETON_COUNT }).map((_, i) => (
              <FavoriteCardSkeleton key={i} />
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[320px] md:min-h-[400px] max-w-5xl mx-auto">
            <div className="text-center">
              <div className="text-5xl mb-3 md:text-6xl md:mb-4">⭐</div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 md:text-xl">
                즐겨찾기가 없습니다
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 md:text-base md:mb-6">
                지역을 검색하고 즐겨찾기에 추가해보세요.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto w-full">
            {favorites.map((favorite) => (
              <FavoriteCard key={favorite.id} favorite={favorite} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
