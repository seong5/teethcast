'use client'
//토스트 모듈을 관리하는 파일
/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CheckCircle2, Info, Star, X } from 'lucide-react'
import hotToast from 'react-hot-toast'

interface ToastItemProps {
  type: 'success' | 'message' | 'favorite'
  content: string
  onClose: () => void
}

const ToastItem = ({ type, content, onClose }: ToastItemProps) => {
  const [isMounting, setIsMounting] = useState(true)
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsMounting(false), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
    }, 300)
  }

  const baseClasses = `
    pointer-events-auto 
    transform transition-all duration-300 ease-out 
    flex w-full max-w-md overflow-hidden 
    rounded-xl border shadow-xl backdrop-blur-md
    ${
      isMounting
        ? 'translate-y-12 opacity-0 scale-95'
        : isClosing
          ? 'translate-y-12 opacity-0 scale-95'
          : 'translate-y-0 opacity-100 scale-100'
    }
  `

  const variants = {
    success: {
      container: 'bg-white/90 dark:bg-slate-800/90 border-emerald-100 dark:border-emerald-900',
      icon: <CheckCircle2 className="h-6 w-6 text-emerald-500" />,
      line: 'bg-emerald-500',
    },
    message: {
      container: 'bg-white/90 dark:bg-slate-800/90 border-slate-100 dark:border-slate-700',
      icon: <Info className="h-6 w-6 text-blue-500" />,
      line: 'bg-blue-500',
    },
    favorite: {
      container: 'bg-white/90 dark:bg-slate-800/90 border-yellow-100 dark:border-yellow-900',
      icon: <Star className="h-6 w-6 text-amber-500 fill-yellow-500" />,
      line: 'bg-yellow-500',
    },
  }

  const style = variants[type] || variants.message

  return (
    <div className={`${baseClasses} ${style.container}`}>
      <div className={`w-1.5 ${style.line}`} />

      <div className="flex-1 p-4 flex items-start gap-4">
        <div className="flex-shrink-0 mt-0.5">{style.icon}</div>
        <div className="flex-1 pt-0.5">
          {type === 'favorite' ? (
            <div className="flex flex-col gap-2">
              <span className="text-slate-800 dark:text-slate-100 text-[12px]">
                &quot;{content}&quot;을(를) 즐겨찾기에 추가했습니다.
              </span>
              <Link
                href="/favorites"
                onClick={() => {
                  handleClose()
                }}
                className="self-end text-[12px] font-semibold text-[#10a6c1] hover:text-[#0d8ba8] dark:text-[#38bdf8] dark:hover:text-[#7dd3fc] transition-colors underline-offset-4 hover:underline"
              >
                즐겨찾기로 이동 →
              </Link>
            </div>
          ) : (
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200 leading-relaxed">
              {content}
            </p>
          )}
        </div>

        <button
          onClick={handleClose}
          className="flex-shrink-0 -mt-1 -mr-1 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          aria-label="닫기"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export interface ShowToastApi {
  success: (message: string) => void
  message: (message: string) => void
  favoriteAdded: (name: string) => void
}

export const showToast: ShowToastApi = {
  success: (message: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return hotToast.custom(
      (t) => (
        <ToastItem
          type="success"
          content={message}
          onClose={() => {
            hotToast.dismiss(t.id)
          }}
        />
      ),
      { duration: 3000 },
    )
  },
  message: (message: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return hotToast.custom(
      (t) => (
        <ToastItem
          type="message"
          content={message}
          onClose={() => {
            hotToast.dismiss(t.id)
          }}
        />
      ),
      { duration: 3000 },
    )
  },
  favoriteAdded: (name: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return hotToast.custom(
      (t) => (
        <ToastItem
          type="favorite"
          content={name}
          onClose={() => {
            hotToast.dismiss(t.id)
          }}
        />
      ),
      { duration: 5000 },
    )
  },
}
