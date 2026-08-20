import type { Metadata } from "next"
import "./globals.css"
export const metadata: Metadata = { title: "YYC³ AI呼叫中心", description: "通话面板·录音·转写·AI分析" }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="zh-CN" suppressHydrationWarning><body className="antialiased"><div className="flex h-screen bg-background"><aside className="w-56 border-r border-border bg-sidebar-background shrink-0"><div className="h-14 flex items-center px-4 border-b border-border"><span className="text-sm font-bold">YYC³ 呼叫中心</span></div><nav className="p-2 space-y-1">{["通话面板", "录音列表", "AI分析", "客户标签", "统计报表"].map(i => <a key={i} href="#" className="block px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-accent">{i}</a>)}</nav></aside><main className="flex-1 overflow-y-auto">{children}</main></div></body></html>
}
