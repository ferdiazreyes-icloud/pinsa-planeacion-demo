'use client'

import ReactECharts from 'echarts-for-react'
import { AlertTriangle, Factory, Clock, Zap, Send } from 'lucide-react'
import { useState } from 'react'
import { ProductionCapacity, type GapOption } from '@/data'
import { formatCurrency } from '@/lib/formatters'

const STATUS_META: Record<'ok' | 'tight' | 'gap' | 'slack', { color: string; bg: string; label: string }> = {
  ok:    { color: '#1A7A6E', bg: 'rgba(26,122,110,0.08)', label: 'En capacidad' },
  tight: { color: '#B87D1A', bg: 'rgba(184,125,26,0.08)', label: 'Ajustado' },
  gap:   { color: '#9B1C4A', bg: 'rgba(155,28,74,0.1)',   label: 'Brecha' },
  slack: { color: '#8E93AF', bg: 'rgba(142,147,175,0.08)', label: 'Holgura' },
}

const OPTION_ICONS: Record<GapOption['type'], React.ReactElement> = {
  'expand-capacity':  <Clock size={18} />,
  'accept-stockout':  <AlertTriangle size={18} />,
  'adjust-plan':      <Zap size={18} />,
}

const OPTION_COLORS: Record<GapOption['type'], string> = {
  'expand-capacity':  'var(--brand-navy)',
  'accept-stockout':  'var(--negative)',
  'adjust-plan':      'var(--warning)',
}

