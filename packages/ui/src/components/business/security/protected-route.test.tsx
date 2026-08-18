/**
 * file protected-route.test.tsx
 * description ProtectedRoute 组件测试
 */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'

import { ProtectedRoute } from './protected-route'

describe('ProtectedRoute', () => {
  it('should render without crashing', () => {
    const { container } = render(<ProtectedRoute><div>test</div></ProtectedRoute>)
    expect(container).toBeDefined()
  })
})
