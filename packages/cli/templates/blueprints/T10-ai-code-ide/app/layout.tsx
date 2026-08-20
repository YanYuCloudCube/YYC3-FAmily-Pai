import type { Metadata } from "next"
import "./globals.css"
export const metadata: Metadata = { title: "YYC³ AI Code IDE", description: "AI编程·代码编辑·智能补全" }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="zh-CN" suppressHydrationWarning><body className="antialiased bg-[#1e1e1e] text-white">{children}</body></html>
}
