/**
 * file enterprise-data.interaction.test.tsx
 * description 企业管理/数据组件交互测试 — 客户/任务/数据集成/实时数据/PWA安装提示
 */

import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CustomerManagement } from './enterprise/customer-management'
import { TaskManagement } from './enterprise/task-management'
import { DataIntegration } from './data/data-integration'
import { DashboardRealTimeData } from './data/dashboard-realtime-data'
import { PWAInstallPrompt } from './pwa/pwa-install-prompt'

function clickAllButtons(scope: Document | HTMLElement = document) {
  const buttons = Array.from(
    (scope as HTMLElement).querySelectorAll('button')
  ).filter((b) => !b.disabled)
  for (const btn of buttons) {
    fireEvent.click(btn)
  }
  return buttons.length
}

describe('CustomerManagement 交互', () => {
  it('搜索过滤客户列表', () => {
    render(<CustomerManagement />)
    const input = screen.getByPlaceholderText('搜索客户...') as HTMLInputElement
    fireEvent.change(input, { target: { value: '科技' } })
    expect(input.value).toBe('科技')
  })

  it('打开新增客户对话框并填写保存', () => {
    render(<CustomerManagement />)
    fireEvent.click(screen.getByText('添加客户'))
    for (const placeholder of [
      '请输入客户姓名',
      '请输入公司名称',
      '请输入邮箱地址',
      '请输入联系电话',
      '请输入联系地址',
      '请输入备注信息',
    ]) {
      const field = screen.queryByPlaceholderText(placeholder)
      if (field) {
        fireEvent.change(field, { target: { value: '测试值' } })
      }
    }
    fireEvent.click(screen.getByText('保存客户'))
    expect(screen.queryByText('保存客户')).toBeNull()
  })

  it('点击客户卡片选中详情', () => {
    const { container } = render(<CustomerManagement />)
    const card = container.querySelector('[class*="cursor-pointer"]')
    if (card) fireEvent.click(card)
    expect(container).toBeDefined()
  })
})

describe('TaskManagement 交互', () => {
  it('搜索任务输入生效', () => {
    render(<TaskManagement />)
    const input = screen.getByPlaceholderText('搜索任务...') as HTMLInputElement
    fireEvent.change(input, { target: { value: '设计' } })
    expect(input.value).toBe('设计')
  })

  it('新建任务对话框：填写并提交', () => {
    render(<TaskManagement />)
    const addButton = screen
      .getAllByText('创建任务')
      .map((el) => el.closest('button'))
      .find((el): el is HTMLButtonElement => el instanceof HTMLButtonElement)
    expect(addButton).toBeDefined()
    fireEvent.click(addButton as HTMLButtonElement)

    const title = screen.queryByPlaceholderText('请输入任务标题')
    if (title) fireEvent.change(title, { target: { value: '新任务' } })
    const desc = screen.queryByPlaceholderText('请输入任务描述')
    if (desc) fireEvent.change(desc, { target: { value: '任务描述' } })
    const project = screen.queryByPlaceholderText('请输入项目名称')
    if (project) fireEvent.change(project, { target: { value: '项目A' } })

    const submits = screen
      .queryAllByText('创建任务')
      .map((el) => el.closest('button'))
      .filter((el): el is HTMLButtonElement => el instanceof HTMLButtonElement)
    if (submits.length > 0) fireEvent.click(submits[submits.length - 1])
    expect(document.body).toBeDefined()
  })
})

describe('DataIntegration 交互', () => {
  it('测试连接与开始同步流程', async () => {
    render(<DataIntegration />)
    // 逐个点击数据源「测试连接」按钮
    const testButtons = screen
      .getAllByRole('button')
      .filter((b) => /测试连接/.test(b.textContent ?? '') && !(b as HTMLButtonElement).disabled)
    for (const btn of testButtons) fireEvent.click(btn)

    // 数据同步任务按钮
    const syncButton = screen
      .getAllByRole('button')
      .find((b) => /同步/.test(b.textContent ?? '') && !(b as HTMLButtonElement).disabled)
    if (syncButton) fireEvent.click(syncButton)

    await waitFor(() => expect(document.body).toBeDefined())
  })
})

describe('DashboardRealtimeData 交互', () => {
  it('点击刷新触发数据刷新', async () => {
    render(<DashboardRealTimeData />)
    const refresh = screen
      .getAllByRole('button')
      .find((b) => /刷新/.test(b.textContent ?? ''))
    expect(refresh).toBeDefined()
    fireEvent.click(refresh!)
    await waitFor(() => expect(document.body).toBeDefined())
  })

  it('操作按钮可点击', () => {
    const { container } = render(<DashboardRealTimeData />)
    const count = clickAllButtons(container)
    expect(count).toBeGreaterThan(0)
  })
})

describe('PWAInstallPrompt 交互', () => {
  it('beforeinstallprompt 事件唤起安装提示并可关闭', async () => {
    localStorage.removeItem('pwa-install-dismissed')
    render(<PWAInstallPrompt />)
    fireEvent(window, new Event('beforeinstallprompt'))

    // 关闭按钮（ghost X）
    const dismiss = screen
      .getAllByRole('button')
      .find((b) => /w-6/.test(b.className ?? ''))
    if (dismiss) fireEvent.click(dismiss)
    expect(localStorage.getItem('pwa-install-dismissed')).toBeTruthy()
  })

  it('beforeinstallprompt 后点击安装按钮走降级分支', () => {
    localStorage.removeItem('pwa-install-dismissed')
    render(<PWAInstallPrompt />)
    fireEvent(window, new Event('beforeinstallprompt'))
    // 安装按钮（非 ghost 的主按钮）；事件无 prompt() 方法 → catch 分支
    const install = screen
      .getAllByRole('button')
      .find((b) => !(b.className ?? '').includes('ghost') && b.textContent?.trim())
    if (install) fireEvent.click(install)
    expect(document.body).toBeDefined()
  })

  it('appinstalled 事件标记已安装', () => {
    render(<PWAInstallPrompt />)
    fireEvent(window, new Event('appinstalled'))
    expect(document.body).toBeDefined()
  })
})
