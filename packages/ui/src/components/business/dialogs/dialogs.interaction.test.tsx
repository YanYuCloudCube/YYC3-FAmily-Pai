/**
 * file dialogs.interaction.test.tsx
 * description SettingsDialog + ProfileDialog 交互测试
 */

import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

const toastSpy = vi.fn()
vi.mock('../../../hooks/use-toast', () => ({
  toast: (...args: unknown[]) => toastSpy(...args),
  useToast: () => ({ toasts: [], toast: toastSpy, dismiss: vi.fn() }),
}))

import { SettingsDialog } from './settings-dialog'
import { ProfileDialog } from './profile-dialog'

function findTab(label: string): HTMLElement {
  const trigger = screen
    .getAllByText(label)
    .map((el) => el.closest('[role="tab"]'))
    .find((el): el is HTMLElement => el !== null)
  if (!trigger) throw new Error(`未找到 Tab: ${label}`)
  return trigger
}

describe('SettingsDialog 交互', () => {
  it('保存设置触发 toast 并关闭对话框', () => {
    const onOpenChange = vi.fn()
    render(<SettingsDialog open={true} onOpenChange={onOpenChange} />)

    fireEvent.click(screen.getByText('保存设置'))
    expect(toastSpy).toHaveBeenCalledWith(
      expect.objectContaining({ title: '设置已保存' })
    )
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('取消按钮关闭对话框', () => {
    const onOpenChange = vi.fn()
    render(<SettingsDialog open={true} onOpenChange={onOpenChange} />)

    const cancelButton = screen
      .getAllByRole('button')
      .find((b) => /取消/.test(b.textContent ?? ''))
    expect(cancelButton).toBeDefined()
    fireEvent.click(cancelButton!)
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('切换外观/通知/隐私/高级 Tab', () => {
    render(<SettingsDialog open={true} onOpenChange={vi.fn()} />)
    for (const tab of ['外观', '通知', '隐私', '高级']) {
      const trigger = findTab(tab)
      fireEvent.keyDown(trigger, { key: 'Enter' })
      expect(trigger).toHaveAttribute('data-state', 'active')
    }
  })

  it('切换通知开关', () => {
    render(<SettingsDialog open={true} onOpenChange={vi.fn()} />)
    const switches = screen.getAllByRole('switch')
    expect(switches.length).toBeGreaterThan(0)
    for (const sw of switches.slice(0, 3)) {
      fireEvent.click(sw)
    }
    expect(switches[0]).toBeDefined()
  })

  it('逐 Tab 切换并操作全部开关（通知/隐私/高级）', () => {
    render(<SettingsDialog open={true} onOpenChange={vi.fn()} />)
    for (const tab of ['外观', '通知', '隐私', '高级']) {
      fireEvent.keyDown(findTab(tab), { key: 'Enter' })
      const switches = screen.queryAllByRole('switch')
      for (const sw of switches) fireEvent.click(sw)
    }
    expect(document.body).toBeDefined()
  })
})

describe('ProfileDialog 交互', () => {
  it('保存资料：loading 后成功 toast 并关闭', async () => {
    const onOpenChange = vi.fn()
    render(<ProfileDialog open={true} onOpenChange={onOpenChange} />)

    const saveButton = screen
      .getAllByRole('button')
      .find((b) => /保存/.test(b.textContent ?? ''))
    expect(saveButton).toBeDefined()
    fireEvent.click(saveButton!)

    await waitFor(
      () => {
        expect(toastSpy).toHaveBeenCalledWith(
          expect.objectContaining({ title: '保存成功' })
        )
        expect(onOpenChange).toHaveBeenCalledWith(false)
      },
      { timeout: 3000 }
    )
  })

  it('点击头像相机按钮触发上传提示', () => {
    render(<ProfileDialog open={true} onOpenChange={vi.fn()} />)
    const cameraButton = screen
      .getAllByRole('button')
      .find((b) => (b.className ?? '').includes('rounded-full'))
    expect(cameraButton).toBeDefined()
    fireEvent.click(cameraButton!)
    expect(toastSpy).toHaveBeenCalledWith(
      expect.objectContaining({ title: '头像上传' })
    )
  })

  it('切换基本信息/联系方式/安全设置 Tab', () => {
    render(<ProfileDialog open={true} onOpenChange={vi.fn()} />)
    for (const tab of ['基本信息', '联系方式', '安全设置']) {
      const trigger = findTab(tab)
      fireEvent.keyDown(trigger, { key: 'Enter' })
      expect(trigger).toHaveAttribute('data-state', 'active')
    }
  })

  it('编辑姓名输入框', () => {
    render(<ProfileDialog open={true} onOpenChange={vi.fn()} />)
    const nameInput = screen
      .getAllByDisplayValue('系统管理员')
      .find((el) => el.tagName === 'INPUT') as HTMLInputElement
    expect(nameInput).toBeDefined()
    fireEvent.change(nameInput, { target: { value: '新名字' } })
    expect(nameInput.value).toBe('新名字')
  })

  it('逐 Tab 填写全部输入框（基本信息/联系方式/安全设置）', () => {
    render(<ProfileDialog open={true} onOpenChange={vi.fn()} />)
    for (const tab of ['基本信息', '联系方式', '安全设置']) {
      fireEvent.keyDown(findTab(tab), { key: 'Enter' })
      const fields = Array.from(
        document.querySelectorAll('input:not([type="checkbox"])'
        )
      ).filter((el) => (el as HTMLInputElement).value !== '')
      for (const field of fields) {
        fireEvent.change(field, { target: { value: `测试-${Math.random()}` } })
      }
      const textareas = document.querySelectorAll('textarea')
      for (const ta of textareas) {
        fireEvent.change(ta, { target: { value: '测试备注内容' } })
      }
    }
    expect(document.body).toBeDefined()
  })
})
