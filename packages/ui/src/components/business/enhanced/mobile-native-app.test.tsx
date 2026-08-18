/**
 * file mobile-native-app.test.tsx
 * description MobileNativeApp 组件测试
 */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'

import { MobileNativeApp } from './mobile-native-app'

describe('MobileNativeApp', () => {
  it('should render without crashing', () => {
    const { container } = render(<MobileNativeApp />)
    expect(container).toBeDefined()
  })
})
