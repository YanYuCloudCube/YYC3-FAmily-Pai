/**
 * file advanced-timer.test.tsx
 * description AdvancedTimer 组件测试
 */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'

import { AdvancedTimer } from './advanced-timer'

describe('AdvancedTimer', () => {
  it('should render without crashing', () => {
    const { container } = render(<AdvancedTimer />)
    expect(container).toBeDefined()
  })
})
