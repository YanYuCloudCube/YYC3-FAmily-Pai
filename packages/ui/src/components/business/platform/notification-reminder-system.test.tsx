/**
 * file notification-reminder-system.test.tsx
 * description NotificationReminderSystem 组件测试
 */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'

import { NotificationReminderSystem } from './notification-reminder-system'

describe('NotificationReminderSystem', () => {
  it('should render without crashing', () => {
    const { container } = render(<NotificationReminderSystem />)
    expect(container).toBeDefined()
  })
})
