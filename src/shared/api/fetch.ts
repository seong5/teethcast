/**
 * 제네릭 API 클라이언트 함수
 */

/**
 * 타입 안전한 fetch 함수
 * @param url 요청 URL
 * @param options fetch 옵션
 * @returns 타입 안전한 응답 데이터
 */
export async function fetchAPI<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(url, options)

  if (!response.ok) {
    throw new Error(`API 요청 실패: ${response.status} ${response.statusText}`)
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const data = await response.json()

  return data as T
}

/**
 * 타입 가드를 사용한 안전한 fetch 함수
 * @param url 요청 URL
 * @param options fetch 옵션
 * @param typeGuard 타입 가드 함수
 * @returns 타입 안전한 응답 데이터
 */
export async function fetchAPIWithGuard<T>(
  url: string,
  typeGuard: (data: unknown) => data is T,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(url, options)

  if (!response.ok) {
    throw new Error(`API 요청 실패: ${response.status} ${response.statusText}`)
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const data = await response.json()

  if (!typeGuard(data)) {
    throw new Error('API 응답 형식이 올바르지 않습니다.')
  }

  return data
}
