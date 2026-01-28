'use client'

import { Sun, CloudRain, Snowflake, Wind, Cloud, CloudSun, Droplets, Clock } from 'lucide-react'
import type { LucideProps } from 'lucide-react'

interface WeatherIconProps {
  sky?: string // '맑음' | '구름많음' | '흐림'
  precipitation?: string // '없음' | '비' | '눈' | '비/눈' | '소나기'
  size?: number
  className?: string
  'aria-label'?: string
}

export default function WeatherIcon({
  sky = '맑음',
  precipitation = '없음',
  size = 32,
  className = '',
  'aria-label': ariaLabel,
}: WeatherIconProps) {
  const baseClassName = className.trim()

  // 강수형태가 있으면 우선 표시
  if (precipitation === '비' || precipitation === '소나기') {
    const iconProps: LucideProps = {
      size,
      className: `text-blue-500 dark:text-blue-400 ${baseClassName}`.trim(),
      'aria-label': ariaLabel,
    }
    return <CloudRain {...iconProps} />
  }

  if (precipitation === '눈') {
    const iconProps: LucideProps = {
      size,
      className: `text-blue-300 dark:text-blue-200 ${baseClassName}`.trim(),
      'aria-label': ariaLabel,
    }
    return <Snowflake {...iconProps} />
  }

  if (precipitation === '비/눈') {
    const iconProps: LucideProps = {
      size,
      className: `text-blue-400 dark:text-blue-300 ${baseClassName}`.trim(),
      'aria-label': ariaLabel,
    }
    return <CloudRain {...iconProps} />
  }

  // 강수형태가 없으면 하늘상태로 표시
  if (sky === '맑음') {
    const iconProps: LucideProps = {
      size,
      className: `text-yellow-500 dark:text-yellow-400 ${baseClassName}`.trim(),
      'aria-label': ariaLabel,
    }
    return <Sun {...iconProps} />
  }

  if (sky === '구름많음') {
    const iconProps: LucideProps = {
      size,
      className: `text-gray-500 dark:text-gray-400 ${baseClassName}`.trim(),
      'aria-label': ariaLabel,
    }
    return <CloudSun {...iconProps} />
  }

  if (sky === '흐림') {
    const iconProps: LucideProps = {
      size,
      className: `text-gray-600 dark:text-gray-500 ${baseClassName}`.trim(),
      'aria-label': ariaLabel,
    }
    return <Cloud {...iconProps} />
  }

  // 기본값
  const defaultProps: LucideProps = {
    size,
    className: `text-yellow-500 dark:text-yellow-400 ${baseClassName}`.trim(),
    'aria-label': ariaLabel,
  }
  return <Sun {...defaultProps} />
}

// 바람 아이콘
export function WindIcon({
  size = 32,
  className = '',
  'aria-label': ariaLabel,
}: {
  size?: number
  className?: string
  'aria-label'?: string
}) {
  const iconProps: LucideProps = {
    size,
    className: `text-gray-500 dark:text-gray-400 ${className}`.trim(),
    ...(ariaLabel ? { 'aria-label': ariaLabel } : {}),
  }

  return <Wind {...iconProps} />
}

// 습도 아이콘
export function HumidityIcon({
  size = 24,
  className = '',
  'aria-label': ariaLabel,
}: {
  size?: number
  className?: string
  'aria-label'?: string
}) {
  const iconProps: LucideProps = {
    size,
    className: `text-blue-400 dark:text-blue-300 ${className}`.trim(),
    ...(ariaLabel ? { 'aria-label': ariaLabel } : {}),
  }

  return <Droplets {...iconProps} />
}

// 시계 아이콘
export function ClockIcon({
  size = 20,
  className = '',
  'aria-label': ariaLabel,
}: {
  size?: number
  className?: string
  'aria-label'?: string
}) {
  const iconProps: LucideProps = {
    size,
    className: `text-blue-500 ${className}`.trim(),
    ...(ariaLabel ? { 'aria-label': ariaLabel } : {}),
  }

  return <Clock {...iconProps} />
}

// 구름 아이콘
export function CloudIcon({
  size = 20,
  className = '',
  'aria-label': ariaLabel,
}: {
  size?: number
  className?: string
  'aria-label'?: string
}) {
  const iconProps: LucideProps = {
    size,
    className: `text-blue-500 ${className}`.trim(),
    ...(ariaLabel ? { 'aria-label': ariaLabel } : {}),
  }

  return <Cloud {...iconProps} />
}
