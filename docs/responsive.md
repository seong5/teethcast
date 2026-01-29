# 반응형 (모바일 / 데스크탑)

## Breakpoint 규칙

- **모바일**: 기본(~767px), `sm`(640px)  
- **데스크탑**: `md`(768px)~

Tailwind 기본값 사용: `xs: 375px`, `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`  
(`tailwind.config.ts`에 `screens`로 정의)

## 적용 요약

- **페이지**: `main`에 `px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16 lg:p-10` 등으로 패딩 단계 적용
- **WeatherCard**: 그리드 `grid-cols-2 md:grid-cols-4`, 패딩·폰트 `md:`로 확대
- **HourlyWeather**: 모바일 가로 스크롤(`overflow-x-auto`, 고정 너비), 데스크탑 한 줄(`md:flex-1`)
- **FavoriteCard / DailyWeather**: `rounded-2xl p-3 md:rounded-3xl md:p-4` 등으로 모바일 축소·데스크탑 확대
- **NavBar / SearchBar**: 기존 `sm:`, `md:` 유지

## 모바일 퍼스트

기본 클래스는 모바일, `sm:`, `md:`, `lg:`로 큰 화면용 스타일 추가.
