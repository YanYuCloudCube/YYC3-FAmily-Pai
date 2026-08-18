/**
 * file task-management.test.tsx
 * description task-management 组件测试
 */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'

import { TaskManagement } from './task-management'

describe('task-management', () => {
  it('should render without crashing', () => {
    const { container } = render(<TaskManagement />)
    expect(container).toBeDefined()
  })
})
