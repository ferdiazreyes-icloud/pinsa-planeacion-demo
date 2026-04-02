import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BarChart3 } from 'lucide-react'
import KPICard from '@/components/dashboard/KPICard'

const baseProps = {
  title: 'Fill Rate (OTIF)',
  value: '91.4%',
  target: '95%',
  trend: 1.2,
  status: 'ok' as const,
  icon: <BarChart3 size={16} />,
  subtitle: 'Órdenes completas y a tiempo',
}

describe('KPICard', () => {
  it('renders the title', () => {
    render(<KPICard {...baseProps} />)
    expect(screen.getByText('Fill Rate (OTIF)')).toBeInTheDocument()
  })

  it('renders the value', () => {
    render(<KPICard {...baseProps} />)
    expect(screen.getByText('91.4%')).toBeInTheDocument()
  })

  it('renders the target', () => {
    render(<KPICard {...baseProps} />)
    expect(screen.getByText('95%')).toBeInTheDocument()
  })

  it('renders the subtitle when provided', () => {
    render(<KPICard {...baseProps} />)
    expect(screen.getByText('Órdenes completas y a tiempo')).toBeInTheDocument()
  })

  it('does not render subtitle when not provided', () => {
    const { subtitle: _, ...propsNoSub } = baseProps
    render(<KPICard {...propsNoSub} />)
    expect(screen.queryByText('Órdenes completas y a tiempo')).not.toBeInTheDocument()
  })

  it('shows "En meta" badge for ok status', () => {
    render(<KPICard {...baseProps} status="ok" />)
    expect(screen.getByText('En meta')).toBeInTheDocument()
  })

  it('shows "Por mejorar" badge for warning status', () => {
    render(<KPICard {...baseProps} status="warning" />)
    expect(screen.getByText('Por mejorar')).toBeInTheDocument()
  })

  it('shows "Alerta" badge for critical status', () => {
    render(<KPICard {...baseProps} status="critical" />)
    expect(screen.getByText('Alerta')).toBeInTheDocument()
  })

  it('renders trend value as absolute number', () => {
    render(<KPICard {...baseProps} trend={-2.5} />)
    expect(screen.getByText('2.5pp')).toBeInTheDocument()
  })

  it('renders zero trend', () => {
    render(<KPICard {...baseProps} trend={0} />)
    expect(screen.getByText('0.0pp')).toBeInTheDocument()
  })
})
