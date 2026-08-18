/**
 * file finance-module.test.tsx
 * description finance-module 组件测试
 */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'

import { FinanceModule } from './finance-module'

describe('finance-module', () => {
  it('should render without crashing', () => {
    const { container } = render(<FinanceModule />)
    expect(container).toBeDefined()
  })
})
