import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/widgets/Navbar";
import { Toaster } from "@/shared/ui";
import QueryProvider from "@/shared/ui/providers/QueryProvider";

export const metadata: Metadata = {
  title: "Teethcast - 우리나라 날씨 정보",
  description: "우리나라 각 지역에 대한 날씨 정보를 확인할 수 있는 서비스입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <QueryProvider>
          <Navbar />
          {children}
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
