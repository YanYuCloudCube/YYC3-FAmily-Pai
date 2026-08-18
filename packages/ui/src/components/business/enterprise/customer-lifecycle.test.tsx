/**
 * file customer-lifecycle.test.tsx
 * description CustomerLifecycle 组件测试
 */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'

import { CustomerLifecycle } from './customer-lifecycle'

describe('CustomerLifecycle', () => {
  it('should render without crashing', () => {
    const { container } = render(<CustomerLifecycle />)
    expect(container).toBeDefined()
  })
})
