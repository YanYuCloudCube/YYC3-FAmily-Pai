/**
 * file okr-management.test.tsx
 * description OKRManagement 组件测试
 */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'

import { OKRManagement } from './okr-management'

describe('OKRManagement', () => {
  it('should render without crashing', () => {
    const { container } = render(<OKRManagement />)
    expect(container).toBeDefined()
  })
})
