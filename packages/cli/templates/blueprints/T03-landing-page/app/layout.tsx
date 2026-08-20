import { SiteFooter } from "@/components/layout/site-footer"
import { SiteHeader } from "@/components/layout/site-header"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "YYC³ — 言启象限 · 语枢未来",
  description: "AI智能应用平台，五维驱动·五高架构·五标体系·五化转型",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="antialiased">
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  )
}
