/**
 * file customer-satisfaction.test.tsx
 * description CustomerSatisfaction 组件测试
 */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'

import { CustomerSatisfaction } from './customer-satisfaction'

describe('CustomerSatisfaction', () => {
  it('should render without crashing', () => {
    const { container } = render(<CustomerSatisfaction />)
    expect(container).toBeDefined()
  })
})
