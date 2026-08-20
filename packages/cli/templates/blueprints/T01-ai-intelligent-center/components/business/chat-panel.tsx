"use client"

import { useEffect, useRef, useState } from "react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  time: string
}

const mockMessages: Message[] = [
  {
    id: "1",
    role: "user",
    content: "帮我分析一下企业管理制度中三级响应机制的优化方向",
    time: "10:30",
  },
  {
    id: "2",
    role: "assistant",
    content: `## 三级响应机制优化分析

基于YYC³五维驱动框架，三级响应机制的优化可以从以下维度展开：

### 1. 响应分级标准化

| 级别 | 触发条件 | 响应时间 | 责任人 |
|------|---------|---------|--------|
| 一级 | 核心业务异常 | ≤15分钟 | 部门负责人 |
| 二级 | 流程偏差 | ≤2小时 | 主管 |
| 三级 | 常规问题 | ≤24小时 | 执行层 |

### 2. 自动化升级规则

- 一级响应超时自动升级至管理层
- 二级响应超时触发一级响应流程
- 三级响应超时自动转二级

### 3. 数据驱动优化

通过历史响应数据分析，识别高频问题和瓶颈环节，持续优化响应策略。

> **建议**：结合DPO训练数据中的管理偏好对齐结果，使AI助手在响应建议中更符合你的管理哲学。

\`\`\`
// TODO: 接入实际API获取AI响应
// const response = await fetch('/api/chat', { method: 'POST', body: ... })
\`\`\``,
    time: "10:30",
  },
]

export function ChatPanel({ conversationId }: { conversationId: string }) {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return

    const userMsg: Message = {
      id: String(Date.now()),
      role: "user",
      content: input.trim(),
      time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setIsTyping(true)

    setTimeout(() => {
      const aiMsg: Message = {
        id: String(Date.now() + 1),
        role: "assistant",
        content: `// TODO: 接入AI模型API\n// 这是一个模拟回复，实际项目中替换为模型调用\n\n收到你的问题："${userMsg.content}"\n\n这是AI助手的回复区域。实际部署时，这里会显示来自Qwen3.6-27B + YYC³ LoRA的智能响应。`,
        time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages((prev) => [...prev, aiMsg])
      setIsTyping(false)
    }, 1500)
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
                }`}
            >
              {msg.role === "assistant" ? (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-sm">
                    {msg.content}
                  </pre>
                </div>
              ) : (
                msg.content
              )}
              <div
                className={`text-xs mt-1 ${msg.role === "user" ? "text-primary-foreground/60" : "text-muted-foreground"
                  }`}
              >
                {msg.time}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-2xl px-4 py-3 text-sm text-muted-foreground">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="border-t border-border p-4">
        <div className="flex gap-2 max-w-4xl mx-auto">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder="输入消息... (Shift+Enter换行)"
            rows={1}
            className="flex-1 resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="shrink-0 rounded-xl bg-primary text-primary-foreground px-4 py-3 text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </div>
        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground max-w-4xl mx-auto">
          <span>模型: Qwen3.6-27B + YYC³ DPO</span>
          <span>·</span>
          <span>上下文: 2048 tokens</span>
          <span>·</span>
          <span>温度: 0.7</span>
        </div>
      </div>
    </div>
  )
}
