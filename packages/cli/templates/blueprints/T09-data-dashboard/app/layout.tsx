import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "YYC³ 数据看盘",
  description: "全屏数据可视化大屏 — 实时·全景·智能",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className="dark" suppressHydrationWarning>
      <body className="antialiased bg-[#0a0e1a] text-white">
        {children}
      </body>
    </html>
  )
}
