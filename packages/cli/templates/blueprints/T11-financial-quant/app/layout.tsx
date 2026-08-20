import type { Metadata } from "next"
import "./globals.css"
export const metadata: Metadata = { title: "YYC³ 金融量化", description: "量化交易·K线图·策略回测" }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="zh-CN" className="dark" suppressHydrationWarning><body className="antialiased bg-[#0c0c0c] text-white">{children}</body></html>
}
