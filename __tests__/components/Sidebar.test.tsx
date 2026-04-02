import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Sidebar from '@/components/layout/Sidebar'

vi.mock('next/navigation', () => ({
  usePathname: () => '/dashboard',
}))

vi.mock('next/link', () => ({
  default: ({ href, children, ...rest }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
    <a href={href} {...rest}>{children}</a>
  ),
}))

describe('Sidebar', () => {
  it('renders brand name PINSA', () => {
    render(<Sidebar />)
    expect(screen.getByText('PINSA')).toBeInTheDocument()
  })

  it('renders "Torre de Control" subtitle', () => {
    render(<Sidebar />)
    expect(screen.getByText('Torre de Control')).toBeInTheDocument()
  })

  it('renders all three nav items', () => {
    render(<Sidebar />)
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    // 'Ciclo S&OP' appears twice (period badge + nav label) — check via link role
    expect(screen.getByRole('link', { name: /ciclo s&op/i })).toBeInTheDocument()
    expect(screen.getByText('Simulador')).toBeInTheDocument()
  })

  it('nav items link to correct routes', () => {
    render(<Sidebar />)
    const dashLink = screen.getByRole('link', { name: /dashboard/i })
    const sopLink  = screen.getByRole('link', { name: /ciclo s&op/i })
    const simLink  = screen.getByRole('link', { name: /simulador/i })
    expect(dashLink).toHaveAttribute('href', '/dashboard')
    expect(sopLink).toHaveAttribute('href', '/sop')
    expect(simLink).toHaveAttribute('href', '/simulator')
  })

  it('renders snapshot KPI section', () => {
    render(<Sidebar />)
    expect(screen.getByText('Snapshot')).toBeInTheDocument()
    expect(screen.getByText('Fill Rate')).toBeInTheDocument()
    expect(screen.getByText('Asertividad')).toBeInTheDocument()
  })

  it('renders current period badge', () => {
    render(<Sidebar />)
    expect(screen.getByText('Mar 2025')).toBeInTheDocument()
  })

  it('renders Demo Mode badge', () => {
    render(<Sidebar />)
    expect(screen.getByText('Demo Mode')).toBeInTheDocument()
  })

  it('highlights the active route (dashboard)', () => {
    render(<Sidebar />)
    // The active link has aria of the label, so we look for the dashboard nav link
    const dashLink = screen.getByRole('link', { name: /dashboard/i })
    // Active item has a left border color style — check the element has a borderLeft style
    expect(dashLink).toHaveStyle({ borderLeft: '3px solid #601b4d' })
  })
})
