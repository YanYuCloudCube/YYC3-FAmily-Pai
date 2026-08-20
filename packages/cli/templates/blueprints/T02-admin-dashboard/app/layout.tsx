import { AdminSidebar } from "@/components/layout/admin-sidebar"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "YYC³ Admin Dashboard",
  description: "管理后台 — 数据·用户·运营·分析",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="antialiased">
        <div className="flex h-screen bg-background">
          <AdminSidebar />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
