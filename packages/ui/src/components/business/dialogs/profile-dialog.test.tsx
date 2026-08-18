/**
 * file profile-dialog.test.tsx
 * description ProfileDialog 组件测试
 */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'

import { ProfileDialog } from './profile-dialog'

describe('ProfileDialog', () => {
  it('should render without crashing', () => {
    const { container } = render(<ProfileDialog open={false} onOpenChange={() => {}} />)
    expect(container).toBeDefined()
  })
})
