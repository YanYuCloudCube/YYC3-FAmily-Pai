/**
 * file design-system.test.ts
 * description design-system 纯函数单元测试 — 优先级样式 / 货币与日期格式化
 */

import { describe, expect, it } from 'vitest'
import {
  formatDate,
  formatCurrency,
  formatDateTime,
  getPriorityStyle,
} from './design-system'

describe('getPriorityStyle', () => {
  it('已知优先级返回配置样式', () => {
    for (const priority of ['high', 'medium', 'low']) {
      const style = getPriorityStyle(priority)
      expect(style.label.length).toBeGreaterThan(0)
      expect(style.color.length).toBeGreaterThan(0)
    }
  })

  it('未知优先级返回兜底样式', () => {
    const style = getPriorityStyle('unknown-priority')
    expect(style.label).toBe('unknown-priority')
    expect(style.color).toBe('bg-slate-100 text-slate-800')
  })
})

describe('formatCurrency', () => {
  it('格式化整数金额为人民币', () => {
    const result = formatCurrency(12345)
    expect(result).toContain('12,345')
    expect(result).toMatch(/¥|CN¥/)
  })

  it('零与边界值', () => {
    expect(formatCurrency(0)).toMatch(/0/)
    expect(formatCurrency(999999999)).toContain('999,999,999')
  })
})

describe('formatDate', () => {
  it('格式化日期字符串', () => {
    const result = formatDate('2026-08-19')
    expect(result).toContain('2026')
    expect(result).toContain('08')
    expect(result).toContain('19')
  })

  it('格式化 Date 对象', () => {
    const result = formatDate(new Date(2026, 0, 5))
    expect(result).toContain('2026')
  })
})

describe('formatDateTime', () => {
  it('包含日期与时分', () => {
    const result = formatDateTime(new Date(2026, 7, 19, 14, 30))
    expect(result).toContain('2026')
    expect(result).toContain('14')
    expect(result).toContain('30')
  })
})
