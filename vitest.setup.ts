import '@testing-library/jest-dom'
import { vi } from 'vitest'

// jsdom does not implement IntersectionObserver — must be a real class
class IntersectionObserverMock {
  observe    = vi.fn()
  unobserve  = vi.fn()
  disconnect = vi.fn()
  constructor(_callback: IntersectionObserverCallback) {}
}
Object.defineProperty(global, 'IntersectionObserver', { value: IntersectionObserverMock, writable: true })

// jsdom does not implement ResizeObserver
class ResizeObserverMock {
  observe    = vi.fn()
  unobserve  = vi.fn()
  disconnect = vi.fn()
  constructor(_callback: ResizeObserverCallback) {}
}
Object.defineProperty(global, 'ResizeObserver', { value: ResizeObserverMock, writable: true })
