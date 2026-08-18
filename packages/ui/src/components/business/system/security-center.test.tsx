/**
 * file security-center.test.tsx
 * description SecurityCenter 组件测试
 */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'

import { SecurityCenter } from './security-center'

describe('SecurityCenter', () => {
  it('should render without crashing', () => {
    const { container } = render(<SecurityCenter />)
    expect(container).toBeDefined()
  })
})
