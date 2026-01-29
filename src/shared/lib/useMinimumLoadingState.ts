'use client'

import { useState, useEffect, useRef } from 'react'

/* 로딩 상태가 true였을 때 최소 minMs 동안은 true를 유지합니다. */
export function useMinimumLoadingState(loading: boolean, minMs: number): boolean {
  const [showLoading, setShowLoading] = useState(loading)
  const startTimeRef = useRef<number | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (loading) {
      startTimeRef.current = Date.now()
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      const id = setTimeout(() => setShowLoading(true), 0)
      return () => clearTimeout(id)
    }

    if (startTimeRef.current === null) {
      const id = setTimeout(() => setShowLoading(false), 0)
      return () => clearTimeout(id)
    }

    const elapsed = Date.now() - startTimeRef.current
    const remaining = minMs - elapsed

    if (remaining <= 0) {
      startTimeRef.current = null
      const id = setTimeout(() => setShowLoading(false), 0)
      return () => clearTimeout(id)
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
