'use client'

import { useState, useEffect } from 'react'
import {
  BarChart3, TrendingUp, Package, AlertTriangle,
  Clock, Zap, Send, ChevronDown, ChevronUp,
  CheckCircle2, AlertCircle, DollarSign, TrendingDown, GitCompare,
} from 'lucide-react'
import TourGuide, { type TourStep } from '@/components/layout/TourGuide'
import { KPIs, ProductionCapacity, type Alert, type GapOption } from '@/data'
import { formatCurrency } from '@/lib/formatters'
import { getExecutiveSessionScenarios, type SavedScenario } from '@/lib/scenarios'

type KpiKey = 'fillRate' | 'accuracy' | 'inventory' | 'openGaps'

const SESSION_TOUR: TourStep[] = [
  { target: '[data-tour="se-kpis"]',      title: 'Los 4 KPIs que importan esta sesión', desc: 'Haz clic en cualquier KPI en rojo o ámbar para ver la causa raíz y las opciones. La sesión dura 60 min y termina con decisiones, no con preguntas.', position: 'bottom' },
  { target: '[data-tour="se-gaps"]',      title: 'Brechas abiertas',                     desc: 'Aquí aparecen las decisiones que la Sesión Ejecutiva debe resolver. El sistema presenta opciones con impactos modelados — el Director de Operaciones arbitra.',          position: 'top'    },
  { target: '[data-tour="se-finance"]',   title: 'Impacto financiero del ciclo',         desc: 'P&L proyectado vs presupuesto. Si el plan se aprueba, estos son los números que Finanzas va a defender.',                                                                   position: 'top'    },
  { target: '[data-tour="se-decision"]',  title: 'Decisión del ciclo',                   desc: 'Aprobar plan liberará las órdenes de producción y reposición. Rechazar devuelve el ciclo a planeación con observaciones.',                                                    position: 'top'    },
]

// P&L del ciclo (antes en Step5Finance)
const planData = {
  revenue: 148_000_000,
  revenueBudget: 141_500_000,
  cogs: 97_200_000,
  cogsBudget: 90_800_000,
  grossMarginPct: 34.3,
  grossMarginBudgetPct: 35.8,
  inventoryInvestment: 22_400_000,
  workingCapital: 301_200_000,
  workingCapitalBudget: 290_000_000,
}

