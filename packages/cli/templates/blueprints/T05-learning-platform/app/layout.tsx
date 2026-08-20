import type { Metadata } from "next"
import "./globals.css"
import { LearnSidebar } from "@/components/layout/learn-sidebar"

export const metadata: Metadata = {
  title: "YYC³ 学习平台",
  description: "智能学习 · 进度追踪 · 考试评估",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="antialiased">
        <div className="flex h-screen bg-background">
          <LearnSidebar />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </body>
    </html>
  )
}
