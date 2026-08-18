/**
 * file pwa-install-prompt.test.tsx
 * description PWAInstallPrompt 组件测试
 */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'

import { PWAInstallPrompt } from './pwa-install-prompt'

describe('PWAInstallPrompt', () => {
  it('should render without crashing', () => {
    const { container } = render(<PWAInstallPrompt />)
    expect(container).toBeDefined()
  })
})
