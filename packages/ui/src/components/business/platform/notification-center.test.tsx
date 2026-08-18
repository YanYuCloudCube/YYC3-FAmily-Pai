/**
 * file notification-center.test.tsx
 * description notification-center 组件测试
 */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'

import { NotificationCenter } from './notification-center'

describe('notification-center', () => {
  it('should render without crashing', () => {
    const { container } = render(<NotificationCenter />)
    expect(container).toBeDefined()
  })
})
