import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "YYC³ AI Intelligent Center",
  description: "AI智能中心 — 对话·分析·决策·协作",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
