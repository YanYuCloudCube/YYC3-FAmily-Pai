import {
  toAppearAfter,
  toAppearBefore,
  toBeChecked,
  toBeDisabled,
  toBeEmpty,
  toBeEmptyDOMElement,
  toBeEnabled,
  toBeInTheDocument,
  toBeInvalid,
  toBePartiallyChecked,
  toBePartiallyPressed,
  toBePressed,
  toBeRequired,
  toBeValid,
  toBeVisible,
  toContainElement,
  toContainHTML,
  toHaveAccessibleDescription,
  toHaveAccessibleErrorMessage,
  toHaveAccessibleName,
  toHaveAttribute,
  toHaveClass,
  toHaveDescription,
  toHaveDisplayValue,
  toHaveErrorMessage,
  toHaveFocus,
  toHaveFormValues,
  toHaveRole,
  toHaveSelection,
  toHaveStyle,
  toHaveTextContent,
  toHaveValue,
} from '@testing-library/jest-dom/matchers'
import { expect } from 'vitest'

expect.extend({
  toBeInTheDocument,
  toBeVisible,
  toBeDisabled,
  toBeEnabled,
  toBeChecked,
  toBeEmpty,
  toBeEmptyDOMElement,
  toBeInvalid,
  toBeRequired,
  toBeValid,
  toBePartiallyChecked,
  toHaveAttribute,
  toHaveClass,
  toHaveStyle,
  toHaveFocus,
  toHaveValue,
  toHaveDisplayValue,
  toHaveTextContent,
  toContainElement,
  toContainHTML,
  toHaveAccessibleDescription,
  toHaveAccessibleName,
  toHaveAccessibleErrorMessage,
  toHaveRole,
  toHaveFormValues,
  toHaveDescription,
  toHaveErrorMessage,
  toHaveSelection,
  toBePartiallyPressed,
  toBePressed,
  toAppearAfter,
  toAppearBefore,
})

class MockIntersectionObserver {
  observe() { }
  unobserve() { }
  disconnect() { }
}
Object.defineProperty(globalThis, 'IntersectionObserver', {
  value: MockIntersectionObserver,
  writable: true,
})

class MockResizeObserver {
  observe() { }
  unobserve() { }
  disconnect() { }
}
Object.defineProperty(globalThis, 'ResizeObserver', {
  value: MockResizeObserver,
  writable: true,
})
