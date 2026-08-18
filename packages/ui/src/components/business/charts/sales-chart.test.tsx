/**
 * file sales-chart.test.tsx
 * description SalesChart 组件测试
 */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'

import { SalesChart } from './sales-chart'

describe('SalesChart', () => {
  it('should render without crashing', () => {
    const { container } = render(<SalesChart />)
    expect(container).toBeDefined()
  })
})
