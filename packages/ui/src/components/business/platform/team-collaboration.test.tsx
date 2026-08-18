/**
 * file team-collaboration.test.tsx
 * description TeamCollaboration 组件测试
 */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'

import { TeamCollaboration } from './team-collaboration'

describe('TeamCollaboration', () => {
  it('should render without crashing', () => {
    const { container } = render(<TeamCollaboration />)
    expect(container).toBeDefined()
  })
})
