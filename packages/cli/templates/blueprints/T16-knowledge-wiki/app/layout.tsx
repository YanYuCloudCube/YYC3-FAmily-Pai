import type { Metadata } from "next"
import "./globals.css"
import { WikiHeader } from "@/components/layout/wiki-header"
import { WikiSidebar } from "@/components/layout/wiki-sidebar"

export const metadata: Metadata = {
  title: "YYC³ 知识库",
  description: "文档树·搜索·编辑·版本管理",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="antialiased">
        <WikiHeader />
        <div className="flex h-[calc(100vh-3.5rem)]">
          <WikiSidebar />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </body>
    </html>
  )
}
