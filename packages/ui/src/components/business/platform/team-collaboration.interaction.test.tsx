/**
 * file team-collaboration.interaction.test.tsx
 * description TeamCollaboration 交互测试 — 评论/分享/Tab
 */

import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

const toastSpy = vi.fn()
vi.mock('../../../hooks/use-toast', () => ({
  toast: (...args: unknown[]) => toastSpy(...args),
  useToast: () => ({ toasts: [], toast: toastSpy, dismiss: vi.fn() }),
}))

import { TeamCollaboration } from './team-collaboration'

function getCommentInput(): HTMLTextAreaElement {
  // 反馈协作面板内每个 OKR 卡片各有一个评论框，取第一个
  return screen.getAllByPlaceholderText(
    '添加您的评论或建议...'
  )[0] as HTMLTextAreaElement
}

/** 切到指定 Tab */
function switchTab(label: string) {
  const trigger = screen
    .getAllByText(label)
    .map((el) => el.closest('[role="tab"]'))
    .find((el): el is HTMLElement => el !== null)
  if (!trigger) throw new Error(`未找到 Tab: ${label}`)
  fireEvent.keyDown(trigger, { key: 'Enter' })
}

describe('TeamCollaboration 交互', () => {
  it('输入评论并点击发送按钮发布', async () => {
    render(<TeamCollaboration />)
    switchTab('反馈协作')
    const input = getCommentInput()
    fireEvent.change(input, { target: { value: '这条 OKR 进度不错' } })

    // 发送按钮为图标按钮（Send），紧邻评论输入框
    const sendButton = input.parentElement!.querySelector('button')!
    expect(sendButton).not.toBeNull()
    fireEvent.click(sendButton)

    await waitFor(() =>
      expect(toastSpy).toHaveBeenCalledWith(
        expect.objectContaining({ title: '评论已发布' })
      )
    )
    // 评论发布后输入框被清空
    expect(getCommentInput().value).toBe('')
  })

  it('空评论时发送按钮禁用', () => {
    render(<TeamCollaboration />)
    switchTab('反馈协作')
    const input = getCommentInput()
    const sendButton = input.parentElement!.querySelector('button')! as HTMLButtonElement
    expect(sendButton.disabled).toBe(true)
  })

  it('分享 OKR 触发分享提示（共享目标 Tab）', async () => {
    render(<TeamCollaboration />)
    toastSpy.mockClear()
    switchTab('共享目标')
    const shareButton = screen
      .getAllByRole('button')
      .find((b) => (b.textContent ?? '').trim() === '分享')
    expect(shareButton).toBeDefined()
    fireEvent.click(shareButton!)
    await waitFor(() =>
      expect(toastSpy).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'OKR已分享' })
      )
    )
  })

  it('切换全部 Tab', () => {
    render(<TeamCollaboration />)
    const tabs = screen.getAllByRole('tab')
    expect(tabs.length).toBeGreaterThanOrEqual(2)
    for (const trigger of tabs) {
      fireEvent.keyDown(trigger, { key: 'Enter' })
      expect(trigger).toHaveAttribute('data-state', 'active')
    }
  })
})
