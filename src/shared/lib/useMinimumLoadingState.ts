'use client'

import { useState, useEffect, useRef } from 'react'

/**
 * 로딩 상태가 true였을 때 최소 minMs 동안은 true를 유지합니다.
 * 스켈레톤이 너무 짧게 깜빡이는 것을 방지합니다.
 * @param loading 실제 로딩 상태
 * @param minMs 스켈레톤을 보여줄 최소 시간 (ms)
 * @returns 최소 표시 시간이 적용된 "로딩 표시 여부"
 */
export function useMinimumLoadingState(loading: boolean, minMs: number): boolean {
  const [showLoading, setShowLoading] = useState(loading)
  const startTimeRef = useRef<number | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (loading) {
      startTimeRef.current = Date.now()
      setShowLoading(true)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      return
    }

    if (startTimeRef.current === null) {
      setShowLoading(false)
      return
    }

    const elapsed = Date.now() - startTimeRef.current
    const remaining = minMs - elapsed

    if (remaining <= 0) {
      setShowLoading(false)
      startTimeRef.current = null
      return
    }

    timeoutRef.current = setTimeout(() => {
      setShowLoading(false)
      startTimeRef.current = null
      timeoutRef.current = null
    }, remaining)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [loading, minMs])

  return showLoading
}
