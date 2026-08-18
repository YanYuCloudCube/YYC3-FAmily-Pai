/**
 * file quick-actions.test.tsx
 * description QuickActions 组件测试
 */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'

import { QuickActions } from './quick-actions'

describe('QuickActions', () => {
  it('should render without crashing', () => {
    const { container } = render(<QuickActions />)
    expect(container).toBeDefined()
  })
})
