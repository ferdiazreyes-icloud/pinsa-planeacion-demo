import { AlertTriangle, AlertCircle, Info, Zap } from 'lucide-react'
import { formatCurrency } from '@/lib/formatters'

type Alert = {
  id: string
  severity: 'high' | 'medium' | 'low'
  type: string
  title: string
  description: string
  financialImpactMXN: number
}

const severityConfig = {
  high: { icon: Zap, bg: 'bg-red-50', border: 'border-red-200', iconColor: 'text-red-500', badge: 'bg-red-100 text-red-700' },
  medium: { icon: AlertTriangle, bg: 'bg-amber-50', border: 'border-amber-200', iconColor: 'text-amber-500', badge: 'bg-amber-100 text-amber-700' },
  low: { icon: Info, bg: 'bg-blue-50', border: 'border-blue-200', iconColor: 'text-blue-500', badge: 'bg-blue-100 text-blue-700' },
}

export default function AlertBanner({ alerts }: { alerts: Alert[] }) {
  return (
    <div className="space-y-3">
      {alerts.map(alert => {
        const cfg = severityConfig[alert.severity]
        const Icon = cfg.icon
        return (
          <div key={alert.id} className={`${cfg.bg} border ${cfg.border} rounded-xl p-4 flex items-start gap-3`}>
            <Icon size={18} className={`${cfg.iconColor} flex-shrink-0 mt-0.5`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-slate-800 text-sm">{alert.title}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.badge}`}>
                  {alert.severity === 'high' ? 'Alta' : alert.severity === 'medium' ? 'Media' : 'Baja'} prioridad
                </span>
              </div>
              <p className="text-slate-600 text-sm mt-1 leading-relaxed">{alert.description}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-sm font-semibold text-slate-700">{formatCurrency(alert.financialImpactMXN, true)}</div>
              <div className="text-xs text-slate-400">impacto est.</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
