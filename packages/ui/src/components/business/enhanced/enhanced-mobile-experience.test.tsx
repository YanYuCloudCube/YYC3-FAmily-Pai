/**
 * file enhanced-mobile-experience.test.tsx
 * description EnhancedMobileExperience 组件测试
 */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'

import { EnhancedMobileExperience } from './enhanced-mobile-experience'

describe('EnhancedMobileExperience', () => {
  it('should render without crashing', () => {
    const { container } = render(<EnhancedMobileExperience />)
    expect(container).toBeDefined()
  })
})
