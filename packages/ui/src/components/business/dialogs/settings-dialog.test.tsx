/**
 * file settings-dialog.test.tsx
 * description SettingsDialog 组件测试
 */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'

import { SettingsDialog } from './settings-dialog'

describe('SettingsDialog', () => {
  it('should render without crashing', () => {
    const { container } = render(<SettingsDialog open={false} onOpenChange={() => {}} />)
    expect(container).toBeDefined()
  })
})
