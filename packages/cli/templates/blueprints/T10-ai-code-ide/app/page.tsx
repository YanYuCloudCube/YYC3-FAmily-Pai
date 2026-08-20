export default function IDEPage() {
  return (
    <div className="h-screen flex flex-col">
      <div className="h-10 bg-[#252526] flex items-center px-4 text-xs text-white/60 border-b border-white/10"><span className="font-medium text-white/80">YYC³ AI Code IDE</span><div className="ml-6 flex gap-4">{["文件", "编辑", "查看", "终端", "帮助"].map(m => <button key={m} className="hover:text-white transition-colors">{m}</button>)}</div></div>
      <div className="flex-1 flex min-h-0">
        <div className="w-12 bg-[#333333] flex flex-col items-center py-2 gap-4">{["📁", "🔍", "🐛", "📦", "⚙️"].map((i, idx) => <button key={idx} className="w-10 h-10 flex items-center justify-center rounded hover:bg-white/10 text-lg">{i}</button>)}</div>
        <div className="w-48 bg-[#252526] border-r border-white/10 py-2 text-xs"><div className="px-3 py-1 text-white/40 uppercase tracking-wider text-xs">资源管理器</div>{["src/", "components/", "lib/", "app/", "public/"].map(f => <div key={f} className="px-3 py-1 hover:bg-white/5 cursor-pointer text-white/60">{f}</div>)}</div>
        <div className="flex-1 flex flex-col min-w-0">
          <div className="h-9 bg-[#252526] flex items-center border-b border-white/10">{[{ name: "page.tsx", active: true }, { name: "layout.tsx", active: false }].map(t => <div key={t.name} className={`px-4 h-full flex items-center text-xs ${t.active ? "bg-[#1e1e1e] text-white border-t border-primary" : "text-white/40 hover:text-white/60"}`}>{t.name}</div>)}</div>
          <div className="flex-1 p-4 font-mono text-sm text-white/70 overflow-auto">
            <div><span className="text-purple-400">import</span> {"{ useState }"} <span className="text-purple-400">from</span> <span className="text-green-400">"react"</span></div>
            <div className="mt-2"><span className="text-purple-400">export default function</span> <span className="text-yellow-400">Page</span>() {"{"}</div>
            <div className="ml-4"><span className="text-purple-400">const</span> [code, setCode] = <span className="text-yellow-400">useState</span>(<span className="text-green-400">""</span>)</div>
            <div className="ml-4 mt-2"><span className="text-gray-500">{"// TODO: 接入 Monaco Editor"}</span></div>
            <div className="ml-4"><span className="text-purple-400">return</span> &lt;<span className="text-blue-400">div</span>&gt;AI Code IDE&lt;/<span className="text-blue-400">div</span>&gt;</div>
            <div>{"}"}</div>
          </div>
          <div className="h-8 bg-[#252526] flex items-center px-4 text-xs text-white/40 border-t border-white/10"><span>行 1, 列 1</span><span className="mx-4">|</span><span>UTF-8</span><span className="mx-4">|</span><span>TypeScript React</span></div>
        </div>
        <div className="w-80 bg-[#252526] border-l border-white/10 flex flex-col">
          <div className="p-3 border-b border-white/10 text-xs font-medium text-white/60">AI助手</div>
          <div className="flex-1 p-3 space-y-3 overflow-auto text-sm">{[{ r: "user", t: "帮我写一个React Hook" }, { r: "ai", t: "好的，这是一个自定义Hook的模板:\n\nuseLocalStorage 可以在组件刷新后保持状态..." }].map((m, i) => <div key={i} className={`rounded-lg p-2.5 text-xs ${m.r === "user" ? "bg-primary/20 text-white/80" : "bg-white/5 text-white/60"}`}>{m.t}</div>)}</div>
          <div className="p-3 border-t border-white/10"><input placeholder="输入问题..." className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-xs text-white/60 focus:outline-none focus:border-primary" /></div>
        </div>
      </div>
    </div>
  )
}
