import type { Metadata } from "next"
import "./globals.css"
export const metadata: Metadata = { title: "YYC³ 3D Portal", description: "3D交互·沉浸式体验·视觉震撼" }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="zh-CN" className="dark" suppressHydrationWarning><body className="antialiased bg-black text-white">{children}</body></html>
}
