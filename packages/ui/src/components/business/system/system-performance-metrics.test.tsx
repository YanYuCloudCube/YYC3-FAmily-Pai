/**
 * file system-performance-metrics.test.tsx
 * description SystemPerformanceMetrics 组件测试
 */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'

import { SystemPerformanceMetrics } from './system-performance-metrics'

describe('SystemPerformanceMetrics', () => {
  it('should render without crashing', () => {
    const { container } = render(<SystemPerformanceMetrics />)
    expect(container).toBeDefined()
  })
})
