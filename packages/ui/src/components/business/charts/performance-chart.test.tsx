/**
 * file performance-chart.test.tsx
 * description PerformanceChart 组件测试
 */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'

import { PerformanceChart } from './performance-chart'

describe('PerformanceChart', () => {
  it('should render without crashing', () => {
    const { container } = render(<PerformanceChart />)
    expect(container).toBeDefined()
  })
})
