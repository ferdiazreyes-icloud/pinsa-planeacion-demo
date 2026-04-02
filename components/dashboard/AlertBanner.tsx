import { Zap, AlertTriangle, Info } from 'lucide-react'
import { formatCurrency } from '@/lib/formatters'

type Alert = {
  id: string
  severity: 'high' | 'medium' | 'low'
  type: string
  title: string
  description: string
  financialImpactMXN: number
}

const cfg = {
  high:   { icon: Zap,           bg: 'rgba(155,28,74,0.05)',   border: 'rgba(155,28,74,0.18)',  iconColor: '#9B1C4A', badgeBg: 'rgba(155,28,74,0.08)',  badgeColor: '#9B1C4A', label: 'Alta' },
  medium: { icon: AlertTriangle, bg: 'rgba(184,125,26,0.05)',  border: 'rgba(184,125,26,0.18)', iconColor: '#B87D1A', badgeBg: 'rgba(184,125,26,0.08)', badgeColor: '#B87D1A', label: 'Media' },
  low:    { icon: Info,          bg: 'rgba(36,45,81,0.04)',    border: 'rgba(36,45,81,0.15)',   iconColor: '#242d51', badgeBg: 'rgba(36,45,81,0.08)',   badgeColor: '#242d51', label: 'Baja' },
}

export default function AlertBanner({ alerts }: { alerts: Alert[] }) {
  return (
    <div className="space-y-2">
      {alerts.map(alert => {
        const c = cfg[alert.severity]
        const Icon = c.icon
        return (
          <div
            key={alert.id}
            className="flex items-start gap-3 px-4 py-3 rounded-xl transition-all"
            style={{ background: c.bg, border: `1px solid ${c.border}` }}
          >
            <Icon size={15} style={{ color: c.iconColor, flexShrink: 0, marginTop: 2 }} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{alert.title}</span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ background: c.badgeBg, color: c.badgeColor }}
                >
                  {c.label}
                </span>
              </div>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{alert.description}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{formatCurrency(alert.financialImpactMXN, true)}</div>
              <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>impacto</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
