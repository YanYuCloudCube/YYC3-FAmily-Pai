/**
 * file touch-gestures.test.tsx
 * description TouchGestures 组件测试
 */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'

import { TouchGestures } from './touch-gestures'

describe('TouchGestures', () => {
  it('should render without crashing', () => {
    const { container } = render(<TouchGestures><div>test</div></TouchGestures>)
    expect(container).toBeDefined()
  })
})
