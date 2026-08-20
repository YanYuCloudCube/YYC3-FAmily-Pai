"use client"

import { cn } from "@/lib/utils"

interface Conversation {
  id: string
  title: string
  time: string
  preview: string
}

interface SidebarProps {
  open: boolean
  onToggle: () => void
  conversations: Conversation[]
  activeId: string
  onSelect: (id: string) => void
  onNewChat: () => void
  onOpenHistory: () => void
  onOpenSettings: () => void
}

export function Sidebar({
  open,
  onToggle,
  conversations,
  activeId,
  onSelect,
  onNewChat,
  onOpenHistory,
  onOpenSettings,
}: SidebarProps) {
  return (
    <aside
      className={cn(
        "border-r border-border bg-sidebar-background transition-all duration-200 flex flex-col",
        open ? "w-72" : "w-0 overflow-hidden"
      )}
    >
      <div className="p-3 border-b border-border">
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          新对话
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {conversations.map((conv) => (
          <button
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={cn(
              "w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors",
              activeId === conv.id
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "hover:bg-sidebar-accent/50 text-sidebar-foreground/70"
            )}
          >
            <div className="font-medium truncate">{conv.title}</div>
            <div className="text-xs text-muted-foreground mt-0.5 flex justify-between">
              <span className="truncate">{conv.preview}</span>
              <span className="shrink-0 ml-2">{conv.time}</span>
            </div>
          </button>
        ))}
      </nav>

      <div className="p-2 border-t border-border space-y-1">
        <button
          onClick={onOpenHistory}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/50 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12,6 12,12 16,14" />
          </svg>
          历史记录
        </button>
        <button
          onClick={onToggle}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/50 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 19l-7-7 7-7M18 19l-7-7 7-7" />
          </svg>
          收起侧栏
        </button>
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/50 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          设置
        </button>
      </div>
    </aside>
  )
}
