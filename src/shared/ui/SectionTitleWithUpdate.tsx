'use client'

import { useState, useRef, useEffect } from 'react'
import { Info } from 'lucide-react'

export interface SectionTitleWithUpdateProps {
  icon: React.ReactNode
  title: string
  updateTime?: string
}

export default function SectionTitleWithUpdate({
  icon,
  title,
  updateTime,
}: SectionTitleWithUpdateProps) {
  const [showUpdate, setShowUpdate] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!showUpdate) return
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowUpdate(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showUpdate])

  return (
    <div className="mb-3 flex flex-wrap items-center gap-2 md:mb-4 md:gap-4">
      <h2 className="text-base font-bold text-gray-800 dark:text-white flex items-center gap-2 md:text-lg">
        {icon}
        {title}
      </h2>
      {updateTime != null && (
        <div ref={dropdownRef} className="relative inline-flex">
          <button
            type="button"
            onClick={() => setShowUpdate((prev) => !prev)}
            className="p-0.5 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
            aria-label={showUpdate ? '업데이트 시간 숨기기' : '업데이트 시간 보기'}
            aria-expanded={showUpdate}
            aria-haspopup="true"
          >
            <Info size={18} className="flex-shrink-0" />
          </button>
          {showUpdate && (
            <div
              className="absolute left-0 top-full z-10 mt-1.5 min-w-[140px] rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-lg dark:border-gray-600 dark:bg-gray-800"
              role="menu"
            >
              <div className="text-[10px] text-gray-500 dark:text-gray-400 md:text-xs whitespace-nowrap">
                업데이트: {updateTime}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
