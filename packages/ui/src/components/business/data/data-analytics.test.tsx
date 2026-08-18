/**
 * file data-analytics.test.tsx
 * description DataAnalytics 组件测试
 */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'

import { DataAnalytics } from './data-analytics'

describe('DataAnalytics', () => {
  it('should render without crashing', () => {
    const { container } = render(<DataAnalytics />)
    expect(container).toBeDefined()
  })
})
