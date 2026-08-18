/**
 * file offline-indicator.test.tsx
 * description OfflineIndicator 组件测试
 */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'

import { OfflineIndicator } from './offline-indicator'

describe('OfflineIndicator', () => {
  it('should render without crashing', () => {
    const { container } = render(<OfflineIndicator />)
    expect(container).toBeDefined()
  })
})
