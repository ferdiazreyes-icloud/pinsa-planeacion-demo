'use client'

import { useState } from 'react'
import ReactECharts from 'echarts-for-react'
import { AlertTriangle, Factory, Warehouse, ArrowRight } from 'lucide-react'
import { Inventory, SKUs, type InventoryRecord } from '@/data'

const CURRENT_PERIOD = '2026-04'

type NodeView = 'consolidado' | 'planta' | 'cedis'

const STATUS_COLORS = {
  critical: '#9B1C4A',
  warning:  '#B87D1A',
  ok:       '#1A7A6E',
}

const ABC_META: Record<'A' | 'B' | 'C', { color: string; bg: string; label: string; policy: string }> = {
  A: { color: '#1A7A6E', bg: 'rgba(26,122,110,0.1)',  label: 'A · Alta rotación', policy: 'Stock seguridad dinámico · reabasto semanal' },
  B: { color: '#B87D1A', bg: 'rgba(184,125,26,0.1)',  label: 'B · Media rotación',  policy: 'Stock seguridad estándar · reabasto quincenal' },
  C: { color: '#8E93AF', bg: 'rgba(142,147,175,0.12)', label: 'C · Baja rotación', policy: 'Criterios de racionalización · reabasto bajo demanda' },
}

const FAMILY_TYPE = (sku: string): string => sku.split('-').slice(0, 2).join('-')

// Status por cobertura vs target por nodo
function statusFor(days: number, target: number): 'ok' | 'warning' | 'critical' {
  if (days < target * 0.6) return 'critical'
  if (days < target * 0.85) return 'warning'
  return 'ok'
}

