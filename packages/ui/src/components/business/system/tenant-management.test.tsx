/**
 * file tenant-management.test.tsx
 * description TenantManagement 组件测试
 */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'

import { TenantManagement } from './tenant-management'

describe('TenantManagement', () => {
  it('should render without crashing', () => {
    const { container } = render(<TenantManagement />)
    expect(container).toBeDefined()
  })
})
