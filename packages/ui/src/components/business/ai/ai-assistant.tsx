"use client"

/**
 * file ai-assistant.tsx
 * description AI 智能助手 — 多模型对话面板，支持本地/云端模型切换
 * module @yyc3/ui/business/ai
 * author YanYuCloudCube Team <admin@0379.email>
 * version 3.0.0
 * created 2026-06-20
 * status active
 *
 * copyright YanYuCloudCube Team
 * license MIT
 *
 * brief 从 UI-MONO 适配入库，移除硬依赖，改为 props 注入
 */

import { useState, useRef, useEffect } from "react"
import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"
import {
  Bot, Send, Mic, MicOff, Lightbulb, AlertTriangle, CheckCircle,
  Clock, Users, DollarSign, BarChart3, Zap, Cloud, Server, ChevronRight,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { Badge } from "../../ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs"
import { ScrollArea } from "../../ui/scroll-area"
import { Avatar, AvatarFallback } from "../../ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select"
import { Slider } from "../../ui/slider"
import { Switch } from "../../ui/switch"
import { cn } from "../../../lib/utils"

// ─── 类型定义 ─────────────────────────────────────

export interface ChatMessage {
  role: "user" | "assistant" | "system"
  content: string
  timestamp?: Date
}

export interface ChatRequest {
  modelId: string
  messages: ChatMessage[]
  temperature: number
  maxTokens: number
  stream?: boolean
}

export interface ChatResponse {
  success: boolean
  content: string
  error?: string
}

export interface AIModel {
  id: string
  name: string
  type: "local" | "cloud"
  provider: string
  description: string
  maxTokens: number
  capabilities: string[]
}

export interface AIServiceAdapter {
  chat(request: ChatRequest): Promise<ChatResponse>
}

export interface Insight {
  id: string
  type: "warning" | "success" | "info"
  title: string
  description: string
  action?: string
}

export interface QuickAction {
  id: string
  title: string
  description: string
  icon: LucideIcon
  action: () => void
}

// ─── 组件 Props ─────────────────────────────────────

export interface AIAssistantProps {
  /** AI 服务适配器（注入式，不硬依赖具体实现） */
  service?: AIServiceAdapter
  /** 可用模型列表 */
  models?: AIModel[]
  /** 默认选中的模型 ID */
  defaultModelId?: string
  /** 业务洞察列表 */
  insights?: Insight[]
  /** 快捷操作列表 */
  quickActions?: QuickAction[]
  /** 附加 className */
  className?: string
  /** 标题 */
  title?: string
  /** 副标题 */
  subtitle?: string
  /** 初始消息 */
  initialMessages?: ChatMessage[]
  /** 发送消息回调 */
  onSendMessage?: (message: ChatMessage) => void
  /** 语音输入切换回调 */
  onVoiceToggle?: (listening: boolean) => void
}

// ─── 默认值 ─────────────────────────────────────

const defaultInsights: Insight[] = [
  { id: "1", type: "warning", title: "客户流失风险", description: "检测到3个重要客户月活跃度下降超过40%", action: "查看详情" },
  { id: "2", type: "success", title: "销售目标达成", description: "本月销售额已达成目标的105%，超额完成", action: "查看报表" },
  { id: "3", type: "info", title: "库存优化建议", description: "建议调整5个产品的库存配置以提高周转率", action: "优化库存" },
]

const defaultQuickActions: QuickAction[] = [
  { id: "1", title: "生成销售报表", description: "自动生成本月销售数据报表", icon: BarChart3, action: () => {} },
  { id: "2", title: "客户跟进提醒", description: "查看需要跟进的客户列表", icon: Users, action: () => {} },
  { id: "3", title: "财务数据分析", description: "分析当前财务状况和趋势", icon: DollarSign, action: () => {} },
  { id: "4", title: "任务优先级排序", description: "智能排序待办任务优先级", icon: Clock, action: () => {} },
]

// ─── 组件实现 ─────────────────────────────────────

export function AIAssistant({
  service,
  models = [],
  defaultModelId,
  insights = defaultInsights,
  quickActions = defaultQuickActions,
  className,
  title = "AI智能助手",
  subtitle = "支持本地和云端多种大模型的智能业务分析系统",
  initialMessages,
  onSendMessage,
  onVoiceToggle,
}: AIAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(
    initialMessages ?? [
      {
        role: "assistant",
        content: "您好！我是您的AI智能助手，支持多种本地和云端大模型。我可以帮您分析业务数据、提供决策建议、执行常用操作。有什么可以帮助您的吗？",
        timestamp: new Date(),
      },
    ],
  )
  const [inputValue, setInputValue] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [selectedModel, setSelectedModel] = useState(defaultModelId ?? models[0]?.id ?? "")
  const [temperature, setTemperature] = useState([0.7])
  const [maxTokens, setMaxTokens] = useState([2000])
  const [streamMode, setStreamMode] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (models.length > 0 && !models.find((m) => m.id === selectedModel)) {
      setSelectedModel(models[0].id)
    }
  }, [models, selectedModel])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: ChatMessage = {
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)
    onSendMessage?.(userMessage)

    if (!service) {
      setIsTyping(false)
      return
    }

    try {
      const request: ChatRequest = {
        modelId: selectedModel,
        messages: [...messages, userMessage],
        temperature: temperature[0],
        maxTokens: maxTokens[0],
        stream: streamMode,
      }

      const response = await service.chat(request)

      if (response.success) {
        const aiResponse: ChatMessage = {
          role: "assistant",
          content: response.content,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiResponse])
      } else {
        const errorMessage: ChatMessage = {
          role: "assistant",
          content: `抱歉，AI服务调用失败：${response.error}`,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorMessage])
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        role: "assistant",
        content: `抱歉，发生了未知错误：${error instanceof Error ? error.message : "未知错误"}`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleQuickAction = async (action: string) => {
    const actionMessage: ChatMessage = {
      role: "user",
      content: `执行操作：${action}`,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, actionMessage])
    setIsTyping(true)
    onSendMessage?.(actionMessage)

    if (!service) {
      setIsTyping(false)
      return
    }

    try {
      const request: ChatRequest = {
        modelId: selectedModel,
        messages: [...messages, actionMessage],
        temperature: temperature[0],
        maxTokens: maxTokens[0],
      }

      const response = await service.chat(request)

      if (response.success) {
        setMessages((prev) => [...prev, {
          role: "assistant",
          content: response.content,
          timestamp: new Date(),
        }])
      } else {
        setMessages((prev) => [...prev, {
          role: "assistant",
          content: `操作执行失败：${response.error}`,
          timestamp: new Date(),
        }])
      }
    } catch (error) {
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: `操作执行失败：${error instanceof Error ? error.message : "未知错误"}`,
        timestamp: new Date(),
      }])
    } finally {
      setIsTyping(false)
    }
  }

  const toggleVoiceInput = () => {
    const next = !isListening
    setIsListening(next)
    onVoiceToggle?.(next)
  }

  const getModelIcon = (model: AIModel | undefined) => {
    if (!model) return <Cloud className="w-4 h-4" />
    return model.type === "local" ? <Server className="w-4 h-4" /> : <Cloud className="w-4 h-4" />
  }

  const getModelBadgeColor = (model: AIModel | undefined) => {
    if (!model) return "bg-muted text-muted-foreground border-border"
    return model.type === "local"
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-purple-100 text-purple-800 border-purple-200"
  }

  const ColoredProgress = ({ value, color }: { value: number; color: string }) => {
    return (
      <div className="w-full bg-slate-200 rounded-full h-2">
        <div
          className={cn("h-2 rounded-full transition-all duration-1000 ease-out", color)}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    )
  }

  const currentModel = models.find((m) => m.id === selectedModel)
  const localModels = models.filter((m) => m.type === "local")
  const cloudModels = models.filter((m) => m.type === "cloud")

  return (
    <div className={cn("min-h-screen bg-gradient-to-br from-slate-50 to-sky-50/30 p-6 space-y-6", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          <p className="text-slate-600 mt-2">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
            <Bot className="w-4 h-4 mr-1" />
            AI驱动
          </Badge>
          <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
            <Zap className="w-4 h-4 mr-1" />
            多模型支持
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="chat" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="chat">智能对话</TabsTrigger>
          <TabsTrigger value="insights">业务洞察</TabsTrigger>
          <TabsTrigger value="actions">快捷操作</TabsTrigger>
          <TabsTrigger value="settings">模型设置</TabsTrigger>
        </TabsList>

        {/* ─── 智能对话 ─── */}
        <TabsContent value="chat" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <Card className="border-l-4 border-l-purple-400 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-xl shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-300 h-[600px] flex flex-col">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-purple-600" />
                    智能对话助手
                    <Badge variant="outline" className={getModelBadgeColor(currentModel)}>
                      {getModelIcon(currentModel)}
                      <span className="ml-1">{currentModel?.name ?? "未选择模型"}</span>
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <ScrollArea className="flex-1 pr-4">
                    <div className="space-y-4">
                      {messages.map((message, index) => (
                        <div
                          key={index}
                          className={cn("flex gap-3", message.role === "user" ? "justify-end" : "justify-start")}
                        >
                          {message.role === "assistant" && (
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="bg-purple-100 text-purple-600">
                                <Bot className="w-4 h-4" />
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div
                            className={cn(
                              "max-w-[80%] rounded-lg p-3",
                              message.role === "user"
                                ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white"
                                : "bg-purple-50 text-slate-900 border border-purple-200",
                            )}
                          >
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            <p className="text-xs opacity-70 mt-1">{message.timestamp?.toLocaleTimeString()}</p>
                          </div>
                          {message.role === "user" && (
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="bg-purple-100 text-purple-600">U</AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      ))}
                      {isTyping && (
                        <div className="flex gap-3 justify-start">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-purple-100 text-purple-600">
                              <Bot className="w-4 h-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                            <div className="flex gap-1">
                              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div ref={messagesEndRef} />
                  </ScrollArea>

                  <div className="flex gap-2 mt-4">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="输入您的问题或需求..."
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                      className="flex-1 border-purple-200 focus:ring-purple-500 focus:border-purple-500"
                    />
                    <Button
                      onClick={toggleVoiceInput}
                      variant="outline"
                      size="icon"
                      className={cn("border-purple-200", isListening ? "bg-red-50 border-red-200" : "hover:bg-purple-50")}
                    >
                      {isListening ? <MicOff className="w-4 h-4 text-red-600" /> : <Mic className="w-4 h-4 text-purple-600" />}
                    </Button>
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isTyping}
                      className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card className="border-l-4 border-l-purple-400 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-xl shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-300 p-4">
                <h3 className="font-semibold text-slate-900 mb-3">模型选择</h3>
                {models.length > 0 ? (
                  <Select value={selectedModel} onValueChange={setSelectedModel}>
                    <SelectTrigger className="border-purple-200 focus:ring-purple-500">
                      <SelectValue placeholder="选择AI模型" />
                    </SelectTrigger>
                    <SelectContent>
                      {models.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          <div className="flex items-center gap-2">
                            {getModelIcon(model)}
                            <span>{model.name}</span>
                            <Badge variant="outline" className={getModelBadgeColor(model)}>
                              {model.type === "local" ? "本地" : "云端"}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm text-slate-500">未配置可用模型</p>
                )}
                {currentModel && (
                  <p className="text-xs text-slate-600 mt-2">{currentModel.description}</p>
                )}
              </Card>

              <Card className="border-l-4 border-l-purple-400 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-xl shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-300 p-4">
                <h3 className="font-semibold text-slate-900 mb-3">快速设置</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700">创造性 ({temperature[0]})</label>
                    <Slider value={temperature} onValueChange={setTemperature} max={1} min={0} step={0.1} className="mt-2" />
                    <ColoredProgress value={temperature[0] * 100} color="bg-gradient-to-r from-purple-400 to-purple-500" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">最大长度 ({maxTokens[0]})</label>
                    <Slider value={maxTokens} onValueChange={setMaxTokens} max={8000} min={100} step={100} className="mt-2" />
                    <ColoredProgress value={(maxTokens[0] / 8000) * 100} color="bg-gradient-to-r from-purple-400 to-purple-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-700">流式输出</label>
                    <Switch checked={streamMode} onCheckedChange={setStreamMode} />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ─── 业务洞察 ─── */}
        <TabsContent value="insights" className="space-y-4">
          <div className="grid gap-4">
            {insights.map((insight) => (
              <Card
                key={insight.id}
                className="border-l-4 border-l-purple-400 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-xl shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-300 p-4 group"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "p-2 rounded-lg",
                      insight.type === "warning" ? "bg-amber-100" : insight.type === "success" ? "bg-green-100" : "bg-purple-100",
                    )}
                  >
                    {insight.type === "warning" && <AlertTriangle className="w-5 h-5 text-amber-600" />}
                    {insight.type === "success" && <CheckCircle className="w-5 h-5 text-green-600" />}
                    {insight.type === "info" && <Lightbulb className="w-5 h-5 text-purple-600" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{insight.title}</h3>
                    <p className="text-slate-600 text-sm mt-1">{insight.description}</p>
                    {insight.action && (
                      <div className="flex items-center mt-2 text-purple-600 text-sm font-medium">
                        <span>{insight.action}</span>
                        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ─── 快捷操作 ─── */}
        <TabsContent value="actions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action) => (
              <Card
                key={action.id}
                className="border-l-4 border-l-purple-400 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-xl shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-300 p-4 cursor-pointer group"
              >
                <div
                  className="flex items-start gap-3"
                  onClick={() => {
                    action.action()
                    handleQuickAction(action.title)
                  }}
                >
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <action.icon className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{action.title}</h3>
                    <p className="text-slate-600 text-sm mt-1">{action.description}</p>
                    <div className="flex items-center mt-2 text-purple-600 text-sm font-medium">
                      <span>立即执行</span>
                      <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ─── 模型设置 ─── */}
        <TabsContent value="settings" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-l-4 border-l-green-400 bg-white/80 backdrop-blur-sm border border-green-200 rounded-xl shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-300 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">本地模型</h3>
              <div className="space-y-4">
                {localModels.length === 0 ? (
                  <p className="text-sm text-slate-500">无可用本地模型</p>
                ) : (
                  localModels.map((model) => (
                    <div key={model.id} className="flex items-center justify-between p-3 border border-green-200 rounded-lg hover:bg-green-50 transition-all duration-200">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Server className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-900">{model.name}</h4>
                          <p className="text-sm text-slate-600">{model.description}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">本地部署</Badge>
                    </div>
                  ))
                )}
              </div>
            </Card>

            <Card className="border-l-4 border-l-purple-400 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-xl shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-300 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">云端模型</h3>
              <div className="space-y-4">
                {cloudModels.length === 0 ? (
                  <p className="text-sm text-slate-500">无可用云端模型</p>
                ) : (
                  cloudModels.map((model) => (
                    <div key={model.id} className="flex items-center justify-between p-3 border border-purple-200 rounded-lg hover:bg-purple-50 transition-all duration-200">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Cloud className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-900">{model.name}</h4>
                          <p className="text-sm text-slate-600">{model.description}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">{model.provider}</Badge>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          {models.length > 0 && (
            <Card className="border-l-4 border-l-purple-400 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-xl shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-300 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">模型能力对比</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-purple-200">
                      <th className="text-left p-2">模型名称</th>
                      <th className="text-left p-2">类型</th>
                      <th className="text-left p-2">最大Token</th>
                      <th className="text-left p-2">主要能力</th>
                    </tr>
                  </thead>
                  <tbody>
                    {models.map((model) => (
                      <tr key={model.id} className="border-b border-purple-100 hover:bg-purple-50">
                        <td className="p-2 font-medium">{model.name}</td>
                        <td className="p-2">
                          <Badge variant="outline" className={getModelBadgeColor(model)}>
                            {model.type === "local" ? "本地" : "云端"}
                          </Badge>
                        </td>
                        <td className="p-2">{model.maxTokens.toLocaleString()}</td>
                        <td className="p-2">
                          <div className="flex flex-wrap gap-1">
                            {model.capabilities.slice(0, 2).map((capability, index) => (
                              <Badge key={index} variant="secondary" className="text-xs bg-purple-100 text-purple-800">{capability}</Badge>
                            ))}
                            {model.capabilities.length > 2 && (
                              <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-800">+{model.capabilities.length - 2}</Badge>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
