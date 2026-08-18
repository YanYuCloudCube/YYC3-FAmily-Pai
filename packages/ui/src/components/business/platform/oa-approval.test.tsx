/**
 * file oa-approval.test.tsx
 * description OAApproval 组件测试
 */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'

import { OAApproval } from './oa-approval'

describe('OAApproval', () => {
  it('should render without crashing', () => {
    const { container } = render(<OAApproval />)
    expect(container).toBeDefined()
  })
})
