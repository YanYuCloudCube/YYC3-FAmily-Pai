/**
 * file customer-management.test.tsx
 * description customer-management 组件测试
 */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'

import { CustomerManagement } from './customer-management'

describe('customer-management', () => {
  it('should render without crashing', () => {
    const { container } = render(<CustomerManagement />)
    expect(container).toBeDefined()
  })
})
