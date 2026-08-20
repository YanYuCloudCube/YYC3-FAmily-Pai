/**
 * file touch-gestures.interaction.test.tsx
 * description TouchGestures 交互测试 — 左右滑 / 下拉刷新
 */

import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { TouchGestures } from './touch-gestures'

function getWrapper(container: HTMLElement): HTMLElement {
  const wrapper = container.firstElementChild as HTMLElement
  expect(wrapper).not.toBeNull()
  return wrapper
}

describe('TouchGestures 交互', () => {
  it('左滑触发 onSwipeLeft（超过 swipeThreshold）', () => {
    const onSwipeLeft = vi.fn()
    const { container } = render(
      <TouchGestures onSwipeLeft={onSwipeLeft} swipeThreshold={100}>
        <div>内容</div>
      </TouchGestures>
    )
    const wrapper = getWrapper(container)
    fireEvent.touchStart(wrapper, { touches: [{ clientX: 300, clientY: 100 }] })
    fireEvent.touchMove(wrapper, { touches: [{ clientX: 150, clientY: 100 }] })
    fireEvent.touchEnd(wrapper)
    expect(onSwipeLeft).toHaveBeenCalled()
  })

  it('右滑触发 onSwipeRight', () => {
    const onSwipeRight = vi.fn()
    const { container } = render(
      <TouchGestures onSwipeRight={onSwipeRight} swipeThreshold={100}>
        <div>内容</div>
      </TouchGestures>
    )
    const wrapper = getWrapper(container)
    fireEvent.touchStart(wrapper, { touches: [{ clientX: 100, clientY: 100 }] })
    fireEvent.touchMove(wrapper, { touches: [{ clientX: 260, clientY: 100 }] })
    fireEvent.touchEnd(wrapper)
    expect(onSwipeRight).toHaveBeenCalled()
  })

  it('未达阈值不触发滑动回调', () => {
    const onSwipeLeft = vi.fn()
    const { container } = render(
      <TouchGestures onSwipeLeft={onSwipeLeft} swipeThreshold={100}>
        <div>内容</div>
      </TouchGestures>
    )
    const wrapper = getWrapper(container)
    fireEvent.touchStart(wrapper, { touches: [{ clientX: 300, clientY: 100 }] })
    fireEvent.touchMove(wrapper, { touches: [{ clientX: 250, clientY: 100 }] })
    fireEvent.touchEnd(wrapper)
    expect(onSwipeLeft).not.toHaveBeenCalled()
  })

  it('下拉刷新触发 onRefresh（阻尼 0.5，需超过阈值）', async () => {
    const onRefresh = vi.fn(async () => {})
    const { container } = render(
      <TouchGestures onRefresh={onRefresh} refreshThreshold={80}>
        <div>内容</div>
      </TouchGestures>
    )
    const wrapper = getWrapper(container)
    // deltaY=220 → distance=min(110, 120)=110 ≥ 阈值 80
    fireEvent.touchStart(wrapper, { touches: [{ clientX: 100, clientY: 100 }] })
    fireEvent.touchMove(wrapper, { touches: [{ clientX: 100, clientY: 320 }] })
    fireEvent.touchEnd(wrapper)
    await new Promise((r) => setTimeout(r, 0))
    expect(onRefresh).toHaveBeenCalled()
  })
})
