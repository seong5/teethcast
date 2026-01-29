'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { QUERY_CONFIG } from './query'

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: QUERY_CONFIG.default.staleTime,
            gcTime: QUERY_CONFIG.default.gcTime,
            retry: QUERY_CONFIG.default.retry,
            refetchOnWindowFocus: QUERY_CONFIG.default.refetchOnWindowFocus,
          },
        },
      }),
  )

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
