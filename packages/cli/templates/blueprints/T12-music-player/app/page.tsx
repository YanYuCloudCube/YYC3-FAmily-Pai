export default function MusicPage() {
  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 flex min-h-0">
        <aside className="w-56 bg-black/40 border-r border-white/10 p-3"><div className="text-xs font-medium text-white/40 mb-3">歌单</div>{["YYC³ 工作BGM", "深夜编码", "AI灵感集", "古典代码", "电子脉冲"].map((p, i) => <div key={i} className={`px-3 py-2 rounded text-sm cursor-pointer ${i === 0 ? "bg-white/10 text-white" : "text-white/50 hover:text-white/70"}`}>{p}</div>)}</aside>
        <main className="flex-1 p-6"><h1 className="text-xl font-bold mb-4">YYC³ 工作BGM</h1><div className="space-y-1">{[{ t: "代码之魂", a: "AI Composer", d: "3:42" }, { t: "深夜调试", a: "Binary Dreams", d: "4:15" }, { t: "架构蓝图", a: "System Design", d: "5:03" }, { t: "部署进行曲", a: "DevOps Symphony", d: "3:28" }, { t: "Bug猎手", a: "Debug Warriors", d: "4:51" }].map((s, i) => <div key={i} className={`flex items-center gap-4 px-3 py-2.5 rounded-lg cursor-pointer ${i === 0 ? "bg-white/10" : "hover:bg-white/5"}`}><span className="text-xs text-white/30 w-4">{i + 1}</span><div className="flex-1"><div className="text-sm">{s.t}</div><div className="text-xs text-white/40">{s.a}</div></div><span className="text-xs text-white/30">{s.d}</span></div>)}</div></main>
      </div>
      <div className="h-20 border-t border-white/10 bg-black/60 flex items-center px-6 gap-4">
        <div className="w-12 h-12 rounded bg-gradient-to-br from-purple-500 to-blue-500 shrink-0" />
        <div className="flex-1"><div className="text-sm font-medium">代码之魂</div><div className="text-xs text-white/40">AI Composer</div></div>
        <div className="flex items-center gap-4">{["⏮", "▶️", "⏭"].map((b, i) => <button key={i} className="text-xl hover:scale-110 transition-transform">{b}</button>)}</div>
        <div className="flex-1 flex items-center gap-2"><span className="text-xs text-white/30">1:24</span><div className="flex-1 h-1 rounded-full bg-white/10"><div className="h-full w-[38%] rounded-full bg-white/60" /></div><span className="text-xs text-white/30">3:42</span></div>
        <div className="flex items-center gap-1">{[1, 2, 3, 4].map(i => <div key={i} className="w-1 bg-green-400 rounded-full animate-pulse" style={{ height: `${8 + Math.random() * 16}px`, animationDelay: `${i * 100}ms` }} />)}</div>
      </div>
    </div>
  )
}
