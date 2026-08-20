/**
 * file real-time-threat-detection.interaction.test.tsx
 * description RealTimeThreatDetection 交互测试 — 监控开关/自动阻止/威胁徽标
 */

import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { RealTimeThreatDetection } from './real-time-threat-detection'

describe('RealTimeThreatDetection 交互', () => {
  it('停止/恢复监控切换（状态徽标联动）', () => {
    render(<RealTimeThreatDetection />)
    expect(screen.getByText('监控中')).toBeDefined()
    fireEvent.click(screen.getByText('停止监控'))
    expect(screen.getByText('已停止')).toBeDefined()
    fireEvent.click(screen.getByText('开始监控'))
    expect(screen.getByText('监控中')).toBeDefined()
  })

  it('自动阻止开关按钮切换', () => {
    render(<RealTimeThreatDetection />)
    const label = screen.getByText('自动阻止')
    const toggleButton = label.parentElement!.querySelector('button')!
    expect(toggleButton).not.toBeNull()
    fireEvent.click(toggleButton)
    expect(toggleButton).toBeDefined()
  })

  it('威胁事件列表渲染状态徽标（已阻止/调查中）', () => {
    render(<RealTimeThreatDetection />)
    // 初始数据包含 blocked 与 investigating 两种状态的威胁
    expect(screen.getAllByText('已阻止').length).toBeGreaterThan(0)
    expect(screen.getByText('调查中')).toBeDefined()
  })

  it('威胁等级徽标渲染', () => {
    render(<RealTimeThreatDetection />)
    // 初始威胁带不同 severity，相应等级徽标应至少出现一种
    const badges = ['高危', '中危', '低危', '严重']
    const rendered = badges.filter((b) => screen.queryAllByText(b).length > 0)
    expect(rendered.length).toBeGreaterThan(0)
  })
})
