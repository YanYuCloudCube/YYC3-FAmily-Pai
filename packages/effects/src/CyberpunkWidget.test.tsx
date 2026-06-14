import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CyberpunkWidget, type WidgetTabConfig } from './CyberpunkWidget'

const tabs: WidgetTabConfig[] = [
  { id: 'tab1', label: 'Tab 1', icon: '📊', color: '#00f0ff', content: <div>Tab 1 Content</div> },
  { id: 'tab2', label: 'Tab 2', icon: '📈', color: '#ff00ff', content: <div>Tab 2 Content</div> },
]

describe('CyberpunkWidget', () => {
  it('renders widget with title', () => {
    render(<CyberpunkWidget title="Test Widget" tabs={tabs} />)
    expect(screen.getByText('Test Widget')).toBeTruthy()
  })

  it('renders tab labels', () => {
    render(<CyberpunkWidget title="Widget" tabs={tabs} />)
    expect(screen.getByText('Tab 1')).toBeTruthy()
    expect(screen.getByText('Tab 2')).toBeTruthy()
  })

  it('renders first tab content by default', () => {
    render(<CyberpunkWidget title="Widget" tabs={tabs} />)
    expect(screen.getByText('Tab 1 Content')).toBeTruthy()
  })

  it('switches to second tab on click', () => {
    render(<CyberpunkWidget title="Widget" tabs={tabs} />)
    fireEvent.click(screen.getByText('Tab 2'))
    expect(screen.getByText('Tab 2 Content')).toBeTruthy()
  })
})