export default function Step4Production() {
  const { lines, gapAnalysis } = ProductionCapacity
  const [escalated, setEscalated] = useState<string | null>(null)

  const totalCapacity = lines.reduce((s, l) => s + l.capacityWeekCases, 0)
  const totalDemand = lines.reduce((s, l) => s + l.demandWeekCases, 0)
  const globalUtilization = Math.round((totalDemand / totalCapacity) * 100)
  const linesWithGap = lines.filter(l => l.status === 'gap').length

  const barOption = {
    grid: { top: 20, right: 20, bottom: 24, left: 8, containLabel: true },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(255,255,255,0.97)',
      borderColor: '#D8DAE8',
      borderWidth: 1,
      textStyle: { color: '#3D4466', fontSize: 11 },
      formatter: (params: Array<{ name: string; value: number; seriesName: string; color: string; dataIndex: number }>) => {
        const i = params[0]?.dataIndex
        if (i === undefined) return ''
        const line = lines[i]
        const util = Math.round((line.demandWeekCases / line.capacityWeekCases) * 100)
        return `<div style="font-weight:600">${line.name}</div>
          <div style="margin-top:4px">Capacidad: <b>${line.capacityWeekCases.toLocaleString()}</b> cajas/sem</div>
          <div>Demanda: <b>${line.demandWeekCases.toLocaleString()}</b> cajas/sem</div>
          <div>Utilización: <b style="color:${util > 100 ? '#9B1C4A' : util > 90 ? '#B87D1A' : '#1A7A6E'}">${util}%</b></div>
          <div style="margin-top:4px;color:#8E93AF">Lote mín: ${line.minBatchCases.toLocaleString()} · Setup: ${line.setupHours}h</div>`
      },
    },
    xAxis: {
      type: 'category',
      data: lines.map(l => l.id),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#8E93AF', fontSize: 10 },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#ECEDF3', type: 'dashed' } },
      axisLabel: { color: '#8E93AF', fontSize: 10, formatter: (v: number) => `${(v / 1000).toFixed(0)}K` },
    },
    series: [
      {
        name: 'Capacidad',
        type: 'bar',
        barMaxWidth: 16,
        data: lines.map(l => l.capacityWeekCases),
        itemStyle: { color: '#D8DAE8', borderRadius: [3, 3, 0, 0] },
      },
      {
        name: 'Demanda',
        type: 'bar',
        barMaxWidth: 16,
        data: lines.map(l => ({
          value: l.demandWeekCases,
          itemStyle: { color: STATUS_META[l.status].color, borderRadius: [3, 3, 0, 0] },
        })),
      },
    ],
    legend: {
      bottom: 0,
      itemWidth: 10,
      itemHeight: 10,
      textStyle: { color: '#8E93AF', fontSize: 11 },
      data: ['Capacidad', 'Demanda'],
    },
  }

  return (
    <div className="space-y-7">
      {/* KPI row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl p-4 text-center" style={{ background: 'var(--bg-tertiary)' }}>
          <div className="text-3xl font-bold" style={{ color: globalUtilization > 95 ? 'var(--negative)' : globalUtilization > 85 ? 'var(--warning)' : 'var(--positive)' }}>
            {globalUtilization}%
          </div>
          <div className="text-sm mt-1 font-semibold" style={{ color: 'var(--text-primary)' }}>Utilización global planta</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{totalDemand.toLocaleString()} / {totalCapacity.toLocaleString()} cajas/sem</div>
        </div>
        <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(155,28,74,0.06)' }}>
          <div className="text-3xl font-bold" style={{ color: 'var(--negative)' }}>{linesWithGap}</div>
          <div className="text-sm mt-1 font-semibold" style={{ color: 'var(--text-primary)' }}>Líneas con brecha</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>Demanda &gt; capacidad semanal</div>
        </div>
        <div className="rounded-xl p-4 text-center" style={{ background: 'var(--bg-tertiary)' }}>
          <div className="text-3xl font-bold" style={{ color: 'var(--brand-navy)' }}>{lines.length}</div>
          <div className="text-sm mt-1 font-semibold" style={{ color: 'var(--text-primary)' }}>Líneas en planta Mazatlán</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>Programa semana 20 Abr 2026</div>
        </div>
      </div>

      {/* Chart */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Factory size={16} style={{ color: 'var(--brand-navy)' }} />
          <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Programa de producción por línea × semana</span>
        </div>
        <ReactECharts option={barOption} style={{ height: 260 }} notMerge />
      </div>

      {/* Detail table */}
      <div>
        <div className="text-sm font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Detalle por línea</div>
        <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid var(--border-primary)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--bg-tertiary)' }}>
                <th className="text-left  px-3 py-3 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Línea</th>
                <th className="text-left  px-3 py-3 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>SKU primario</th>
                <th className="text-right px-3 py-3 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Capacidad</th>
                <th className="text-right px-3 py-3 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Demanda</th>
                <th className="text-right px-3 py-3 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Util.</th>
                <th className="text-right px-3 py-3 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Lote mín.</th>
                <th className="text-right px-3 py-3 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Setup</th>
                <th className="text-left  px-3 py-3 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {lines.map(line => {
                const util = Math.round((line.demandWeekCases / line.capacityWeekCases) * 100)
                const s = STATUS_META[line.status]
                return (
                  <tr key={line.id} style={{ borderTop: '1px solid var(--border-primary)' }}>
                    <td className="px-3 py-2.5 font-medium text-xs" style={{ color: 'var(--text-primary)' }}>{line.name}</td>
                    <td className="px-3 py-2.5 text-xs" style={{ color: 'var(--text-secondary)' }}>{line.primarySkus.join(', ') || <span style={{ color: 'var(--text-tertiary)', fontStyle: 'italic' }}>flex</span>}</td>
                    <td className="px-3 py-2.5 text-right text-xs" style={{ color: 'var(--text-secondary)' }}>{line.capacityWeekCases.toLocaleString()}</td>
                    <td className="px-3 py-2.5 text-right text-xs" style={{ color: 'var(--text-secondary)' }}>{line.demandWeekCases.toLocaleString()}</td>
                    <td className="px-3 py-2.5 text-right font-semibold text-xs" style={{ color: s.color }}>{util}%</td>
                    <td className="px-3 py-2.5 text-right text-xs" style={{ color: 'var(--text-tertiary)' }}>{line.minBatchCases.toLocaleString()}</td>
                    <td className="px-3 py-2.5 text-right text-xs" style={{ color: 'var(--text-tertiary)' }}>{line.setupHours}h</td>
                    <td className="px-3 py-2.5">
                      <span
                        className="text-[11px] px-2 py-0.5 rounded-full font-medium"
                        style={{ background: s.bg, color: s.color }}
                      >
                        {s.label}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gap analysis */}
      <div
        className="rounded-xl p-5"
        style={{ background: 'rgba(155,28,74,0.04)', border: '1px solid rgba(155,28,74,0.2)' }}
      >
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle size={17} style={{ color: 'var(--negative)' }} />
          <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
            Brecha detectada — {gapAnalysis.lineId} ({gapAnalysis.skuAffected})
          </span>
        </div>
        <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>
          Demanda plan: <b>{gapAnalysis.demandCases.toLocaleString()}</b> cajas · Capacidad: <b>{gapAnalysis.capacityCases.toLocaleString()}</b> cajas · Brecha: <b style={{ color: 'var(--negative)' }}>{gapAnalysis.gapCases.toLocaleString()} cajas</b>.
          El sistema no decide — presenta las 3 opciones con impactos modelados para que la Sesión Ejecutiva elija.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {gapAnalysis.options.map(opt => (
            <div
              key={opt.id}
              className="rounded-xl p-4"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}
            >
              <div className="flex items-center gap-2 mb-3" style={{ color: OPTION_COLORS[opt.type] }}>
                {OPTION_ICONS[opt.type]}
                <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{opt.label}</span>
              </div>
              <div className="space-y-2.5 text-xs">
                <div>
                  <div className="font-semibold" style={{ color: 'var(--text-tertiary)' }}>Impacto financiero</div>
                  <div style={{ color: OPTION_COLORS[opt.type], fontWeight: 700, fontSize: 13 }}>
                    {opt.type === 'adjust-plan' && opt.revenueLostMXN
                      ? `−${formatCurrency(opt.revenueLostMXN, true)} revenue`
                      : opt.type === 'accept-stockout' && opt.salesLostMXN
                      ? `−${formatCurrency(opt.salesLostMXN, true)} ventas perdidas`
                      : opt.costMXN > 0
                      ? `+${formatCurrency(opt.costMXN, true)} OPEX`
                      : 'Sin costo directo'}
                  </div>
                </div>
                {opt.incrementalCapacityCases && (
                  <div>
                    <div className="font-semibold" style={{ color: 'var(--text-tertiary)' }}>Capacidad ganada</div>
                    <div style={{ color: 'var(--text-secondary)' }}>+{opt.incrementalCapacityCases.toLocaleString()} cajas/sem</div>
                  </div>
                )}
                <div>
                  <div className="font-semibold" style={{ color: 'var(--text-tertiary)' }}>Servicio</div>
                  <div style={{ color: 'var(--text-secondary)' }}>{opt.serviceImpact}</div>
                </div>
                <div>
                  <div className="font-semibold" style={{ color: 'var(--text-tertiary)' }}>Factibilidad</div>
                  <div style={{ color: 'var(--text-secondary)' }}>{opt.feasibility}</div>
                </div>
                <div className="pt-2" style={{ borderTop: '1px dashed var(--border-primary)' }}>
                  <span className="text-[10px] font-semibold" style={{ color: 'var(--text-tertiary)' }}>TRADE-OFF</span>
                  <div style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{opt.tradeoff}</div>
                </div>
              </div>
              <button
                onClick={() => setEscalated(opt.id)}
                disabled={escalated === opt.id}
                className="mt-3 w-full text-xs px-3 py-2 rounded-lg font-semibold transition-opacity disabled:opacity-60 flex items-center justify-center gap-1.5"
                style={{
                  background: escalated === opt.id ? 'rgba(26,122,110,0.1)' : OPTION_COLORS[opt.type],
                  color: escalated === opt.id ? 'var(--positive)' : 'white',
                }}
              >
                {escalated === opt.id ? <>✓ Escalada a Sesión Ejecutiva</> : <><Send size={11} /> Escalar a Sesión Ejecutiva</>}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
