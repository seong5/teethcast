export function FavoritesPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16 lg:p-24 bg-white dark:bg-gray-900">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-3xl font-bold text-center mb-4 text-gray-900 dark:text-white sm:text-4xl sm:mb-6 md:mb-8">
          즐겨찾기
        </h1>
        <p className="text-center text-base text-gray-600 dark:text-gray-300 sm:text-lg">
          즐겨찾기한 지역의 날씨 정보를 확인할 수 있습니다.
        </p>
      </div>
    </main>
  );
}
