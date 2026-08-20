import type { Metadata } from "next"
import "./globals.css"
export const metadata: Metadata = { title: "YYC³ 电商", description: "商品·购物车·结算·订单" }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="zh-CN" suppressHydrationWarning><body className="antialiased"><header className="h-14 border-b border-border flex items-center px-6 justify-between"><div className="flex items-center gap-2"><div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center"><span className="text-primary-foreground text-xs font-bold">Y³</span></div><span className="font-bold">YYC³ Shop</span></div><nav className="flex gap-6 text-sm text-muted-foreground">{["全部商品", "分类", "购物车(3)", "订单"].map(i => <a key={i} href="#" className="hover:text-foreground">{i}</a>)}</nav></header><main>{children}</main></body></html>
}
