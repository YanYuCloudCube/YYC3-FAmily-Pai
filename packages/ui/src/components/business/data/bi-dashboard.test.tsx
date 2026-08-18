/**
 * file bi-dashboard.test.tsx
 * description AdvancedBIDashboard 组件测试
 */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'

import { AdvancedBIDashboard } from './bi-dashboard'

describe('AdvancedBIDashboard', () => {
  it('should render without crashing', () => {
    const { container } = render(<AdvancedBIDashboard />)
    expect(container).toBeDefined()
  })
})
