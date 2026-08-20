/**
 * file bi-dashboard.interaction.test.tsx
 * description AdvancedBIDashboard 交互测试 — 五大分析 Tab 切换
 */

import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AdvancedBIDashboard } from './bi-dashboard'

describe('AdvancedBIDashboard 交互', () => {
  it('切换 AI洞察/数据分析/预测分析/自定义仪表板/模型管理 Tab', () => {
    render(<AdvancedBIDashboard />)
    for (const tab of ['AI洞察', '数据分析', '预测分析', '自定义仪表板', '模型管理']) {
      const trigger = screen.getByText(tab).closest('[role="tab"]')!
      fireEvent.keyDown(trigger, { key: 'Enter' })
      expect(trigger).toHaveAttribute('data-state', 'active')
    }
  })

  it('默认展示 AI 洞察面板', () => {
    render(<AdvancedBIDashboard />)
    const trigger = screen.getByText('AI洞察').closest('[role="tab"]')!
    expect(trigger).toHaveAttribute('data-state', 'active')
  })

  it('工具栏按钮可点击不崩溃', () => {
    render(<AdvancedBIDashboard />)
    const buttons = screen.getAllByRole('button')
    for (const btn of buttons.slice(0, 5)) {
      fireEvent.click(btn)
    }
    expect(document.body).toBeDefined()
  })
})
