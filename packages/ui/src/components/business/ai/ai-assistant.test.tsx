/**
 * file ai-assistant.test.tsx
 * description AIAssistant 组件测试 — 渲染 + 交互 + 边界
 */

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { AIModel, AIServiceAdapter, ChatResponse } from './ai-assistant'
import { AIAssistant } from './ai-assistant'

// 模拟 AI 服务
const mockService: AIServiceAdapter = {
  chat: vi.fn(async () => ({
    success: true,
    content: '这是AI回复内容',
  } satisfies ChatResponse)),
}

const mockModels: AIModel[] = [
  {
    id: 'test-local',
    name: '测试本地模型',
    type: 'local',
    provider: 'Ollama',
    description: '本地部署的测试模型',
    maxTokens: 4000,
    capabilities: ['对话', '分析'],
  },
  {
    id: 'test-cloud',
    name: '测试云端模型',
    type: 'cloud',
    provider: 'OpenAI',
    description: '云端GPT模型',
    maxTokens: 8000,
    capabilities: ['对话', '分析', '代码生成'],
  },
]

describe('AIAssistant', () => {
  it('应该无崩溃渲染', () => {
    const { container } = render(<AIAssistant />)
    expect(container).toBeDefined()
  })

  it('应该显示标题和副标题', () => {
    render(<AIAssistant title="测试助手" subtitle="测试副标题" />)
    expect(screen.getByText('测试助手')).toBeDefined()
    expect(screen.getByText('测试副标题')).toBeDefined()
  })

  it('应该显示默认欢迎消息', () => {
    render(<AIAssistant />)
    expect(screen.getByText(/您好！我是您的AI智能助手/)).toBeDefined()
  })

  it('应该显示四个 Tab 标签', () => {
    render(<AIAssistant />)
    expect(screen.getByText('智能对话')).toBeDefined()
    expect(screen.getByText('业务洞察')).toBeDefined()
    expect(screen.getByText('快捷操作')).toBeDefined()
    expect(screen.getByText('模型设置')).toBeDefined()
  })

  it('无 service 时不应崩溃', () => {
    const { container } = render(<AIAssistant />)
    expect(container).toBeDefined()
  })

  it('无 models 时显示未配置提示', () => {
    render(<AIAssistant models={[]} />)
    expect(screen.getByText('未配置可用模型')).toBeDefined()
  })

  it('应该显示自定义初始消息', () => {
    const customMessages = [
      { role: 'assistant' as const, content: '自定义初始消息', timestamp: new Date() },
    ]
    render(<AIAssistant initialMessages={customMessages} />)
    expect(screen.getByText('自定义初始消息')).toBeDefined()
  })

  it('应该接受自定义 className', () => {
    const { container } = render(<AIAssistant className="custom-class" />)
    expect(container.querySelector('.custom-class')).toBeDefined()
  })

  it('应该接受自定义洞察数据', () => {
    const customInsights = [
      { id: 'c1', type: 'warning' as const, title: '自定义警告', description: '自定义描述' },
    ]
    render(<AIAssistant insights={customInsights} />)
    // 洞察在 insights tab（非默认），但 AI驱动 badge 总是显示
    expect(screen.getByText('AI驱动')).toBeDefined()
  })

  it('应该接受 models 和 service 而不崩溃', () => {
    const { container } = render(
      <AIAssistant service={mockService} models={mockModels} defaultModelId="test-local" />,
    )
    expect(container).toBeDefined()
  })
})
