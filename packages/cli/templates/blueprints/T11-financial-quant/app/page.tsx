export default function QuantPage() {
  return (
    <div className="h-screen flex flex-col">
      <header className="h-12 border-b border-white/10 flex items-center px-4 justify-between">
        <div className="flex items-center gap-2"><span className="font-bold">YYC³ Quant</span><span className="text-xs text-white/40">量化交易平台</span></div>
        <div className="flex gap-3 text-xs">{["BTC/USDT", "ETH/USDT", "SOL/USDT"].map(p => <span key={p} className="px-2 py-1 rounded bg-white/5">{p}</span>)}</div>
      </header>
      <div className="flex-1 flex min-h-0">
        <div className="flex-1 p-4">
          <div className="flex items-center gap-4 mb-3"><span className="text-2xl font-bold">$67,234.50</span><span className="text-green-400 text-sm">+2.34%</span></div>
          <div className="h-64 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/20 text-sm">K线图区域 — 实际项目接入 lightweight-charts</div>
          <div className="mt-3 grid grid-cols-4 gap-2">{[{ l: "24h高", v: "$68,120" }, { l: "24h低", v: "$65,800" }, { l: "24h量", v: "1.2B" }, { l: "市值", v: "$1.32T" }].map(s => <div key={s.l} className="rounded bg-white/5 p-2 text-xs"><span className="text-white/40">{s.l}</span><div className="font-medium mt-0.5">{s.v}</div></div>)}</div>
        </div>
        <div className="w-80 border-l border-white/10 flex flex-col">
          <div className="p-3 border-b border-white/10 text-xs font-medium text-white/60">交易面板</div>
          <div className="p-3 space-y-2">
            <div className="grid grid-cols-2 gap-2"><button className="py-2 rounded bg-green-600 text-white text-sm font-medium">买入</button><button className="py-2 rounded bg-red-600 text-white text-sm font-medium">卖出</button></div>
            <input placeholder="价格" className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-sm" />
            <input placeholder="数量" className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-sm" />
          </div>
          <div className="flex-1 border-t border-white/10 p-3"><div className="text-xs text-white/30 text-center py-8">暂无持仓</div></div>
        </div>
      </div>
    </div>
  )
}
