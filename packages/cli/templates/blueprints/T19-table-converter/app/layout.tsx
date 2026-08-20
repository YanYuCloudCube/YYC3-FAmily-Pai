import type { Metadata } from "next"
import "./globals.css"
export const metadata: Metadata = { title: "YYC³ 表格转换", description: "拖拽上传·格式选择·预览·导出" }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="zh-CN" suppressHydrationWarning><body className="antialiased"><header className="h-14 border-b border-border flex items-center px-6"><div className="flex items-center gap-2"><div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center"><span className="text-primary-foreground text-xs font-bold">Y³</span></div><span className="font-bold">YYC³ 表格转换</span></div></header><main>{children}</main></body></html>
}
