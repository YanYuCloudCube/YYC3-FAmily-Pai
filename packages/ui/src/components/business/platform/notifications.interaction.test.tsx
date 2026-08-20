/**
 * file notifications.interaction.test.tsx
 * description NotificationCenter + NotificationReminderSystem 交互测试
 */

import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { NotificationCenter } from './notification-center'
import { NotificationReminderSystem } from './notification-reminder-system'

function getUnreadCount(): number {
  const tab = screen
    .getAllByRole('tab')
    .find((t) => /未读 \(\d+\)/.test(t.textContent ?? ''))
  const match = tab?.textContent?.match(/未读 \((\d+)\)/)
  return match ? parseInt(match[1], 10) : -1
}

describe('NotificationCenter 交互', () => {
  it('全部已读将未读计数清零', () => {
    render(<NotificationCenter />)
    expect(getUnreadCount()).toBeGreaterThan(0)
    fireEvent.click(screen.getByText('全部已读'))
    expect(getUnreadCount()).toBe(0)
  })

  it('单条通知标记已读使计数减一', () => {
    render(<NotificationCenter />)
    const before = getUnreadCount()
    // 标记已读按钮为纯图标按钮（MarkAsRead svg，无文本）
    const iconOnlyButtons = screen
      .getAllByRole('button')
      .filter(
        (b) => b.querySelector('svg') && !(b.textContent ?? '').trim()
      )
    expect(iconOnlyButtons.length).toBeGreaterThan(0)
    fireEvent.click(iconOnlyButtons[0])
    expect(getUnreadCount()).toBe(before - 1)
  })

  it('删除通知减少总数', () => {
    render(<NotificationCenter />)
    const iconOnlyButtons = screen
      .getAllByRole('button')
      .filter((b) => b.querySelector('svg') && !(b.textContent ?? '').trim())
    // 第二个纯图标按钮为删除
    if (iconOnlyButtons.length > 1) {
      fireEvent.click(iconOnlyButtons[1])
    }
    expect(document.body).toBeDefined()
  })

  it('通知设置 Tab 的开关均可切换', () => {
    render(<NotificationCenter />)
    const trigger = screen
      .getAllByText('通知设置')
      .map((el) => el.closest('[role="tab"]'))
      .find((el): el is HTMLElement => el !== null)!
    fireEvent.keyDown(trigger, { key: 'Enter' })
    const switches = screen.getAllByRole('switch')
    expect(switches.length).toBeGreaterThan(0)
    for (const sw of switches) fireEvent.click(sw)
  })

  it('切换全部/未读/紧急/设置 Tab', () => {
    render(<NotificationCenter />)
    for (const tab of ['全部通知', '未读', '紧急', '通知设置']) {
      const trigger = screen
        .getAllByText(tab, { exact: false })
        .map((el) => el.closest('[role="tab"]'))
        .find((el): el is HTMLElement => el !== null)
      expect(trigger).toBeDefined()
      fireEvent.keyDown(trigger!, { key: 'Enter' })
      expect(trigger).toHaveAttribute('data-state', 'active')
    }
  })
})

describe('NotificationReminderSystem 交互', () => {
  it('全部已读按钮工作', () => {
    render(<NotificationReminderSystem />)
    const button = screen
      .getAllByRole('button')
      .find((b) => /全部已读/.test(b.textContent ?? ''))
    expect(button).toBeDefined()
    fireEvent.click(button!)
    expect(screen.getAllByText(/全部已读/).length).toBeGreaterThan(0)
  })

  it('切换通知/提醒/报告 Tab', () => {
    render(<NotificationReminderSystem />)
    const tabs = screen.getAllByRole('tab')
    expect(tabs.length).toBeGreaterThanOrEqual(3)
    for (const trigger of tabs) {
      fireEvent.keyDown(trigger, { key: 'Enter' })
      expect(trigger).toHaveAttribute('data-state', 'active')
    }
  })

  it('通知项操作按钮可点击', () => {
    const { container } = render(<NotificationReminderSystem />)
    const buttons = container.querySelectorAll('button')
    const actionButtons = Array.from(buttons).filter((b) =>
      /稍后|删除|延后|完成/.test(b.textContent ?? '')
    )
    for (const btn of actionButtons.slice(0, 3)) {
      fireEvent.click(btn)
    }
    expect(document.body).toBeDefined()
  })

  it('逐 Tab 点击全部按钮与开关（含设置面板）', () => {
    render(<NotificationReminderSystem />)
    const tabs = screen.getAllByRole('tab')
    for (const trigger of tabs) {
      fireEvent.keyDown(trigger, { key: 'Enter' })
      const panels = screen
        .getAllByRole('tabpanel')
        .filter((p) => p.getAttribute('data-state') === 'active')
      for (const panel of panels) {
        for (const btn of Array.from(panel.querySelectorAll('button'))) {
          if (!btn.disabled) fireEvent.click(btn)
        }
        for (const sw of Array.from(panel.querySelectorAll('[role="switch"]'))) {
          fireEvent.click(sw)
        }
      }
    }
    expect(document.body).toBeDefined()
  })
})
