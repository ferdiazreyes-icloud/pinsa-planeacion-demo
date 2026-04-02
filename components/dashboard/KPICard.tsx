'use client'

import { useEffect, useRef, useState } from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

type Props = {
  title: string
  value: string
  target: string
  trend: number
  status: 'ok' | 'warning' | 'critical'
  icon: React.ReactNode
  subtitle?: string
}

function useCountUp(active: boolean) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.1 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return { ref, visible }
}

const statusDot = {
  ok:       'bg-emerald-400',
  warning:  'bg-amber-400',
  critical: 'bg-red-500',
}

const statusLabel = {
  ok:       { text: 'En meta',     bg: 'rgba(26,122,110,0.08)',  color: '#1A7A6E' },
  warning:  { text: 'Por mejorar', bg: 'rgba(184,125,26,0.08)',  color: '#B87D1A' },
  critical: { text: 'Alerta',      bg: 'rgba(155,28,74,0.08)',   color: '#9B1C4A' },
}

export default function KPICard({ title, value, target, trend, status, icon, subtitle }: Props) {
  const { ref, visible } = useCountUp(true)
  const s = statusLabel[status]

  return (
    <div
      ref={ref}
      className="ec-card p-5 animate-fade-in-up"
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
        >
          {icon}
        </div>
        <span
          className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{ background: s.bg, color: s.color }}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${statusDot[status]}`} />
          {s.text}
        </span>
      </div>

      {/* Value */}
      <div className={visible ? 'animate-count-up' : 'opacity-0'}>
        <div
          className="text-3xl font-black tracking-tight leading-none"
          style={{ color: 'var(--text-primary)' }}
        >
          {value}
        </div>
        <div className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{title}</div>
        {subtitle && <div className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{subtitle}</div>}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 flex items-center justify-between" style={{ borderTop: '1px solid var(--border-secondary)' }}>
        <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
          Meta: <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{target}</span>
        </span>
        <div
          className="flex items-center gap-1 text-xs font-semibold"
          style={{ color: trend > 0 ? 'var(--positive)' : trend < 0 ? 'var(--negative)' : 'var(--text-tertiary)' }}
        >
          {trend > 0 ? <TrendingUp size={11} /> : trend < 0 ? <TrendingDown size={11} /> : <Minus size={11} />}
          {Math.abs(trend).toFixed(1)}pp
        </div>
      </div>
    </div>
  )
}
