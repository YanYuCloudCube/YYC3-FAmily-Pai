/**
 * file performance-monitoring-dashboard.test.tsx
 * description PerformanceMonitoringDashboard 组件测试
 */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'

import { PerformanceMonitoringDashboard } from './performance-monitoring-dashboard'

describe('PerformanceMonitoringDashboard', () => {
  it('should render without crashing', () => {
    const { container } = render(<PerformanceMonitoringDashboard />)
    expect(container).toBeDefined()
  })
})
