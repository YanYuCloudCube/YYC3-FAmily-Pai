"use client"

interface HistoryPanelProps {
  onBack: () => void
}

const historyGroups = [
  {
    label: "今天",
    items: [
      { title: "企业管理制度优化方案", time: "10:30", tokens: "2.4k" },
      { title: "DPO训练数据分析", time: "09:15", tokens: "1.8k" },
    ],
  },
  {
    label: "昨天",
    items: [
      { title: "Qwen3.6-27B部署方案", time: "16:45", tokens: "3.2k" },
      { title: "智慧城市平台架构", time: "14:20", tokens: "2.1k" },
      { title: "DevOps监控告警规则", time: "11:00", tokens: "1.5k" },
    ],
  },
  {
    label: "最近7天",
    items: [
      { title: "经管运维系统需求分析", time: "5月6日", tokens: "4.1k" },
      { title: "SaaS多租户架构设计", time: "5月5日", tokens: "2.8k" },
      { title: "AI医疗问诊流程优化", time: "5月4日", tokens: "1.9k" },
      { title: "CRM客户管理模块设计", time: "5月3日", tokens: "2.3k" },
    ],
  },
]

export function HistoryPanel({ onBack }: HistoryPanelProps) {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={onBack}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-lg font-semibold">历史记录</h2>
        </div>

        <div className="relative mb-6">
          <input
            type="search"
            placeholder="搜索对话历史..."
            className="w-full rounded-xl border border-input bg-background px-4 py-2.5 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        </div>

        <div className="space-y-6">
          {historyGroups.map((group) => (
            <div key={group.label}>
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                {group.label}
              </h3>
              <div className="space-y-2">
                {group.items.map((item, i) => (
                  <button
                    key={i}
                    className="w-full text-left p-3 rounded-xl border border-border hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.title}</span>
                      <span className="text-xs text-muted-foreground">{item.time}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {item.tokens} tokens
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
