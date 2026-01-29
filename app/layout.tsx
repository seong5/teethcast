import type { Metadata } from 'next'
import './globals.css'
import NavBar from '@/widgets/NavBar'
import { Toaster } from '@/shared/ui'
import QueryProvider from '@/shared/config/QueryProvider'

export const metadata: Metadata = {
  title: 'Teethcast - 우리나라 날씨 정보',
  description: '우리나라 각 지역에 대한 날씨 정보를 확인할 수 있는 서비스입니다.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme');var s=window.matchMedia('(prefers-color-scheme: dark)').matches;var d=t==='dark'||(!t&&s);if(d)document.documentElement.classList.add('dark');else document.documentElement.classList.remove('dark');})();`,
          }}
        />
        <QueryProvider>
          <NavBar />
          {children}
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  )
}
