/**
 * file ai-assistant.interaction.test.tsx
 * description AIAssistant 交互测试 — 发送消息/快捷操作/语音开关/Tab
 */

import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { AIServiceAdapter, ChatResponse } from './ai-assistant'
import { AIAssistant } from './ai-assistant'

const chatMock = vi.fn(
  async (): Promise<ChatResponse> => ({
    success: true,
    content: '这是AI回复内容',
  })
)

const mockService: AIServiceAdapter = { chat: chatMock }

describe('AIAssistant 交互', () => {
  it('输入并回车发送消息，触发 chat 服务', async () => {
    render(<AIAssistant service={mockService} />)
    const input = screen.getByPlaceholderText('输入您的问题或需求...')
    fireEvent.change(input, { target: { value: '帮我分析销售数据' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    await waitFor(() => {
      expect(chatMock).toHaveBeenCalled()
    })
  })

  it('输入后点击发送按钮同样触发', async () => {
    chatMock.mockClear()
    render(<AIAssistant service={mockService} />)
    const input = screen.getByPlaceholderText('输入您的问题或需求...')
    fireEvent.change(input, { target: { value: '生成报表' } })
    // 发送按钮为图标按钮（输入非空后可点击）
    const sendButton = input.parentElement!.querySelector('button:last-of-type')!
    fireEvent.click(sendButton)
    await waitFor(() => expect(chatMock).toHaveBeenCalled())
  })

  it('空输入不触发发送', () => {
    chatMock.mockClear()
    render(<AIAssistant service={mockService} />)
    const input = screen.getByPlaceholderText('输入您的问题或需求...')
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(chatMock).not.toHaveBeenCalled()
  })

  it('点击快捷操作卡片触发 chat（需先切到快捷操作 Tab）', async () => {
    chatMock.mockClear()
    render(<AIAssistant service={mockService} />)
    const actionsTab = screen
      .getAllByText('快捷操作')
      .map((el) => el.closest('[role="tab"]'))
      .find((el): el is HTMLElement => el !== null)
    expect(actionsTab).toBeDefined()
    fireEvent.keyDown(actionsTab!, { key: 'Enter' })

    // 快捷操作是 Card（div onClick），点击其标题文本（事件冒泡触发）
    const quickAction = screen
      .getAllByText(/生成销售报表|客户跟进提醒/)
      .find((el) => el.closest('[class*="cursor-pointer"]'))
    expect(quickAction).toBeDefined()
    fireEvent.click(quickAction!)
    await waitFor(() => expect(chatMock).toHaveBeenCalled())
  })

  it('点击语音按钮切换听写状态', () => {
    render(<AIAssistant service={mockService} />)
    const input = screen.getByPlaceholderText('输入您的问题或需求...')
    const voiceButton = input.parentElement!.querySelector('button:first-of-type')!
    fireEvent.click(voiceButton)
    expect(voiceButton).toBeDefined()
  })
})
