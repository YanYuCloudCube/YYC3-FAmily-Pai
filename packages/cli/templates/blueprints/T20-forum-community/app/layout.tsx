import type { Metadata } from "next"
import "./globals.css"
export const metadata: Metadata = { title: "YYC³ 论坛", description: "帖子·评论·用户·社区" }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="zh-CN" suppressHydrationWarning><body className="antialiased"><header className="h-14 border-b border-border flex items-center px-6 justify-between"><div className="flex items-center gap-2"><span className="font-bold">YYC³ 论坛</span></div><nav className="flex gap-4 text-sm text-muted-foreground">{["热门","最新","精华","我的"].map(i=><a key={i} href="#" className="hover:text-foreground">{i}</a>)}</nav><button className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm">发帖</button></header><main className="max-w-4xl mx-auto p-6">{children}</main></body></html>
}
