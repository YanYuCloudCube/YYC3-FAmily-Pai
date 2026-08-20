"use client"

import { ChatPanel } from "@/components/business/chat-panel"
import { HistoryPanel } from "@/components/business/history-panel"
import { SettingsDialog } from "@/components/business/settings-dialog"
import { Sidebar } from "@/components/layout/sidebar"
import { useState } from "react"

const conversations = [
  { id: "1", title: "企业管理制度优化方案", time: "10:30", preview: "关于三级响应机制的设计..." },
  { id: "2", title: "DPO训练数据分析", time: "09:15", preview: "1806条数据的清洗报告..." },
  { id: "3", title: "Qwen3.6-27B部署方案", time: "昨天", preview: "QLoRA NF4量化配置..." },
  { id: "4", title: "智慧城市平台架构", time: "昨天", preview: "基于Next.js 15的微服务..." },
  { id: "5", title: "经管运维系统需求", time: "3天前", preview: "四维价值矩阵设计..." },
]

export default function AIIntelligentCenter() {
  const [activeConv, setActiveConv] = useState("1")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [view, setView] = useState<"chat" | "history">("chat")

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        conversations={conversations}
        activeId={activeConv}
        onSelect={setActiveConv}
        onNewChat={() => setActiveConv(String(Date.now()))}
        onOpenHistory={() => setView("history")}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-border flex items-center px-4 gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-accent rounded-md lg:hidden"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="text-sm font-medium truncate">
              {conversations.find(c => c.id === activeConv)?.title || "新的对话"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
              Qwen3.6-27B
            </span>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
              YYC³ DPO
            </span>
          </div>
        </header>

        {view === "chat" ? (
          <ChatPanel conversationId={activeConv} />
        ) : (
          <HistoryPanel onBack={() => setView("chat")} />
        )}
      </main>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  )
}
