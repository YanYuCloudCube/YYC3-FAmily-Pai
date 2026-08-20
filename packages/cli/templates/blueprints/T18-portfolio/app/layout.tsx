import type { Metadata } from "next"
import "./globals.css"
export const metadata: Metadata = { title: "YYC³ Portfolio", description: "项目展示·技能·时间线·联系" }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="zh-CN" suppressHydrationWarning><body className="antialiased"><main>{children}</main></body></html>
}
