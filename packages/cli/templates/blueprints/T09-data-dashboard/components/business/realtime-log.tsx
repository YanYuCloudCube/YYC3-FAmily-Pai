interface LogEntry {
  time: string
  level: "info" | "warn" | "error"
  msg: string
}

const levelColors = {
  info: "text-blue-400",
  warn: "text-yellow-400",
  error: "text-red-400",
}

export function RealtimeLog({ logs }: { logs: LogEntry[] }) {
  return (
    <div className="space-y-1.5 font-mono text-xs h-40 overflow-y-auto">
      {logs.map((log, i) => (
        <div key={i} className="flex gap-2">
          <span className="text-white/30 shrink-0">{log.time}</span>
          <span className={`shrink-0 uppercase w-12 ${levelColors[log.level]}`}>[{log.level}]</span>
          <span className="text-white/60 truncate">{log.msg}</span>
        </div>
      ))}
    </div>
  )
}
