/**
 * file global-search.test.tsx
 * description global-search 组件测试
 */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'

import { GlobalSearch } from './global-search'

describe('global-search', () => {
  it('should render without crashing', () => {
    const { container } = render(<GlobalSearch />)
    expect(container).toBeDefined()
  })
})
