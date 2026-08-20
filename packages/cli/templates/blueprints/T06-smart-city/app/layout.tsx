import type { Metadata } from "next"
import "./globals.css"
export const metadata: Metadata = { title: "YYC³ 智慧城市", description: "城市服务·AI助手·智慧管理" }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className="dark" suppressHydrationWarning>
      <body className="antialiased bg-[#0a0e1a] text-white">
        <header className="h-14 border-b border-white/10 flex items-center px-6 gap-4">
          <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center"><span className="text-white text-xs font-bold">城</span></div><span className="font-semibold">YYC³ 智慧城市</span></div>
          <nav className="flex-1 flex justify-center gap-6 text-sm text-white/60">{["城市概览", "公共服务", "AI助手", "交通监控", "环境监测"].map(i=><a key={i} href="#" className="hover:text-white transition-colors">{i}</a>)}</nav>
          <div className="text-xs text-white/40">{new Date().toLocaleDateString("zh-CN")}</div>
        </header>
        {children}
      </body>
    </html>
  )
}
