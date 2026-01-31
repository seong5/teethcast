/* Axios 기반 API 클라이언트 함수 */

import { apiClient, getApiErrorMessage } from './client'

/**
 * GET 요청으로 타입 안전한 데이터 반환
 * @param url 요청 URL
 * @returns 응답 데이터
 */
export async function fetchAPI<T>(url: string): Promise<T> {
  try {
    const { data } = await apiClient.get<T>(url)
    return data
  } catch (err) {
    throw new Error(getApiErrorMessage(err))
  }
}

/**
 * 타입 가드를 사용한 안전한 GET 요청
 * @param url 요청 URL
 * @param typeGuard 타입 가드 함수
 * @returns 타입 안전한 응답 데이터
 */
export async function fetchAPIWithGuard<T>(
  url: string,
  typeGuard: (data: unknown) => data is T,
): Promise<T> {
  try {
    const { data } = await apiClient.get<unknown>(url)

    if (!typeGuard(data)) {
      throw new Error('API 응답 형식이 올바르지 않습니다.')
    }

    return data
  } catch (err) {
    if (err instanceof Error && err.message === 'API 응답 형식이 올바르지 않습니다.') {
      throw err
    }
    throw new Error(getApiErrorMessage(err))
  }
}
