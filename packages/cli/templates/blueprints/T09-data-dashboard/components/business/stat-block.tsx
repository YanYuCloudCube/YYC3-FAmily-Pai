interface StatBlockProps {
  label: string
  value: string
  change: string
  icon: string
}

export function StatBlock({ label, value, change, icon }: StatBlockProps) {
  const isPositive = change.startsWith("+")
  return (
    <div className="rounded-xl bg-white/5 border border-white/10 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-white/50">{label}</span>
        <span className="text-lg">{icon}</span>
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div className={`text-xs mt-1 ${isPositive ? "text-green-400" : "text-red-400"}`}>
        {change}
      </div>
    </div>
  )
}
