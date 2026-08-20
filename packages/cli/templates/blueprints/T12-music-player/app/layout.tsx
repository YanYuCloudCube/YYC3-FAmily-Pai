import type { Metadata } from "next"
import "./globals.css"
export const metadata: Metadata = { title: "YYC³ Music", description: "音乐播放·歌单·歌词·可视化" }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="zh-CN" className="dark" suppressHydrationWarning><body className="antialiased bg-[#121212] text-white">{children}</body></html>
}
