'use client'

import ReactECharts from 'echarts-for-react'
import { AlertTriangle } from 'lucide-react'

const inventoryPlan = [
  { sku: 'DOL-170-ACE',   demand: 20800, currentStock: 44200, safetyDays: 35, daysOfCover: 27, replenishment: 19500, status: 'warning'  as const, statusNote: 'Por debajo del mínimo post-Semana Santa' },
  { sku: 'DOL-170-AGU',   demand: 25000, currentStock: 52400, safetyDays: 35, daysOfCover: 25, replenishment: 22000, status: 'warning'  as const, statusNote: 'Ajustar orden de compra +10%' },
  { sku: 'DOL-POUCH-ACE', demand: 35000, currentStock: 65800, safetyDays: 32, daysOfCover: 22, replenishment: 32000, status: 'critical' as const, statusNote: 'Inventario crítico — priorizar producción' },
  { sku: 'GUA-170-ACE',   demand: 11200, currentStock: 20800, safetyDays: 35, daysOfCover: 19, replenishment: 11000, status: 'critical' as const, statusNote: 'Riesgo desabasto post-veda hojalata' },
  { sku: 'SIR-SARD-425',  demand: 8000,  currentStock: 14900, safetyDays: 38, daysOfCover: 21, replenishment: 8000,  status: 'warning'  as const, statusNote: 'Cobertura justa para temporada' },
]

const STATUS_COLORS = {
  critical: '#9B1C4A',
  warning:  '#B87D1A',
  ok:       '#1A7A6E',
}

export default function Step4Inventory() {
  const totalReplenishment = inventoryPlan.reduce((s, r) => s + r.replenishment, 0)
  const avgDOC = Math.round(inventoryPlan.reduce((s, r) => s + r.daysOfCover, 0) / inventoryPlan.length)

  const barOption = {
    grid: { top: 12, right: 60, bottom: 20, left: 8, containLabel: true },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(255,255,255,0.97)',
      borderColor: '#D8DAE8',
      borderWidth: 1,
      textStyle: { color: '#3D4466', fontSize: 11 },
      formatter: (params: { name: string; value: number }[]) => {
        const p = params[0]
        if (!p) return ''
        return `<span style="font-weight:600;color:#3D4466">${p.name}</span><br/><b>${p.value} días</b> de cobertura`
      },
    },
    xAxis: {
      type: 'category',
      data: inventoryPlan.map(r => r.sku.replace('DOL-', '').replace('GUA-', 'GUA-').replace('SIR-', 'SIR-')),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#8E93AF', fontSize: 10 },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#ECEDF3', type: 'dashed' } },
      axisLabel: { color: '#8E93AF', fontSize: 10 },
    },
    series: [
      {
        type: 'bar',
        barMaxWidth: 48,
        data: inventoryPlan.map(r => ({
          value: r.daysOfCover,
          itemStyle: { color: STATUS_COLORS[r.status], borderRadius: [4, 4, 0, 0] },
        })),
        markLine: {
          silent: true,
          symbol: 'none',
          data: [
            {
              yAxis: 35,
              label: { color: '#B87D1A', fontSize: 10, position: 'end', formatter: 'Mín 35d' },
              lineStyle: { color: '#B87D1A', type: 'dashed', width: 1.5 },
            },
            {
              yAxis: 20,
              label: { color: '#9B1C4A', fontSize: 10, position: 'end', formatter: 'Crítico 20d' },
              lineStyle: { color: '#9B1C4A', type: 'dashed', width: 1.5 },
            },
          ],
        },
      },
    ],
  }

  return (
    <div className="space-y-8">

      {/* KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl p-4 text-center" style={{ background: 'var(--bg-tertiary)' }}>
          <div className="text-3xl font-bold" style={{ color: 'var(--warning)' }}>{avgDOC} días</div>
          <div className="text-sm mt-1 font-semibold" style={{ color: 'var(--text-primary)' }}>Cobertura promedio</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>Mínimo requerido: 35 días</div>
        </div>
        <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(36,45,81,0.06)' }}>
          <div className="text-3xl font-bold" style={{ color: 'var(--brand-navy)' }}>{totalReplenishment.toLocaleString()}</div>
          <div className="text-sm mt-1 font-semibold" style={{ color: 'var(--text-primary)' }}>Cajas a reponer (Mar 25)</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>~{Math.round(totalReplenishment / 48)} pallets</div>
        </div>
        <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(155,28,74,0.06)' }}>
          <div className="text-3xl font-bold" style={{ color: 'var(--negative)' }}>2</div>
          <div className="text-sm mt-1 font-semibold" style={{ color: 'var(--text-primary)' }}>SKUs en estado crítico</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--negative)' }}>Requieren acción inmediata</div>
        </div>
      </div>

      {/* Bar chart */}
      <div>
        <div className="text-sm font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Días de cobertura proyectada — cierre Mar 2025</div>
        <ReactECharts option={barOption} style={{ height: 220 }} notMerge />
      </div>

      {/* Detail table */}
      <div>
        <div className="text-sm font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Plan de reposición detallado</div>
        <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid var(--border-primary)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--bg-tertiary)' }}>
                <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>SKU</th>
                <th className="text-right px-4 py-3 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Demanda proyectada</th>
                <th className="text-right px-4 py-3 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Inventario actual</th>
                <th className="text-right px-4 py-3 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Días cobertura</th>
                <th className="text-right px-4 py-3 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Orden reposición</th>
                <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {inventoryPlan.map(row => (
                <tr key={row.sku} style={{ borderTop: '1px solid var(--border-primary)' }}>
                  <td className="px-4 py-3 font-medium text-xs" style={{ color: 'var(--text-primary)' }}>{row.sku}</td>
                  <td className="px-4 py-3 text-right text-xs" style={{ color: 'var(--text-secondary)' }}>{row.demand.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-xs" style={{ color: 'var(--text-secondary)' }}>{row.currentStock.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-semibold text-xs" style={{ color: STATUS_COLORS[row.status] }}>
                    {row.daysOfCover}d
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-xs" style={{ color: 'var(--brand-navy)' }}>{row.replenishment.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5 text-xs font-medium" style={{ color: STATUS_COLORS[row.status] }}>
                      <AlertTriangle size={12} />
                      {row.statusNote}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer note */}
      <div className="px-4 py-3 rounded-xl" style={{ background: 'rgba(36,45,81,0.06)', border: '1px solid rgba(36,45,81,0.15)' }}>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Plan listo para validación financiera.</span>{' '}
          La orden de reposición total representa un desembolso estimado de <span className="font-bold" style={{ color: 'var(--brand-navy)' }}>$22.4M MXN</span> en materiales y producción.
          Requiere aprobación de Finanzas antes de liberar órdenes de compra.
        </p>
      </div>
    </div>
  )
}
