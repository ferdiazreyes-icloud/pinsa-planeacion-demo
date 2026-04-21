import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import AlertBanner from '@/components/dashboard/AlertBanner'
import type { Alert } from '@/data'

const alerts: Alert[] = [
  {
    id: 'a1',
    severity: 'high',
    type: 'supply',
    title: 'Riesgo de desabasto POR-POUCH-ACE',
    description: 'Inventario proyectado cae a 18 días de cobertura.',
    skusAffected: ['POR-POUCH-ACE'],
    financialImpactMXN: 18_500_000,
  },
  {
    id: 'a2',
    severity: 'medium',
    type: 'forecast',
    title: 'Baja asertividad MAZ-170',
    description: 'MAPE supera 35% en últimos 3 meses.',
    skusAffected: ['MAZ-170-ACE'],
    financialImpactMXN: 3_200_000,
  },
  {
    id: 'a3',
    severity: 'low',
    type: 'price',
    title: 'Alerta precio hojalata',
    description: 'Precio +8% vs mes anterior.',
    skusAffected: [],
    financialImpactMXN: 1_000_000,
  },
]

describe('AlertBanner', () => {
  it('renders all alerts', () => {
    render(<AlertBanner alerts={alerts} />)
    expect(screen.getByText('Riesgo de desabasto POR-POUCH-ACE')).toBeInTheDocument()
    expect(screen.getByText('Baja asertividad MAZ-170')).toBeInTheDocument()
    expect(screen.getByText('Alerta precio hojalata')).toBeInTheDocument()
  })

  it('renders descriptions', () => {
    render(<AlertBanner alerts={alerts} />)
    expect(screen.getByText('Inventario proyectado cae a 18 días de cobertura.')).toBeInTheDocument()
  })

  it('renders severity labels', () => {
    render(<AlertBanner alerts={alerts} />)
    expect(screen.getByText('Alta')).toBeInTheDocument()
    expect(screen.getByText('Media')).toBeInTheDocument()
    expect(screen.getByText('Baja')).toBeInTheDocument()
  })

  it('renders financial impact in compact format', () => {
    render(<AlertBanner alerts={alerts} />)
    expect(screen.getByText('$18.5M')).toBeInTheDocument()
    expect(screen.getByText('$3.2M')).toBeInTheDocument()
    expect(screen.getByText('$1.0M')).toBeInTheDocument()
  })

  it('renders an empty list without crashing', () => {
    const { container } = render(<AlertBanner alerts={[]} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders a single alert', () => {
    render(<AlertBanner alerts={[alerts[0]]} />)
    expect(screen.getByText('Riesgo de desabasto POR-POUCH-ACE')).toBeInTheDocument()
    expect(screen.queryByText('Baja asertividad MAZ-170')).not.toBeInTheDocument()
  })
})
