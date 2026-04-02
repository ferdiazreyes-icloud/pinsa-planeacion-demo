'use client'

import { useState } from 'react'
import { CheckCircle2, AlertCircle, DollarSign, TrendingUp, TrendingDown } from 'lucide-react'
import { formatCurrency } from '@/lib/formatters'

const planData = {
  revenue: 148_000_000,
  revenueBudget: 141_500_000,
  cogs: 97_200_000,
  cogsBudget: 90_800_000,
  grossMargin: 50_800_000,
  grossMarginPct: 34.3,
  grossMarginBudgetPct: 35.8,
  inventoryInvestment: 22_400_000,
  workingCapital: 301_200_000,
  workingCapitalBudget: 290_000_000,
  fillRateImpact: 18_500_000,
}

export default function Step5Finance() {
  const [approved, setApproved] = useState<boolean | null>(null)
  const [comment, setComment] = useState('')

  const revenueVar = planData.revenue - planData.revenueBudget
  const cogsVar = planData.cogs - planData.cogsBudget
  const marginVar = planData.grossMarginPct - planData.grossMarginBudgetPct
  const wcVar = planData.workingCapital - planData.workingCapitalBudget

  return (
    <div className="space-y-8">

      {/* P&L Summary */}
      <div>
        <div className="text-sm font-bold mb-4" style={{ color: 'var(--text-primary)' }}>P&L proyectado — Abril 2026</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              label: 'Ventas netas',
              value: formatCurrency(planData.revenue, true),
              budget: formatCurrency(planData.revenueBudget, true),
              var: revenueVar,
              varPct: ((revenueVar / planData.revenueBudget) * 100).toFixed(1),
              icon: <TrendingUp size={17} />,
              goodIsPositive: true,
            },
            {
              label: 'COGS',
              value: formatCurrency(planData.cogs, true),
              budget: formatCurrency(planData.cogsBudget, true),
              var: cogsVar,
              varPct: ((cogsVar / planData.cogsBudget) * 100).toFixed(1),
              icon: <DollarSign size={17} />,
              goodIsPositive: false,
            },
            {
              label: 'Margen bruto',
              value: `${planData.grossMarginPct}%`,
              budget: `${planData.grossMarginBudgetPct}%`,
              var: marginVar,
              varPct: marginVar.toFixed(1),
              icon: <TrendingUp size={17} />,
              goodIsPositive: true,
            },
            {
              label: 'Capital de trabajo',
              value: formatCurrency(planData.workingCapital, true),
              budget: formatCurrency(planData.workingCapitalBudget, true),
              var: wcVar,
              varPct: ((wcVar / planData.workingCapitalBudget) * 100).toFixed(1),
              icon: <DollarSign size={17} />,
              goodIsPositive: false,
            },
          ].map(({ label, value, budget, var: varVal, varPct, icon, goodIsPositive }) => {
            const isGood = goodIsPositive ? varVal >= 0 : varVal <= 0
            return (
              <div key={label} className="rounded-xl p-4" style={{ background: 'var(--bg-tertiary)' }}>
                <div className="flex items-center gap-2 mb-3" style={{ color: 'var(--text-secondary)' }}>
                  {icon}
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{label}</span>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{value}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>Presupuesto: {budget}</div>
                  </div>
                  <div className="text-right" style={{ color: isGood ? 'var(--positive)' : 'var(--negative)' }}>
                    <div className="text-sm font-semibold flex items-center gap-1 justify-end">
                      {isGood ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                      {varVal > 0 ? '+' : ''}{varPct}%
                    </div>
                    <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>vs presupuesto</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Risk flags */}
      <div>
        <div className="text-sm font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Riesgos financieros identificados</div>
        <div className="space-y-2">
          {[
            { risk: 'COGS +7.1% sobre presupuesto por alza atún y hojalata', impact: '$6.4M', severity: 'high' as const },
            { risk: 'Posible pérdida de ventas por desabasto DOL-POUCH y GUA-170 (fill rate 89%)', impact: '$18.5M', severity: 'high' as const },
            { risk: 'Capital de trabajo $11.2M sobre plan por mayor inventario de seguridad', impact: '$11.2M', severity: 'medium' as const },
            { risk: 'Revenue +$6.5M sobre plan por mejor temporada Semana Santa', impact: '+$6.5M', severity: 'low' as const },
          ].map(({ risk, impact, severity }) => {
            const s = severity === 'high'
              ? { bg: 'rgba(155,28,74,0.05)',  border: 'rgba(155,28,74,0.18)',  iconColor: '#9B1C4A', textColor: 'var(--text-primary)' }
              : severity === 'medium'
              ? { bg: 'rgba(184,125,26,0.05)', border: 'rgba(184,125,26,0.18)', iconColor: '#B87D1A', textColor: 'var(--text-primary)' }
              : { bg: 'rgba(26,122,110,0.05)', border: 'rgba(26,122,110,0.18)', iconColor: '#1A7A6E', textColor: 'var(--text-primary)' }
            return (
              <div key={risk}
                className="flex items-start gap-3 p-3 rounded-xl"
                style={{ background: s.bg, border: `1px solid ${s.border}` }}
              >
                <AlertCircle size={14} style={{ color: s.iconColor, flexShrink: 0, marginTop: 2 }} />
                <span className="text-sm flex-1" style={{ color: s.textColor }}>{risk}</span>
                <span className="text-sm font-bold flex-shrink-0" style={{ color: severity === 'low' ? '#1A7A6E' : 'var(--text-primary)' }}>{impact}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Approval */}
      {approved === null ? (
        <div className="rounded-xl p-6" style={{ background: 'var(--bg-tertiary)' }}>
          <div className="text-sm font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Decisión de Finanzas</div>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Comentarios o condiciones para aprobación..."
            className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none resize-none h-24 mb-4"
            style={{
              border: '1px solid var(--border-primary)',
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
            }}
          />
          <div className="flex gap-3">
            <button
              onClick={() => setApproved(true)}
              className="flex-1 text-white py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90 flex items-center justify-center gap-2"
              style={{ background: '#1A7A6E' }}
            >
              <CheckCircle2 size={16} /> Aprobar plan Abr 2026
            </button>
            <button
              onClick={() => setApproved(false)}
              className="flex-1 text-white py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90 flex items-center justify-center gap-2"
              style={{ background: '#9B1C4A' }}
            >
              <AlertCircle size={16} /> Devolver con observaciones
            </button>
          </div>
        </div>
      ) : (
        <div
          className="rounded-xl p-6"
          style={{
            background: approved ? 'rgba(26,122,110,0.06)' : 'rgba(155,28,74,0.06)',
            border: `1px solid ${approved ? 'rgba(26,122,110,0.25)' : 'rgba(155,28,74,0.25)'}`,
          }}
        >
          <div
            className="flex items-center gap-2 text-lg font-bold mb-2"
            style={{ color: approved ? '#1A7A6E' : '#9B1C4A' }}
          >
            {approved ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            {approved ? 'Plan Abril 2026 aprobado' : 'Plan devuelto a revisión'}
          </div>
          {comment && <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>{comment}</p>}
          {approved && (
            <p className="text-sm mt-2" style={{ color: '#1A7A6E' }}>
              Las órdenes de reposición serán liberadas. Siguiente revisión: S&OP semana 4 (plan lock).
            </p>
          )}
          <button
            onClick={() => { setApproved(null); setComment('') }}
            className="mt-3 text-xs underline"
            style={{ color: 'var(--text-tertiary)' }}
          >
            Cambiar decisión
          </button>
        </div>
      )}
    </div>
  )
}
