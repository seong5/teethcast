/**
 * 디바운싱 유틸리티 함수
 * 연속된 함수 호출 중 마지막 호출만 실행하도록 지연시킵니다.
 *
 * @param func - 디바운싱할 함수
 * @param delay - 지연 시간 (밀리초)
 * @returns 디바운싱된 함수
 */
export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null

  return function debounced(...args: Parameters<T>) {
    // 이전 타이머가 있으면 취소
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
    }

    // 새로운 타이머 설정
    timeoutId = setTimeout(() => {
      func(...args)
    }, delay)
  }
}
