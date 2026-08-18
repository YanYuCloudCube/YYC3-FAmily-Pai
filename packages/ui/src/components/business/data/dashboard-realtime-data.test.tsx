/**
 * file dashboard-realtime-data.test.tsx
 * description dashboard-realtime-data 组件测试
 */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'

import { DashboardRealTimeData } from './dashboard-realtime-data'

describe('DashboardRealTimeData', () => {
  it('should render without crashing', () => {
    const { container } = render(<DashboardRealTimeData />)
    expect(container).toBeDefined()
  })
})
