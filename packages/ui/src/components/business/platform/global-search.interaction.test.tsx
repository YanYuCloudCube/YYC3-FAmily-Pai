/**
 * file global-search.interaction.test.tsx
 * description GlobalSearch 交互测试 — Ctrl+K 唤起 / 输入过滤 / 选择关闭
 */

import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { GlobalSearch } from './global-search'

function openDialog() {
  fireEvent.keyDown(document, { key: 'k', ctrlKey: true, metaKey: true })
}

describe('GlobalSearch 交互', () => {
  it('Ctrl+K 打开搜索对话框', async () => {
    render(<GlobalSearch />)
    openDialog()
    await waitFor(() => {
      expect(
        screen.getByPlaceholderText('搜索功能、客户、任务...')
      ).toBeDefined()
    })
  })

  it('输入关键词过滤结果', async () => {
    render(<GlobalSearch />)
    openDialog()
    const input = await screen.findByPlaceholderText('搜索功能、客户、任务...')
    fireEvent.change(input, { target: { value: '客户' } })
    await waitFor(() => {
      // 输入后应出现过滤后的结果分组或空态提示
      const hasResults =
        screen.queryAllByText(/客户/).length > 0 ||
        screen.queryAllByText(/没有找到|暂无结果/).length > 0
      expect(hasResults).toBe(true)
    })
  })

  it('Esc 关闭对话框', async () => {
    render(<GlobalSearch />)
    openDialog()
    await screen.findByPlaceholderText('搜索功能、客户、任务...')
    fireEvent.keyDown(document, { key: 'Escape' })
    await waitFor(() => {
      expect(
        screen.queryByPlaceholderText('搜索功能、客户、任务...')
      ).toBeNull()
    })
  })

  it('点击外层搜索输入框打开对话框', async () => {
    render(<GlobalSearch />)
    // 触发器是 readOnly Input（placeholder 带 Ctrl+K 后缀）
    const trigger = screen.getByPlaceholderText(
      '搜索功能、客户、任务... (Ctrl+K)'
    )
    fireEvent.click(trigger)
    await waitFor(() => {
      expect(
        screen.queryByPlaceholderText('搜索功能、客户、任务...')
      ).not.toBeNull()
    })
  })

  it('选择结果项关闭对话框', async () => {
    render(<GlobalSearch />)
    openDialog()
    const input = await screen.findByPlaceholderText('搜索功能、客户、任务...')
    // 空查询展示全部默认结果项，逐个选择
    const items = await waitFor(() => {
      const options = screen
        .getAllByRole('option')
        .filter((o) => (o.textContent ?? '').trim().length > 0)
      expect(options.length).toBeGreaterThan(0)
      return options
    })
    fireEvent.click(items[0])
    await waitFor(() => {
      expect(
        screen.queryByPlaceholderText('搜索功能、客户、任务...')
      ).toBeNull()
    })
  })
})
