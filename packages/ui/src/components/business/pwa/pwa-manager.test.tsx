/**
 * file pwa-manager.test.tsx
 * description PWAManager 组件测试
 */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'

import { PWAManager } from './pwa-manager'

describe('PWAManager', () => {
  it('should render without crashing', () => {
    const { container } = render(<PWAManager />)
    expect(container).toBeDefined()
  })
})
