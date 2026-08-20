import type { Metadata } from "next"
import "./globals.css"
export const metadata: Metadata = { title: "YYC³ DevOps", description: "状态面板·日志·告警·部署" }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="zh-CN" suppressHydrationWarning><body className="antialiased"><div className="flex h-screen bg-background"><aside className="w-56 border-r border-border bg-sidebar-background shrink-0"><div className="h-14 flex items-center px-4 border-b border-border"><span className="text-sm font-bold">YYC³ DevOps</span></div><nav className="p-2 space-y-1">{["状态总览", "服务列表", "告警中心", "部署记录", "日志分析"].map(i => <a key={i} href="#" className="block px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-accent">{i}</a>)}</nav></aside><main className="flex-1 overflow-y-auto">{children}</main></div></body></html>
}
