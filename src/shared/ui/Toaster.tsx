'use client'

import { Toaster as HotToaster } from 'react-hot-toast'

export default function Toaster() {
  return (
    <HotToaster
      position="top-center"
      toastOptions={{
        duration: 3000,
        style: {
          background: 'transparent',
          padding: 0,
          boxShadow: 'none',
        },
      }}
    />
  )
}