export default function Step4Inventory() {
  const [view, setView] = useState<NodeView>('consolidado')

  // Data del período actual con join a SKU
  const records: (InventoryRecord & { skuName: string; abcClass: 'A' | 'B' | 'C' })[] = Inventory
    .filter(r => r.period === CURRENT_PERIOD)
    .map(r => {
      const sku = SKUs.find(s => s.id === r.skuId)
      return {
        ...r,
        skuName: sku?.name ?? r.skuId,
        abcClass: (r.abcClass ?? sku?.abcClass ?? 'B') as 'A' | 'B' | 'C',
      }
    })

  // Totales consolidados y por nodo
  const totalValue = records.reduce((s, r) => s + r.stockValueMXN, 0)
  const plantaValue = records.reduce((s, r) => s + (r.byNode?.planta.stockValueMXN ?? 0), 0)
  const cedisValue = records.reduce((s, r) => s + (r.byNode?.cedis.stockValueMXN ?? 0), 0)
  const avgDOCConsolidado = Math.round(records.reduce((s, r) => s + r.daysOfCover, 0) / records.length)
  const avgDOCCedis = Math.round(records.reduce((s, r) => s + (r.byNode?.cedis.daysOfCover ?? r.daysOfCover), 0) / records.length)
  const avgDOCPlanta = Math.round(records.reduce((s, r) => s + (r.byNode?.planta.daysOfCover ?? r.daysOfCover), 0) / records.length)

  // Señales de reabasto planta → CEDIS (CEDIS bajo target)
  const replenishmentSignals = records
    .filter(r => r.byNode && r.byNode.cedis.daysOfCover < r.byNode.cedis.targetDays)
    .map(r => {
      const cedis = r.byNode!.cedis
      const gap = cedis.targetDays - cedis.daysOfCover
      const dailyRun = cedis.closingStock / Math.max(cedis.daysOfCover, 1)
      const sendCases = Math.round(dailyRun * gap)
      return { ...r, sendCases }
    })

  // Tabla filtrada por view
  const rowsToShow = records.map(r => {
    if (view === 'planta' && r.byNode) {
      const n = r.byNode.planta
      return { ...r, displayStock: n.closingStock, displayDays: n.daysOfCover, displayTarget: n.targetDays, status: statusFor(n.daysOfCover, n.targetDays) }
    }
    if (view === 'cedis' && r.byNode) {
      const n = r.byNode.cedis
      return { ...r, displayStock: n.closingStock, displayDays: n.daysOfCover, displayTarget: n.targetDays, status: statusFor(n.daysOfCover, n.targetDays) }
    }
    return { ...r, displayStock: r.closingStock, displayDays: r.daysOfCover, displayTarget: r.safetyStockDays, status: statusFor(r.daysOfCover, r.safetyStockDays) }
  })

  const barOption = {
    grid: { top: 12, right: 60, bottom: 20, left: 8, containLabel: true },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(255,255,255,0.97)',
      borderColor: '#D8DAE8',
      borderWidth: 1,
      textStyle: { color: '#3D4466', fontSize: 11 },
      formatter: (params: Array<{ name: string; value: number; dataIndex: number }>) => {
        const i = params[0]?.dataIndex
        if (i === undefined) return ''
        const row = rowsToShow[i]
        return `<div style="font-weight:600">${row.skuName}</div>
          <div style="margin-top:2px"><b>${row.displayDays}d</b> de cobertura (target ${row.displayTarget}d)</div>
          <div>Stock: <b>${row.displayStock.toLocaleString()}</b> cajas</div>
          <div style="margin-top:2px;color:#8E93AF">Clase ${row.abcClass} · ${ABC_META[row.abcClass].policy}</div>`
      },
    },
    xAxis: {
      type: 'category',
      data: rowsToShow.map(r => FAMILY_TYPE(r.skuId)),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#8E93AF', fontSize: 10 },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#ECEDF3', type: 'dashed' } },
      axisLabel: { color: '#8E93AF', fontSize: 10, formatter: '{value}d' },
    },
    series: [
      {
        type: 'bar',
        barMaxWidth: 40,
        data: rowsToShow.map(r => ({
          value: r.displayDays,
          itemStyle: { color: STATUS_COLORS[r.status], borderRadius: [4, 4, 0, 0] },
        })),
      },
    ],
  }

  return (
    <div className="space-y-7">
      {/* Red de distribución diagrama + view toggle */}
      <div className="flex items-start gap-4 flex-wrap">
        <div
          className="flex items-center gap-3 rounded-xl px-4 py-3 flex-shrink-0"
          style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)' }}
        >
          <div className="flex items-center gap-1.5">
            <Factory size={14} style={{ color: 'var(--brand-navy)' }} />
            <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Planta Mazatlán</span>
          </div>
          <ArrowRight size={12} style={{ color: 'var(--text-tertiary)' }} />
          <div className="flex items-center gap-1.5">
            <Warehouse size={14} style={{ color: 'var(--brand-maroon)' }} />
            <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>CEDIS México</span>
          </div>
          <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>· 2 nodos de red</span>
        </div>

        <div className="flex gap-1 rounded-xl p-1 ml-auto" style={{ background: 'var(--bg-tertiary)' }}>
          {([
            { id: 'consolidado', label: 'Consolidado' },
            { id: 'planta',      label: 'Planta'      },
            { id: 'cedis',       label: 'CEDIS'       },
          ] as const).map(opt => (
            <button
              key={opt.id}
              onClick={() => setView(opt.id)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
              style={{
                background: view === opt.id ? 'var(--bg-secondary)' : 'transparent',
                color: view === opt.id ? 'var(--brand-navy)' : 'var(--text-tertiary)',
                boxShadow: view === opt.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl p-4 text-center" style={{ background: 'var(--bg-tertiary)' }}>
          <div className="text-3xl font-bold" style={{ color: 'var(--warning)' }}>
            {view === 'planta' ? avgDOCPlanta : view === 'cedis' ? avgDOCCedis : avgDOCConsolidado}d
          </div>
          <div className="text-sm mt-1 font-semibold" style={{ color: 'var(--text-primary)' }}>Cobertura promedio</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
            {view === 'planta' ? 'Buffer planta (producción)' : view === 'cedis' ? 'Stock CEDIS (cara al canal)' : 'Red completa'}
          </div>
        </div>
        <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(36,45,81,0.06)' }}>
          <div className="text-3xl font-bold" style={{ color: 'var(--brand-navy)' }}>
            ${((view === 'planta' ? plantaValue : view === 'cedis' ? cedisValue : totalValue) / 1e6).toFixed(1)}M
          </div>
          <div className="text-sm mt-1 font-semibold" style={{ color: 'var(--text-primary)' }}>Valor inventario</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
            Planta ${(plantaValue / 1e6).toFixed(1)}M · CEDIS ${(cedisValue / 1e6).toFixed(1)}M
          </div>
        </div>
        <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(155,28,74,0.06)' }}>
          <div className="text-3xl font-bold" style={{ color: 'var(--negative)' }}>{replenishmentSignals.length}</div>
          <div className="text-sm mt-1 font-semibold" style={{ color: 'var(--text-primary)' }}>Señales reabasto CEDIS</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>Cobertura bajo target</div>
        </div>
      </div>

      {/* Política ABC diferenciada */}
      <div>
        <div className="text-sm font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
          Política de inventario por clase ABC
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {(['A', 'B', 'C'] as const).map(abc => {
            const m = ABC_META[abc]
            const count = records.filter(r => r.abcClass === abc).length
            return (
              <div key={abc} className="rounded-xl p-3" style={{ background: m.bg, border: `1px solid ${m.color}30` }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold" style={{ color: m.color }}>{m.label}</span>
                  <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{count} SKUs</span>
                </div>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{m.policy}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Bar chart */}
      <div>
        <div className="text-sm font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Días de cobertura — {view === 'planta' ? 'Planta Mazatlán' : view === 'cedis' ? 'CEDIS México' : 'Red consolidada'}
        </div>
        <ReactECharts option={barOption} style={{ height: 220 }} notMerge />
      </div>

      {/* Detail table */}
      <div>
        <div className="text-sm font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Plan de reposición detallado</div>
        <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid var(--border-primary)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--bg-tertiary)' }}>
                <th className="text-left  px-3 py-3 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>SKU</th>
                <th className="text-center px-3 py-3 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Clase</th>
                <th className="text-right px-3 py-3 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Planta stock</th>
                <th className="text-right px-3 py-3 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Planta dias</th>
                <th className="text-right px-3 py-3 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>CEDIS stock</th>
                <th className="text-right px-3 py-3 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>CEDIS dias / target</th>
                <th className="text-right px-3 py-3 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Reabasto orden</th>
              </tr>
            </thead>
            <tbody>
              {records.map(r => {
                const planta = r.byNode?.planta
                const cedis = r.byNode?.cedis
                const cedisStatus = cedis ? statusFor(cedis.daysOfCover, cedis.targetDays) : 'ok'
                const abc = ABC_META[r.abcClass]
                return (
                  <tr key={r.skuId} style={{ borderTop: '1px solid var(--border-primary)' }}>
                    <td className="px-3 py-2.5 font-medium text-xs" style={{ color: 'var(--text-primary)' }}>{r.skuId}</td>
                    <td className="px-3 py-2.5 text-center">
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: abc.bg, color: abc.color }}>
                        {r.abcClass}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-right text-xs" style={{ color: 'var(--text-secondary)' }}>{planta?.closingStock.toLocaleString() ?? '—'}</td>
                    <td className="px-3 py-2.5 text-right text-xs font-semibold" style={{ color: 'var(--positive)' }}>{planta?.daysOfCover ?? '—'}d</td>
                    <td className="px-3 py-2.5 text-right text-xs" style={{ color: 'var(--text-secondary)' }}>{cedis?.closingStock.toLocaleString() ?? '—'}</td>
                    <td className="px-3 py-2.5 text-right text-xs font-semibold" style={{ color: STATUS_COLORS[cedisStatus] }}>
                      {cedis?.daysOfCover ?? '—'}d / {cedis?.targetDays ?? '—'}d
                    </td>
                    <td className="px-3 py-2.5 text-right text-xs font-medium" style={{ color: 'var(--brand-navy)' }}>{r.replenishmentOrder.toLocaleString()}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Señales de reabasto planta → CEDIS */}
      {replenishmentSignals.length > 0 && (
        <div
          className="rounded-xl p-5"
          style={{ background: 'rgba(155,28,74,0.04)', border: '1px solid rgba(155,28,74,0.2)' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={16} style={{ color: 'var(--negative)' }} />
            <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
              Señales de reabasto Planta → CEDIS ({replenishmentSignals.length})
            </span>
          </div>
          <div className="space-y-2">
            {replenishmentSignals.map(s => (
              <div
                key={s.skuId}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}
              >
                <span className="text-xs font-semibold flex-shrink-0 w-36" style={{ color: 'var(--text-primary)' }}>{s.skuId}</span>
                <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <Factory size={11} style={{ color: 'var(--brand-navy)' }} />
                  <span>Planta {s.byNode?.planta.closingStock.toLocaleString()}</span>
                  <ArrowRight size={10} style={{ color: 'var(--text-tertiary)' }} />
                  <Warehouse size={11} style={{ color: 'var(--brand-maroon)' }} />
                  <span>CEDIS {s.byNode?.cedis.closingStock.toLocaleString()} ({s.byNode?.cedis.daysOfCover}d vs {s.byNode?.cedis.targetDays}d target)</span>
                </div>
                <div className="ml-auto text-xs font-bold" style={{ color: 'var(--brand-navy)' }}>
                  Enviar <span style={{ color: 'var(--negative)' }}>{s.sendCases.toLocaleString()}</span> cajas
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer note */}
      <div className="px-4 py-3 rounded-xl" style={{ background: 'rgba(36,45,81,0.06)', border: '1px solid rgba(36,45,81,0.15)' }}>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Política diferenciada aplicada.</span>{' '}
          Clase A mantiene buffer dinámico calculado vs volatilidad del forecast.
          Clase C opera con criterios de racionalización (solo lote mínimo).
          Las señales de reabasto a CEDIS se liberan al WMS al aprobar el ciclo.
        </p>
      </div>
    </div>
  )
}
