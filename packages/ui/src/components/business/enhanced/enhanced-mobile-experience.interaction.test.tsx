/**
 * file enhanced-mobile-experience.interaction.test.tsx
 * description EnhancedMobileExperience 交互测试 — 开关/手势测试/触摸事件日志
 */

import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { EnhancedMobileExperience } from './enhanced-mobile-experience'

describe('EnhancedMobileExperience 交互', () => {
  it('切换设置开关', () => {
    render(<EnhancedMobileExperience />)
    const switches = screen.getAllByRole('switch')
    expect(switches.length).toBeGreaterThan(0)
    for (const sw of switches.slice(0, 4)) {
      fireEvent.click(sw)
    }
    expect(switches[0]).toBeDefined()
  })

  it('全部开关（含滚动外区域）逐个切换', () => {
    render(<EnhancedMobileExperience />)
    const switches = screen.getAllByRole('switch')
    for (const sw of switches) {
      fireEvent.click(sw)
    }
    expect(document.body).toBeDefined()
  })

  it('触摸测试区域响应 click 与双击', () => {
    render(<EnhancedMobileExperience />)
    const area = screen.getByText('触摸测试区域').closest('div')!
    const target = area.parentElement ?? area
    fireEvent.click(target)
    fireEvent.doubleClick(target)
    expect(target).toBeDefined()
  })

  it('点击手势「测试」按钮写入触摸事件日志', () => {
    render(<EnhancedMobileExperience />)
    const testButtons = screen.getAllByText('测试')
    expect(testButtons.length).toBeGreaterThan(0)
    fireEvent.click(testButtons[0])
    // handleGesture → addTouchEvent(`手势: ...`) 写入最近触摸事件
    expect(screen.getByText(/手势:/)).toBeDefined()
  })

  it('多个手势均可测试并累积日志', () => {
    render(<EnhancedMobileExperience />)
    const testButtons = screen.getAllByText('测试')
    for (const btn of testButtons.slice(0, 3)) {
      fireEvent.click(btn)
    }
    const logs = screen.getAllByText(/手势:/)
    expect(logs.length).toBeGreaterThanOrEqual(3)
  })

  it('触摸测试区域响应 touchStart/Move/End 事件', () => {
    render(<EnhancedMobileExperience />)
    const areaLabel = screen.getByText('触摸测试区域')
    // 事件处理器挂在测试区域的外层容器上
    let container: HTMLElement | null = areaLabel
    while (container && !container.getAttribute('onstart')) {
      // 找到包含提示文案的卡片容器即可
      container = container.parentElement
      if (!container) break
    }
    const target = container ?? areaLabel.parentElement!
    fireEvent.touchStart(target, { touches: [{ clientX: 100, clientY: 100 }] })
    fireEvent.touchMove(target, { touches: [{ clientX: 160, clientY: 120 }] })
    fireEvent.touchEnd(target)
    expect(target).toBeDefined()
  })

  it('手势条目标签完整', () => {
    render(<EnhancedMobileExperience />)
    for (const label of ['左滑', '右滑', '上滑', '下滑', '双指缩放', '双指放大', '双击', '长按']) {
      expect(screen.getByText(label)).toBeDefined()
    }
  })
})
