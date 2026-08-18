/**
 * file real-time-threat-detection.test.tsx
 * description RealTimeThreatDetection 组件测试
 */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'

import { RealTimeThreatDetection } from './real-time-threat-detection'

describe('RealTimeThreatDetection', () => {
  it('should render without crashing', () => {
    const { container } = render(<RealTimeThreatDetection />)
    expect(container).toBeDefined()
  })
})
