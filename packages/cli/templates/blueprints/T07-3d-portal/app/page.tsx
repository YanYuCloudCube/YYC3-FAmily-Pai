export default function Portal3DPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="fixed top-0 w-full z-50 h-16 flex items-center justify-between px-8 bg-black/50 backdrop-blur-md">
        <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center"><span className="text-white text-xs font-bold">Y³</span></div><span className="font-bold text-lg">YYC³ Portal</span></div>
        <div className="flex gap-6 text-sm text-white/60">{["首页", "产品", "技术", "关于"].map(i => <a key={i} href="#" className="hover:text-white transition-colors">{i}</a>)}</div>
      </nav>
      <section className="flex-1 flex items-center justify-center relative">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <div className="w-96 h-96 border border-white/20 rounded-full animate-pulse" />
          <div className="absolute w-64 h-64 border border-white/10 rounded-full animate-ping" style={{ animationDuration: "3s" }} />
          <div className="absolute w-48 h-48 border border-white/5 rounded-full" />
        </div>
        <div className="relative text-center space-y-6">
          <div className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">YYC³ Portal</div>
          <p className="text-lg text-white/50 max-w-md mx-auto">3D交互门户 · 沉浸式体验 · 视觉震撼</p>
          <p className="text-sm text-white/30">实际项目中可接入 @splinetool/react-spline 或 Three.js 实现真实3D场景</p>
          <div className="flex gap-3 justify-center pt-4">
            <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-medium hover:opacity-90 transition-opacity">进入门户</button>
            <button className="px-6 py-3 rounded-xl border border-white/20 text-white/70 text-sm hover:bg-white/5 transition-colors">了解更多</button>
          </div>
        </div>
      </section>
    </div>
  )
}
