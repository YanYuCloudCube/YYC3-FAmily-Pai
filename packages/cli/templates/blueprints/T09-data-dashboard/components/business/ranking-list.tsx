interface RankingItem {
  name: string
  value: number
  percent: number
}

export function RankingList({ data }: { data: RankingItem[] }) {
  return (
    <div className="space-y-3">
      {data.map((item, i) => (
        <div key={item.name}>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="flex items-center gap-2">
              <span className={`w-4 h-4 rounded text-xs flex items-center justify-center font-bold ${i < 3 ? "bg-primary text-primary-foreground" : "bg-white/10 text-white/50"}`}>
                {i + 1}
              </span>
              {item.name}
            </span>
            <span className="text-white/60">{(item.value / 1000).toFixed(1)}K</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60 transition-all"
              style={{ width: `${item.percent}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
