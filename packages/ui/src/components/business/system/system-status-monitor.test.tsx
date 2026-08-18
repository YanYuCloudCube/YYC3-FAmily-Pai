/**
 * file system-status-monitor.test.tsx
 * description SystemStatusMonitor 组件测试
 */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'

import { SystemStatusMonitor } from './system-status-monitor'

describe('SystemStatusMonitor', () => {
  it('should render without crashing', () => {
    const { container } = render(<SystemStatusMonitor />)
    expect(container).toBeDefined()
  })
})
