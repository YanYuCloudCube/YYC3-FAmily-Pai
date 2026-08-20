import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = { title: "YYC³ AI医疗", description: "智能问诊·健康档案·AI辅助诊断" }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="antialiased">
        <div className="flex h-screen bg-background">
          <aside className="w-64 border-r border-border bg-sidebar-background flex flex-col shrink-0">
            <div className="h-16 flex items-center px-6 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">医</span>
                </div>
                <div><div className="text-sm font-semibold">YYC³ AI医疗</div><div className="text-xs text-muted-foreground">智能诊断系统</div></div>
              </div>
            </div>
            <nav className="flex-1 p-3 space-y-1">
              {[
                { label: "智能问诊", href: "/", icon: "🩺" },
                { label: "健康档案", href: "/records", icon: "📋" },
                { label: "诊断报告", href: "/reports", icon: "📊" },
                { label: "药物管理", href: "/medications", icon: "💊" },
              ].map((item) => (
                <a key={item.href} href={item.href} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent transition-colors">
                  <span>{item.icon}</span>{item.label}
                </a>
              ))}
            </nav>
          </aside>
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </body>
    </html>
  )
}
