/**
 * file permission-management.test.tsx
 * description permission-management 组件测试
 */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'

import { PermissionManagement } from './permission-management'

describe('permission-management', () => {
  it('should render without crashing', () => {
    const { container } = render(<PermissionManagement />)
    expect(container).toBeDefined()
  })
})
