/**
 * file okr-analytics-charts.test.tsx
 * description OKRAnalyticsCharts 组件测试
 */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'

import { OKRAnalyticsCharts } from './okr-analytics-charts'

describe('OKRAnalyticsCharts', () => {
  it('should render without crashing', () => {
    const { container } = render(<OKRAnalyticsCharts />)
    expect(container).toBeDefined()
  })
})
