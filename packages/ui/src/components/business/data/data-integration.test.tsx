/**
 * file data-integration.test.tsx
 * description DataIntegration 组件测试
 */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'

import { DataIntegration } from './data-integration'

describe('DataIntegration', () => {
  it('should render without crashing', () => {
    const { container } = render(<DataIntegration />)
    expect(container).toBeDefined()
  })
})
