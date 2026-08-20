/**
 * file advanced-timer.interaction.test.tsx
 * description AdvancedTimer 交互测试 — 启动/暂停/继续/停止
 */

import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AdvancedTimer } from './advanced-timer'

describe('AdvancedTimer 交互', () => {
  it('启动任务 → 暂停 → 继续 → 停止', () => {
    render(<AdvancedTimer />)

    // 初始为选择任务占位
    expect(screen.getByText('选择任务开始计时')).toBeDefined()
    const startButton = screen.getByText('开始计时').closest('button')
    if (!startButton) {
      // 按钮文案为图标 + 文字组合，退化到含 startTimer 的主按钮
      const btn = screen
        .getAllByRole('button')
        .find((b) => /开始|启动/.test(b.textContent ?? ''))
      expect(btn).toBeDefined()
      fireEvent.click(btn!)
    } else {
      fireEvent.click(startButton)
    }

    // 运行态：显示计时与 暂停/停止 控件
    expect(screen.getByText('暂停')).toBeDefined()
    expect(screen.getByText('停止')).toBeDefined()

    // 暂停
    fireEvent.click(screen.getByText('暂停').closest('button')!)
    expect(screen.getByText('继续')).toBeDefined()

    // 继续
    fireEvent.click(screen.getByText('继续').closest('button')!)
    expect(screen.getByText('暂停')).toBeDefined()

    // 停止 → 回到选择任务占位
    fireEvent.click(screen.getByText('停止').closest('button')!)
    expect(screen.getByText('选择任务开始计时')).toBeDefined()
  })
})
