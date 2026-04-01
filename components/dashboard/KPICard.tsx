'use client'

import { TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react'

type Props = {
  title: string
  value: string
  target: string
  trend: number // percentage change vs previous period
  status: 'ok' | 'warning' | 'critical'
  icon: React.ReactNode
  unit?: string
  subtitle?: string
}

export default function KPICard({ title, value, target, trend, status, icon, subtitle }: Props) {
  const statusStyles = {
    ok: 'border-l-4 border-l-emerald-500',
    warning: 'border-l-4 border-l-amber-500',
    critical: 'border-l-4 border-l-red-500',
  }

  const statusBadge = {
    ok: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    critical: 'bg-red-100 text-red-700',
  }

  const statusLabel = { ok: 'En meta', warning: 'Por mejorar', critical: 'Alerta' }

  return (
    <div className={`bg-white rounded-xl p-5 shadow-sm ${statusStyles[status]} hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
          {icon}
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusBadge[status]}`}>
          {status === 'warning' || status === 'critical' ? (
            <span className="flex items-center gap-1"><AlertTriangle size={10} />{statusLabel[status]}</span>
          ) : statusLabel[status]}
        </span>
      </div>

      <div className="mt-2">
        <div className="text-3xl font-bold text-slate-900 tracking-tight">{value}</div>
        <div className="text-sm text-slate-500 mt-0.5">{title}</div>
        {subtitle && <div className="text-xs text-slate-400 mt-0.5">{subtitle}</div>}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-slate-400">Meta: <span className="text-slate-600 font-medium">{target}</span></span>
        <div className={`flex items-center gap-1 text-xs font-medium ${trend > 0 ? 'text-emerald-600' : trend < 0 ? 'text-red-500' : 'text-slate-400'}`}>
          {trend > 0 ? <TrendingUp size={12} /> : trend < 0 ? <TrendingDown size={12} /> : <Minus size={12} />}
          {Math.abs(trend).toFixed(1)}pp vs mes ant.
        </div>
      </div>
    </div>
  )
}
