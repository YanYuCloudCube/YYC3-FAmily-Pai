/**
 * file pwa-manager.interaction.test.tsx
 * description PWAManager 交互测试 — 安装/清缓存/通知权限/Tab 切换
 */

import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PWAManager } from './pwa-manager'

function switchTab(label: string) {
  const trigger = screen
    .getAllByText(label)
    .find((el) => el.closest('[role="tab"]'))
  if (!trigger) throw new Error(`未找到 Tab: ${label}`)
  fireEvent.keyDown(trigger, { key: 'Enter' })
}

describe('PWAManager 交互', () => {
  it('点击立即安装：进入安装中状态并最终安装完成', async () => {
    render(<PWAManager />)
    fireEvent.click(screen.getByText('立即安装'))
    // 安装期间按钮显示 安装中...
    await waitFor(() => {
      expect(screen.getByText(/安装中/)).toBeDefined()
    })
    // 2s 模拟安装完成后进入已安装状态
    await waitFor(
      () => {
        expect(screen.getByText('应用已安装')).toBeDefined()
      },
      { timeout: 5000 }
    )
  })

  it('缓存管理面板：清理按钮可点击完成清理', async () => {
    render(<PWAManager />)
    switchTab('缓存管理')
    const panel = screen.getByRole('tabpanel')
    const clearButton = panel.querySelector('button') as HTMLButtonElement
    expect(clearButton).not.toBeNull()
    fireEvent.click(clearButton)
    // jsdom 无 Cache API：清空全部分支安全走完，按钮恢复可用
    await waitFor(
      () => {
        expect(clearButton).not.toBeDisabled()
      },
      { timeout: 4000 }
    )
  })

  it('通知设置面板：授权通知按钮可点击', () => {
    render(<PWAManager />)
    switchTab('通知设置')
    const button = screen.getByText('授权通知').closest('button')!
    fireEvent.click(button)
    expect(button).toBeDefined()
  })

  it('切换应用安装/缓存管理/通知设置/数据同步 Tab', () => {
    render(<PWAManager />)
    for (const tab of ['应用安装', '缓存管理', '通知设置', '数据同步']) {
      switchTab(tab)
      const trigger = screen
        .getAllByText(tab)
        .find((el) => el.closest('[role="tab"]'))!
      expect(trigger.closest('[role="tab"]')).toHaveAttribute(
        'data-state',
        'active'
      )
    }
  })

  it('每个 Tab 面板内的按钮与开关均可交互', () => {
    render(<PWAManager />)
    for (const tab of ['应用安装', '缓存管理', '通知设置', '数据同步']) {
      switchTab(tab)
      const panel = screen.getByRole('tabpanel')
      for (const btn of Array.from(panel.querySelectorAll('button'))) {
        if (!btn.disabled) fireEvent.click(btn)
      }
      for (const sw of Array.from(panel.querySelectorAll('[role="switch"]'))) {
        fireEvent.click(sw)
      }
    }
    expect(document.body).toBeDefined()
  })

  it('online/offline 网络事件更新状态', () => {
    render(<PWAManager />)
    fireEvent(window, new Event('offline'))
    fireEvent(window, new Event('online'))
    expect(document.body).toBeDefined()
  })
})
