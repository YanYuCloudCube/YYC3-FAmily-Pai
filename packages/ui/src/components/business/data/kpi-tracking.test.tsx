/**
 * file kpi-tracking.test.tsx
 * description KPITracking 组件测试
 */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'

import { KPITracking } from './kpi-tracking'

describe('KPITracking', () => {
  it('should render without crashing', () => {
    const { container } = render(<KPITracking />)
    expect(container).toBeDefined()
  })
})
