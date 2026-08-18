/**
 * file advanced-bi-reports.test.tsx
 * description AdvancedBIReports 组件测试
 */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'

import { AdvancedBIReports } from './advanced-bi-reports'

describe('AdvancedBIReports', () => {
  it('should render without crashing', () => {
    const { container } = render(<AdvancedBIReports />)
    expect(container).toBeDefined()
  })
})
