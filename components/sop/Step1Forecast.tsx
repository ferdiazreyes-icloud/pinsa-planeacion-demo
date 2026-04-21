'use client'

import ReactECharts from 'echarts-for-react'
import { Forecast, SKUs } from '@/data'

const TOP_SKUS = ['DOL-170-ACE', 'DOL-170-AGU', 'POR-POUCH-ACE', 'MAZ-170-ACE', 'ELD-SARD-JIT-425']

const accuracyData = TOP_SKUS.map(skuId => {
  const sku = SKUs.find(s => s.id === skuId)!
  const records = Forecast.filter(f => f.skuId === skuId && f.actual !== null && f.statistical > 0)
  const mape = records.length
    ? records.reduce((sum, r) => sum + Math.abs((r.actual! - r.statistical) / r.actual!) * 100, 0) / records.length
    : 0
  return { sku: sku?.name.replace('Dolores ', 'DOL ').replace('Portola ', 'POR ').replace('Mazatún ', 'MAZ ').replace('El Dorado ', 'ELD '), accuracy: Math.round((100 - mape) * 10) / 10 }
})

const chartData = ['2025-11', '2025-12', '2026-01', '2026-02', '2026-03', '2026-04'].map(period => {
  const label = { '2025-11': 'Nov', '2025-12': 'Dic', '2026-01': 'Ene', '2026-02': 'Feb', '2026-03': 'Mar', '2026-04': 'Abr (F)' }[period]
  const periodRecords = Forecast.filter(f => f.period === period)
  const statistical = periodRecords.reduce((s, r) => s + r.statistical, 0)
  const collaborated = periodRecords.reduce((s, r) => s + (r.collaborated ?? r.statistical), 0)
  const actual = periodRecords.every(r => r.actual !== null) ? periodRecords.reduce((s, r) => s + (r.actual ?? 0), 0) : null
  return { label, statistical, collaborated, actual }
})

export default function Step1Forecast() {
  const barOption = {
    grid: { top: 16, right: 16, bottom: 20, left: 8, containLabel: true },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(255,255,255,0.97)',
      borderColor: '#D8DAE8',
      borderWidth: 1,
      textStyle: { color: '#3D4466', fontSize: 11 },
      formatter: (params: { seriesName: string; value: number | null; color: string }[]) =>
        params.filter(p => p.value !== null)
          .map(p => `<span style="display:inline-block;width:8px;height:8px;border-radius:2px;background:${p.color};margin-right:5px"></span>${p.seriesName}: <b>${Number(p.value).toLocaleString()} cajas</b>`)
          .join('<br/>'),
    },
    legend: {
      bottom: 0,
      itemWidth: 10,
      itemHeight: 10,
      textStyle: { color: '#8E93AF', fontSize: 11 },
    },
    xAxis: {
      type: 'category',
      data: chartData.map(d => d.label),
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
        name: 'Estadístico',
        type: 'bar',
        barMaxWidth: 14,
        data: chartData.map(d => d.statistical),
        itemStyle: { color: '#acacac', borderRadius: [2, 2, 0, 0] },
      },
      {
        name: 'Colaborado',
        type: 'bar',
        barMaxWidth: 14,
        data: chartData.map(d => d.collaborated),
        itemStyle: { color: '#242d51', borderRadius: [2, 2, 0, 0] },
      },
      {
        name: 'Real',
        type: 'bar',
        barMaxWidth: 14,
        data: chartData.map(d => d.actual ?? '-'),
        itemStyle: { color: '#1A7A6E', borderRadius: [2, 2, 0, 0] },
      },
    ],
  }

  return (
    <div className="space-y-7">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { value: '71.2%',  label: 'Asertividad Mar 2026',    sub: '1 − MAPE promedio portafolio',          color: 'var(--warning)' },
          { value: '+3.1pp', label: 'Mejora con colaboración', sub: 'Estadístico 71.2% → Colaborado 74.3%',  color: 'var(--brand-navy)' },
          { value: '-2.4%',  label: 'Sesgo del pronóstico',    sub: 'Ligero sub-pronóstico sistémico',        color: 'var(--negative)' },
        ].map(({ value, label, sub, color }) => (
          <div key={label} className="rounded-xl p-4 text-center" style={{ background: 'var(--bg-tertiary)' }}>
            <div className="text-3xl font-black" style={{ color }}>{value}</div>
            <div className="text-sm mt-1 font-semibold" style={{ color: 'var(--text-primary)' }}>{label}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{sub}</div>
          </div>
        ))}
      </div>

      <div>
        <div className="text-sm font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Pronóstico estadístico vs colaborado vs real — últimos 6 períodos</div>
        <ReactECharts option={barOption} style={{ height: 260 }} notMerge />
      </div>

      <div>
        <div className="text-sm font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Asertividad por SKU — últimos 12 meses</div>
        <div className="space-y-2.5">
          {accuracyData.map(({ sku, accuracy }) => (
            <div key={sku} className="flex items-center gap-3">
              <span className="text-xs w-52 flex-shrink-0 truncate" style={{ color: 'var(--text-secondary)' }}>{sku}</span>
              <div className="flex-1 rounded-full h-2" style={{ background: 'var(--bg-tertiary)' }}>
                <div
                  className="h-2 rounded-full transition-all"
                  style={{
                    width: `${accuracy}%`,
                    background: accuracy >= 75 ? 'var(--positive)' : accuracy >= 68 ? 'var(--warning)' : 'var(--negative)',
                  }}
                />
              </div>
              <span className="text-sm font-bold w-14 text-right" style={{ color: accuracy >= 75 ? 'var(--positive)' : accuracy >= 68 ? 'var(--warning)' : 'var(--negative)' }}>
                {accuracy}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 py-3 rounded-xl" style={{ background: 'rgba(36,45,81,0.06)', border: '1px solid rgba(36,45,81,0.15)' }}>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Pronóstico estadístico Abr 2026 listo.</span>{' '}
          El modelo detecta un pico estacional de +19% por Semana Santa (confirmado históricamente en 2023 y 2024).
          Pendiente: colaboración de ventas para ajuste por clientes clave.
        </p>
      </div>
    </div>
  )
}