export default function SesionEjecutivaPage() {
  const { current } = KPIs
  const alerts = KPIs.alerts as Alert[]
  const { gapAnalysis } = ProductionCapacity
  const [expanded, setExpanded] = useState<KpiKey | null>(null)
  const [decidedOption, setDecidedOption] = useState<string | null>(null)
  const [cycleDecision, setCycleDecision] = useState<'approved' | 'rejected' | null>(null)
  const [decisionComment, setDecisionComment] = useState('')
  const [executiveScenarios, setExecutiveScenarios] = useState<SavedScenario[]>([])

  useEffect(() => {
    setExecutiveScenarios(getExecutiveSessionScenarios())
  }, [])

  const toggle = (k: KpiKey) => setExpanded(prev => prev === k ? null : k)

  const fillRateStatus = current.fillRate >= current.fillRateTarget ? 'ok' : current.fillRate >= 90 ? 'warning' : 'critical'
  const accuracyStatus = current.forecastAccuracy >= current.forecastAccuracyTarget ? 'ok' : current.forecastAccuracy >= 68 ? 'warning' : 'critical'
  const invStatus = (current.inventoryDaysOfCover >= current.inventoryDocMin && current.inventoryDaysOfCover <= current.inventoryDocMax) ? 'ok' : 'warning'
  const openGaps = alerts.filter(a => a.severity === 'high').length + 1 // +1 por gap de producción

  const kpiColor = (status: string) => status === 'ok' ? 'var(--positive)' : status === 'warning' ? 'var(--warning)' : 'var(--negative)'

  const revenueVar = planData.revenue - planData.revenueBudget
  const cogsVar = planData.cogs - planData.cogsBudget
  const marginVar = planData.grossMarginPct - planData.grossMarginBudgetPct
  const wcVar = planData.workingCapital - planData.workingCapitalBudget

  const OPTION_ICONS: Record<GapOption['type'], React.ReactElement> = {
    'expand-capacity': <Clock size={16} />,
    'accept-stockout': <AlertTriangle size={16} />,
    'adjust-plan':     <Zap size={16} />,
  }
  const OPTION_COLORS: Record<GapOption['type'], string> = {
    'expand-capacity': 'var(--brand-navy)',
    'accept-stockout': 'var(--negative)',
    'adjust-plan':     'var(--warning)',
  }

  return (
    <div className="px-8 py-7 max-w-screen-xl">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Sesión Ejecutiva S&OP
            </h1>
            <span
              className="text-xs px-2.5 py-1 rounded-full font-semibold"
              style={{ background: 'rgba(96,27,77,0.12)', color: '#8B2E6A' }}
            >
              60 min · Decidir, no reportar
            </span>
          </div>
          <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
            Ciclo Abril 2026 · Director de Operaciones arbitra · 5 eslabones convergen aquí
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Participantes</div>
          <div className="text-xs font-medium mt-1" style={{ color: 'var(--text-secondary)' }}>
            Dirección Operaciones · Comercial · Supply Chain · Finanzas
          </div>
        </div>
      </div>

      {/* 4 KPIs con drill-down */}
      <div data-tour="se-kpis" className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {/* Fill Rate */}
        <button
          onClick={() => toggle('fillRate')}
          className="text-left rounded-xl p-5 transition-all hover:shadow-md"
          style={{
            background: expanded === 'fillRate' ? 'rgba(155,28,74,0.05)' : 'var(--bg-secondary)',
            border: `1px solid ${expanded === 'fillRate' ? 'rgba(155,28,74,0.3)' : 'var(--border-primary)'}`,
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>
              <BarChart3 size={13} /> Fill Rate OTIF
            </div>
            {expanded === 'fillRate' ? <ChevronUp size={14} style={{ color: 'var(--text-tertiary)' }} /> : <ChevronDown size={14} style={{ color: 'var(--text-tertiary)' }} />}
          </div>
          <div className="text-3xl font-black" style={{ color: kpiColor(fillRateStatus) }}>{current.fillRate}%</div>
          <div className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>Meta {current.fillRateTarget}% · gap {(current.fillRateTarget - current.fillRate).toFixed(1)}pp</div>
        </button>

        {/* Forecast Accuracy */}
        <button
          onClick={() => toggle('accuracy')}
          className="text-left rounded-xl p-5 transition-all hover:shadow-md"
          style={{
            background: expanded === 'accuracy' ? 'rgba(184,125,26,0.05)' : 'var(--bg-secondary)',
            border: `1px solid ${expanded === 'accuracy' ? 'rgba(184,125,26,0.3)' : 'var(--border-primary)'}`,
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>
              <TrendingUp size={13} /> Forecast Accuracy
            </div>
            {expanded === 'accuracy' ? <ChevronUp size={14} style={{ color: 'var(--text-tertiary)' }} /> : <ChevronDown size={14} style={{ color: 'var(--text-tertiary)' }} />}
          </div>
          <div className="text-3xl font-black" style={{ color: kpiColor(accuracyStatus) }}>{current.forecastAccuracy}%</div>
          <div className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>Meta {current.forecastAccuracyTarget}% · 1 − MAPE portafolio</div>
        </button>

        {/* Inventario */}
        <button
          onClick={() => toggle('inventory')}
          className="text-left rounded-xl p-5 transition-all hover:shadow-md"
          style={{
            background: expanded === 'inventory' ? 'rgba(26,122,110,0.05)' : 'var(--bg-secondary)',
            border: `1px solid ${expanded === 'inventory' ? 'rgba(26,122,110,0.3)' : 'var(--border-primary)'}`,
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>
              <Package size={13} /> Días Inventario
            </div>
            {expanded === 'inventory' ? <ChevronUp size={14} style={{ color: 'var(--text-tertiary)' }} /> : <ChevronDown size={14} style={{ color: 'var(--text-tertiary)' }} />}
          </div>
          <div className="text-3xl font-black" style={{ color: kpiColor(invStatus) }}>{current.inventoryDaysOfCover}d</div>
          <div className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>Rango {current.inventoryDocMin}–{current.inventoryDocMax}d · capital ${(current.workingCapitalMXN / 1e6).toFixed(0)}M</div>
        </button>

        {/* Brechas */}
        <button
          onClick={() => toggle('openGaps')}
          className="text-left rounded-xl p-5 transition-all hover:shadow-md"
          style={{
            background: expanded === 'openGaps' ? 'rgba(155,28,74,0.05)' : 'var(--bg-secondary)',
            border: `1px solid ${expanded === 'openGaps' ? 'rgba(155,28,74,0.3)' : 'var(--border-primary)'}`,
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>
              <AlertTriangle size={13} /> Brechas Abiertas
            </div>
            {expanded === 'openGaps' ? <ChevronUp size={14} style={{ color: 'var(--text-tertiary)' }} /> : <ChevronDown size={14} style={{ color: 'var(--text-tertiary)' }} />}
          </div>
          <div className="text-3xl font-black" style={{ color: 'var(--negative)' }}>{openGaps}</div>
          <div className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>Requieren decisión esta sesión</div>
        </button>
      </div>

      {/* Drill-down panel */}
      {expanded && (
        <div className="ec-card p-5 mb-6 animate-fade-in-up">
          {expanded === 'fillRate' && (
            <div>
              <div className="text-sm font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                Causa raíz — Fill Rate {current.fillRate}% ({(current.fillRateTarget - current.fillRate).toFixed(1)}pp bajo meta)
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <span style={{ color: 'var(--negative)' }}>▸</span>
                  <span><b>POR-POUCH-ACE</b> en 87% (Walmart, Sam&apos;s, OXXO) — brecha de capacidad L5 con 17K cajas de déficit.</span>
                </div>
                <div className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <span style={{ color: 'var(--warning)' }}>▸</span>
                  <span><b>MAZ-170-ACE</b> en 89% — cobertura 19 días post-veda hojalata.</span>
                </div>
                <div className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <span style={{ color: 'var(--text-tertiary)' }}>▸</span>
                  <span>El resto del portafolio en 94%+ — el problema está concentrado en 2 SKUs.</span>
                </div>
              </div>
              <div className="text-xs px-3 py-2 rounded-lg" style={{ background: 'rgba(36,45,81,0.05)', color: 'var(--text-secondary)' }}>
                <b style={{ color: 'var(--text-primary)' }}>Acción sugerida:</b> resolver brecha L5 (ver sección inferior) y priorizar hojalata con proveedor secundario.
              </div>
            </div>
          )}
          {expanded === 'accuracy' && (
            <div>
              <div className="text-sm font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                Causa raíz — Forecast Accuracy {current.forecastAccuracy}% ({(current.forecastAccuracyTarget - current.forecastAccuracy).toFixed(1)}pp bajo meta)
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <span style={{ color: 'var(--negative)' }}>▸</span>
                  <span>Ajustes tipo <b>&quot;acción competencia&quot;</b> empeoran baseline en −3.8% en promedio (últimos 6 ciclos, n=19).</span>
                </div>
                <div className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <span style={{ color: 'var(--warning)' }}>▸</span>
                  <span>32% de SKUs Clase A sin justificación de ajuste — la correlación histórica sugiere 2.3x mejor accuracy cuando está justificado.</span>
                </div>
              </div>
              <div className="text-xs px-3 py-2 rounded-lg" style={{ background: 'rgba(36,45,81,0.05)', color: 'var(--text-secondary)' }}>
                <b style={{ color: 'var(--text-primary)' }}>Acción sugerida:</b> training comercial sobre FVA · revisar ajustes por acción competencia antes de aceptar.
              </div>
            </div>
          )}
          {expanded === 'inventory' && (
            <div>
              <div className="text-sm font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                Inventario en rango — {current.inventoryDaysOfCover}d · rango {current.inventoryDocMin}–{current.inventoryDocMax}d
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <span style={{ color: 'var(--positive)' }}>▸</span>
                  <span>Cobertura promedio ponderada dentro del rango objetivo.</span>
                </div>
                <div className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <span style={{ color: 'var(--warning)' }}>▸</span>
                  <span>Capital de trabajo <b>${(current.workingCapitalMXN / 1e6).toFixed(0)}M</b> vs meta <b>${(current.workingCapitalTargetMXN / 1e6).toFixed(0)}M</b> — +$18.5M por buffer anticipado por riesgo de hojalata.</span>
                </div>
              </div>
            </div>
          )}
          {expanded === 'openGaps' && (
            <div>
              <div className="text-sm font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                {openGaps} brechas requieren decisión ejecutiva
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <span className="w-2 h-2 rounded-full" style={{ background: 'var(--negative)' }} />
                  <span>Capacidad L5 (Pouch 80g) — ver sección abajo</span>
                </div>
                {alerts.filter(a => a.severity === 'high').map(a => (
                  <div key={a.id} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <span className="w-2 h-2 rounded-full" style={{ background: 'var(--negative)' }} />
                    <span>{a.title} — impacto {formatCurrency(a.financialImpactMXN, true)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Brechas que requieren decisión */}
      <div data-tour="se-gaps" className="ec-card p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle size={16} style={{ color: 'var(--negative)' }} />
          <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
            Brecha que requiere decisión · {gapAnalysis.lineId} ({gapAnalysis.skuAffected})
          </span>
          <span className="ml-auto text-xs font-semibold" style={{ color: 'var(--negative)' }}>
            −{gapAnalysis.gapCases.toLocaleString()} cajas/sem
          </span>
        </div>
        <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>
          Demanda plan {gapAnalysis.demandCases.toLocaleString()} · Capacidad {gapAnalysis.capacityCases.toLocaleString()} · El sistema presenta 3 opciones — la sesión elige.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {gapAnalysis.options.map(opt => {
            const isChosen = decidedOption === opt.id
            return (
              <div
                key={opt.id}
                className="rounded-xl p-4"
                style={{
                  background: isChosen ? 'rgba(26,122,110,0.06)' : 'var(--bg-tertiary)',
                  border: isChosen ? '2px solid var(--positive)' : '1px solid var(--border-primary)',
                }}
              >
                <div className="flex items-center gap-2 mb-2" style={{ color: OPTION_COLORS[opt.type] }}>
                  {OPTION_ICONS[opt.type]}
                  <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{opt.label}</span>
                </div>
                <div className="text-xs font-semibold mb-2" style={{ color: OPTION_COLORS[opt.type] }}>
                  {opt.type === 'adjust-plan' && opt.revenueLostMXN
                    ? `−${formatCurrency(opt.revenueLostMXN, true)} revenue`
                    : opt.type === 'accept-stockout' && opt.salesLostMXN
                    ? `−${formatCurrency(opt.salesLostMXN, true)} ventas`
                    : opt.costMXN > 0
                    ? `+${formatCurrency(opt.costMXN, true)} OPEX`
                    : 'Sin costo'}
                </div>
                <div className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>{opt.tradeoff}</div>
                <button
                  onClick={() => setDecidedOption(opt.id)}
                  disabled={isChosen}
                  className="w-full text-xs px-3 py-2 rounded-lg font-semibold transition-opacity flex items-center justify-center gap-1.5"
                  style={{
                    background: isChosen ? 'var(--positive)' : OPTION_COLORS[opt.type],
                    color: 'white',
                    opacity: decidedOption && !isChosen ? 0.3 : 1,
                  }}
                >
                  {isChosen ? <><CheckCircle2 size={11} /> Decidida</> : <><Send size={11} /> Elegir esta opción</>}
                </button>
              </div>
            )
          })}
        </div>
        {decidedOption && (
          <div className="mt-4 px-3 py-2 rounded-lg text-xs" style={{ background: 'rgba(26,122,110,0.08)', color: 'var(--positive)' }}>
            <b>Decisión registrada.</b> La opción se documenta en el acta de la sesión y dispara las órdenes correspondientes al aprobar el ciclo.
          </div>
        )}
      </div>

      {/* Resumen financiero */}
      <div data-tour="se-finance" className="ec-card p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign size={16} style={{ color: 'var(--brand-navy)' }} />
          <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
            Impacto financiero del ciclo · P&L proyectado Abril 2026
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {[
            { label: 'Ventas netas',        value: planData.revenue,       budget: planData.revenueBudget,       var: revenueVar, varPct: (revenueVar / planData.revenueBudget) * 100,   goodIsPositive: true,  isMoney: true },
            { label: 'COGS',                value: planData.cogs,          budget: planData.cogsBudget,          var: cogsVar,    varPct: (cogsVar / planData.cogsBudget) * 100,          goodIsPositive: false, isMoney: true },
            { label: 'Margen bruto',        value: planData.grossMarginPct, budget: planData.grossMarginBudgetPct, var: marginVar,  varPct: marginVar,                                      goodIsPositive: true,  isMoney: false },
            { label: 'Capital de trabajo',  value: planData.workingCapital, budget: planData.workingCapitalBudget, var: wcVar,      varPct: (wcVar / planData.workingCapitalBudget) * 100,  goodIsPositive: false, isMoney: true },
          ].map(({ label, value, budget, var: varVal, varPct, goodIsPositive, isMoney }) => {
            const isGood = goodIsPositive ? varVal >= 0 : varVal <= 0
            return (
              <div key={label} className="rounded-xl p-3" style={{ background: 'var(--bg-tertiary)' }}>
                <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-tertiary)' }}>{label}</div>
                <div className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  {isMoney ? formatCurrency(value, true) : `${value}%`}
                </div>
                <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                  Pres. {isMoney ? formatCurrency(budget, true) : `${budget}%`}
                </div>
                <div className="flex items-center gap-1 mt-1 text-xs font-semibold" style={{ color: isGood ? 'var(--positive)' : 'var(--negative)' }}>
                  {isGood ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {varVal > 0 ? '+' : ''}{varPct.toFixed(1)}%
                </div>
              </div>
            )
          })}
        </div>
        <div className="space-y-2">
          {[
            { risk: 'COGS +7.1% sobre presupuesto por alza atún y hojalata', impact: '$6.4M', severity: 'high' as const },
            { risk: 'Posible pérdida de ventas por desabasto POR-POUCH y MAZ-170 (fill rate 89%)', impact: '$18.5M', severity: 'high' as const },
            { risk: 'Capital de trabajo $11.2M sobre plan por mayor inventario de seguridad', impact: '$11.2M', severity: 'medium' as const },
            { risk: 'Revenue +$6.5M sobre plan por mejor temporada Semana Santa', impact: '+$6.5M', severity: 'low' as const },
          ].map(({ risk, impact, severity }) => {
            const s = severity === 'high'
              ? { bg: 'rgba(155,28,74,0.05)',  border: 'rgba(155,28,74,0.18)',  iconColor: '#9B1C4A' }
              : severity === 'medium'
              ? { bg: 'rgba(184,125,26,0.05)', border: 'rgba(184,125,26,0.18)', iconColor: '#B87D1A' }
              : { bg: 'rgba(26,122,110,0.05)', border: 'rgba(26,122,110,0.18)', iconColor: '#1A7A6E' }
            return (
              <div key={risk}
                className="flex items-start gap-3 p-2.5 rounded-lg text-xs"
                style={{ background: s.bg, border: `1px solid ${s.border}` }}
              >
                <AlertCircle size={13} style={{ color: s.iconColor, flexShrink: 0, marginTop: 2 }} />
                <span className="flex-1" style={{ color: 'var(--text-primary)' }}>{risk}</span>
                <span className="font-bold flex-shrink-0" style={{ color: severity === 'low' ? '#1A7A6E' : 'var(--text-primary)' }}>{impact}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Escenarios comparados — alimentado desde el Simulador */}
      <div className="ec-card p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <GitCompare size={16} style={{ color: 'var(--brand-navy)' }} />
          <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
            Escenarios &quot;what-if&quot; para esta sesión ({executiveScenarios.length})
          </span>
          <a
            href="/simulator"
            className="ml-auto text-xs font-semibold transition-colors"
            style={{ color: 'var(--brand-navy)' }}
          >
            + Ir al Simulador →
          </a>
        </div>
        {executiveScenarios.length === 0 ? (
          <div className="text-xs rounded-lg px-4 py-3" style={{ color: 'var(--text-tertiary)', background: 'rgba(36,45,81,0.04)', border: '1px dashed var(--border-primary)' }}>
            No hay escenarios marcados. Abre el Simulador, guarda un escenario y haz clic en el ícono del martillo para traerlo a esta sesión.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid var(--border-primary)' }}>
            <table className="w-full text-xs">
              <thead>
                <tr style={{ background: 'var(--bg-tertiary)' }}>
                  <th className="text-left px-3 py-2.5 font-semibold" style={{ color: 'var(--text-secondary)' }}>Escenario</th>
                  <th className="text-right px-3 py-2.5 font-semibold" style={{ color: 'var(--text-secondary)' }}>Horizonte</th>
                  <th className="text-right px-3 py-2.5 font-semibold" style={{ color: 'var(--text-secondary)' }}>Δ MP</th>
                  <th className="text-right px-3 py-2.5 font-semibold" style={{ color: 'var(--text-secondary)' }}>Desabasto</th>
                  <th className="text-right px-3 py-2.5 font-semibold" style={{ color: 'var(--text-secondary)' }}>Δ Demanda</th>
                  <th className="text-right px-3 py-2.5 font-semibold" style={{ color: 'var(--text-secondary)' }}>Fill Rate</th>
                  <th className="text-right px-3 py-2.5 font-semibold" style={{ color: 'var(--text-secondary)' }}>Capital</th>
                  <th className="text-right px-3 py-2.5 font-semibold" style={{ color: 'var(--text-secondary)' }}>Eficiencia</th>
                  <th className="text-right px-3 py-2.5 font-semibold" style={{ color: 'var(--text-secondary)' }}>Revenue riesgo</th>
                </tr>
              </thead>
              <tbody>
                {executiveScenarios.map(s => (
                  <tr key={s.id} style={{ borderTop: '1px solid var(--border-primary)' }}>
                    <td className="px-3 py-2.5 font-semibold" style={{ color: 'var(--text-primary)' }}>{s.name}</td>
                    <td className="px-3 py-2.5 text-right" style={{ color: 'var(--text-secondary)' }}>{s.horizon}m</td>
                    <td className="px-3 py-2.5 text-right" style={{ color: 'var(--text-secondary)' }}>{s.params.rawMaterialPriceChangePct >= 0 ? '+' : ''}{s.params.rawMaterialPriceChangePct}%</td>
                    <td className="px-3 py-2.5 text-right" style={{ color: 'var(--text-secondary)' }}>{s.params.supplyDisruptionPct}%</td>
                    <td className="px-3 py-2.5 text-right" style={{ color: 'var(--text-secondary)' }}>{s.params.demandChangePct >= 0 ? '+' : ''}{s.params.demandChangePct}%</td>
                    <td className="px-3 py-2.5 text-right font-bold" style={{ color: s.metrics.avgFillRate >= 90 ? 'var(--positive)' : 'var(--negative)' }}>
                      {s.metrics.avgFillRate.toFixed(1)}%
                    </td>
                    <td className="px-3 py-2.5 text-right" style={{ color: 'var(--text-secondary)' }}>{formatCurrency(s.metrics.avgWC, true)}</td>
                    <td className="px-3 py-2.5 text-right font-bold" style={{ color: s.metrics.avgProductionEfficiency >= 80 ? 'var(--positive)' : 'var(--warning)' }}>
                      {s.metrics.avgProductionEfficiency.toFixed(0)}%
                    </td>
                    <td className="px-3 py-2.5 text-right" style={{ color: s.metrics.totalRevenueAtRisk > 0 ? 'var(--negative)' : 'var(--text-tertiary)' }}>
                      {s.metrics.totalRevenueAtRisk > 0 ? `-${formatCurrency(s.metrics.totalRevenueAtRisk, true)}` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Decisión del ciclo */}
      <div data-tour="se-decision" className="ec-card p-5">
        <div className="text-sm font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Decisión del ciclo — Director de Operaciones</div>
        {cycleDecision === null ? (
          <>
            <textarea
              value={decisionComment}
              onChange={e => setDecisionComment(e.target.value)}
              placeholder="Comentarios o condiciones para aprobación del ciclo Abril 2026..."
              className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none resize-none h-20 mb-3"
              style={{
                border: '1px solid var(--border-primary)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
              }}
            />
            <div className="flex gap-3">
              <button
                onClick={() => setCycleDecision('approved')}
                className="flex-1 text-white py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90 flex items-center justify-center gap-2"
                style={{ background: '#1A7A6E' }}
              >
                <CheckCircle2 size={16} /> Aprobar plan Abr 2026
              </button>
              <button
                onClick={() => setCycleDecision('rejected')}
                className="flex-1 text-white py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90 flex items-center justify-center gap-2"
                style={{ background: '#9B1C4A' }}
              >
                <AlertCircle size={16} /> Devolver con observaciones
              </button>
            </div>
          </>
        ) : (
          <div
            className="rounded-xl p-5"
            style={{
              background: cycleDecision === 'approved' ? 'rgba(26,122,110,0.06)' : 'rgba(155,28,74,0.06)',
              border: `1px solid ${cycleDecision === 'approved' ? 'rgba(26,122,110,0.25)' : 'rgba(155,28,74,0.25)'}`,
            }}
          >
            <div className="flex items-center gap-2 text-base font-bold mb-2" style={{ color: cycleDecision === 'approved' ? '#1A7A6E' : '#9B1C4A' }}>
              {cycleDecision === 'approved' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              {cycleDecision === 'approved' ? 'Ciclo Abril 2026 aprobado' : 'Ciclo devuelto a planeación'}
            </div>
            {decisionComment && <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>{decisionComment}</p>}
            {cycleDecision === 'approved' && (
              <p className="text-xs mt-2" style={{ color: '#1A7A6E' }}>
                Órdenes de producción y reposición liberadas. Próxima sesión: 22 May 2026.
              </p>
            )}
            <button
              onClick={() => { setCycleDecision(null); setDecisionComment('') }}
              className="mt-3 text-xs underline"
              style={{ color: 'var(--text-tertiary)' }}
            >
              Cambiar decisión
            </button>
          </div>
        )}
      </div>

      <TourGuide
        steps={SESSION_TOUR}
        storageKey="pinsa-tour-sesion-ejecutiva"
        welcomeTitle="Sesión Ejecutiva S&OP"
        welcomeDesc="El momento mensual donde los 5 eslabones convergen. 4 KPIs, brechas abiertas, P&L, decisión."
      />
    </div>
  )
}
