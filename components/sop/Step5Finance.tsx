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
        <h3 className="text-sm font-semibold text-slate-700 mb-4">P&L proyectado — Marzo 2025</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              label: 'Ventas netas',
              value: formatCurrency(planData.revenue, true),
              budget: formatCurrency(planData.revenueBudget, true),
              var: revenueVar,
              varPct: ((revenueVar / planData.revenueBudget) * 100).toFixed(1),
              icon: <TrendingUp size={18} />,
              goodIsPositive: true,
            },
            {
              label: 'COGS',
              value: formatCurrency(planData.cogs, true),
              budget: formatCurrency(planData.cogsBudget, true),
              var: cogsVar,
              varPct: ((cogsVar / planData.cogsBudget) * 100).toFixed(1),
              icon: <DollarSign size={18} />,
              goodIsPositive: false,
            },
            {
              label: 'Margen bruto',
              value: `${planData.grossMarginPct}%`,
              budget: `${planData.grossMarginBudgetPct}%`,
              var: marginVar,
              varPct: marginVar.toFixed(1),
              icon: <TrendingUp size={18} />,
              goodIsPositive: true,
            },
            {
              label: 'Capital de trabajo',
              value: formatCurrency(planData.workingCapital, true),
              budget: formatCurrency(planData.workingCapitalBudget, true),
              var: wcVar,
              varPct: ((wcVar / planData.workingCapitalBudget) * 100).toFixed(1),
              icon: <DollarSign size={18} />,
              goodIsPositive: false,
            },
          ].map(({ label, value, budget, var: varVal, varPct, icon, goodIsPositive }) => {
            const isGood = goodIsPositive ? varVal >= 0 : varVal <= 0
            return (
              <div key={label} className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3 text-slate-500">
                  {icon}
                  <span className="text-sm font-semibold text-slate-700">{label}</span>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-2xl font-bold text-slate-900">{value}</div>
                    <div className="text-xs text-slate-400 mt-0.5">Presupuesto: {budget}</div>
                  </div>
                  <div className={`text-right ${isGood ? 'text-emerald-600' : 'text-red-500'}`}>
                    <div className="text-sm font-semibold flex items-center gap-1 justify-end">
                      {isGood ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                      {varVal > 0 ? '+' : ''}{varPct}%
                    </div>
                    <div className="text-xs">vs presupuesto</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Risk flags */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Riesgos financieros identificados</h3>
        <div className="space-y-2">
          {[
            { risk: 'COGS +7.1% sobre presupuesto por alza atún y hojalata', impact: '$6.4M', severity: 'high' as const },
            { risk: 'Posible pérdida de ventas por desabasto DOL-POUCH y GUA-170 (fill rate 89%)', impact: '$18.5M', severity: 'high' as const },
            { risk: 'Capital de trabajo $11.2M sobre plan por mayor inventario de seguridad', impact: '$11.2M', severity: 'medium' as const },
            { risk: 'Revenue +$6.5M sobre plan por mejor temporada Semana Santa', impact: '+$6.5M', severity: 'low' as const },
          ].map(({ risk, impact, severity }) => (
            <div key={risk} className={`flex items-start gap-3 p-3 rounded-xl ${severity === 'high' ? 'bg-red-50' : severity === 'medium' ? 'bg-amber-50' : 'bg-emerald-50'}`}>
              <AlertCircle size={14} className={`flex-shrink-0 mt-0.5 ${severity === 'high' ? 'text-red-500' : severity === 'medium' ? 'text-amber-500' : 'text-emerald-500'}`} />
              <span className={`text-sm flex-1 ${severity === 'high' ? 'text-red-800' : severity === 'medium' ? 'text-amber-800' : 'text-emerald-800'}`}>{risk}</span>
              <span className={`text-sm font-bold flex-shrink-0 ${severity === 'low' ? 'text-emerald-700' : 'text-slate-700'}`}>{impact}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Approval */}
      {!approved ? (
        <div className="bg-slate-50 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Decisión de Finanzas</h3>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Comentarios o condiciones para aprobación..."
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white resize-none h-24 mb-4"
          />
          <div className="flex gap-3">
            <button
              onClick={() => setApproved(true)}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={16} /> Aprobar plan Mar 2025
            </button>
            <button
              onClick={() => setApproved(false)}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <AlertCircle size={16} /> Devolver con observaciones
            </button>
          </div>
        </div>
      ) : (
        <div className={`rounded-xl p-6 ${approved ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'}`}>
          <div className={`flex items-center gap-2 text-lg font-bold mb-2 ${approved ? 'text-emerald-800' : 'text-red-800'}`}>
            {approved ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            {approved ? 'Plan Marzo 2025 aprobado' : 'Plan devuelto a revisión'}
          </div>
          {comment && <p className={`text-sm mt-2 ${approved ? 'text-emerald-700' : 'text-red-700'}`}>{comment}</p>}
          {approved && (
            <p className="text-emerald-700 text-sm mt-2">
              Las órdenes de reposición serán liberadas. Siguiente revisión: S&OP semana 4 (plan lock).
            </p>
          )}
          <button onClick={() => { setApproved(null); setComment('') }} className="mt-3 text-xs text-slate-500 underline">
            Cambiar decisión
          </button>
        </div>
      )}
    </div>
  )
}
