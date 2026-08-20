/**
 * file system-status-monitor.interaction.test.tsx
 * description SystemStatusMonitor 交互测试 — 刷新/优化/扫描/导出/分享/Tab 切换
 */

import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

const toastSpy = vi.fn()
vi.mock('../../../hooks/use-toast', () => ({
  toast: (...args: unknown[]) => toastSpy(...args),
  useToast: () => ({ toasts: [], toast: toastSpy, dismiss: vi.fn() }),
}))

import { SystemStatusMonitor } from './system-status-monitor'

describe('SystemStatusMonitor 交互', () => {
  it('点击刷新状态：按钮进入禁用态并最终弹出成功 toast', async () => {
    render(<SystemStatusMonitor />)
    const refreshButton = screen.getByText('刷新状态').closest('button')!
    fireEvent.click(refreshButton)
    // 刷新期间（1.5s 内）按钮禁用
    expect(refreshButton).toBeDisabled()
    await waitFor(
      () => {
        expect(toastSpy).toHaveBeenCalledWith(
          expect.objectContaining({ title: '系统状态已刷新' })
        )
      },
      { timeout: 4000 }
    )
    await waitFor(() => {
      expect(refreshButton).not.toBeDisabled()
    })
  })

  it('点击导出报告触发导出 toast', () => {
    render(<SystemStatusMonitor />)
    fireEvent.click(screen.getByText('导出报告'))
    expect(toastSpy).toHaveBeenCalledWith(
      expect.objectContaining({ title: '导出成功' })
    )
  })

  it('系统优化与安全扫描触发 toast 及 onNavigate 导航', () => {
    const onNavigate = vi.fn()
    render(<SystemStatusMonitor onNavigate={onNavigate} />)

    fireEvent.click(screen.getByText('系统优化'))
    expect(toastSpy).toHaveBeenCalledWith(
      expect.objectContaining({ title: '系统优化已启动' })
    )
    expect(onNavigate).toHaveBeenCalledWith('/performance-optimization')

    fireEvent.click(screen.getByText('安全扫描'))
    expect(toastSpy).toHaveBeenCalledWith(
      expect.objectContaining({ title: '安全扫描已开始' })
    )
    expect(onNavigate).toHaveBeenCalledWith('/security')
  })

  it('切换性能/安全/日志/告警 Tab', () => {
    render(<SystemStatusMonitor />)
    for (const tab of ['性能', '安全', '日志', '告警']) {
      const trigger = screen.getByText(tab).closest('[role="tab"]')!
      // Radix Tabs 在 jsdom 下以 Enter 键激活
      fireEvent.keyDown(trigger, { key: 'Enter' })
      expect(trigger).toHaveAttribute('data-state', 'active')
    }
  })

  it('每个 Tab 面板内的操作按钮均可点击（服务重启/日志查看/告警确认等）', () => {
    const onNavigate = vi.fn()
    render(<SystemStatusMonitor onNavigate={onNavigate} />)
    for (const tab of ['性能', '安全', '日志', '告警']) {
      fireEvent.keyDown(screen.getByText(tab).closest('[role="tab"]')!, {
        key: 'Enter',
      })
      const panel = screen.getByRole('tabpanel')
      const buttons = Array.from(panel.querySelectorAll('button')).filter(
        (b) => !b.disabled
      )
      for (const btn of buttons) {
        fireEvent.click(btn)
      }
    }
    expect(onNavigate).toHaveBeenCalled()
  })

  it('分享按钮触发分享 toast', () => {
    render(<SystemStatusMonitor />)
    toastSpy.mockClear()
    const shareButton = screen
      .getAllByRole('button')
      .find((b) => /分享/.test(b.textContent ?? ''))
    expect(shareButton).toBeDefined()
    fireEvent.click(shareButton!)
    expect(toastSpy).toHaveBeenCalledWith(
      expect.objectContaining({ title: '分享成功' })
    )
  })
})
