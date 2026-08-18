/**
 * file finance-chart.test.tsx
 * description FinanceChart 组件测试
 */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'

import { FinanceChart } from './finance-chart'

describe('FinanceChart', () => {
  it('should render without crashing', () => {
    const { container } = render(<FinanceChart />)
    expect(container).toBeDefined()
  })
})
