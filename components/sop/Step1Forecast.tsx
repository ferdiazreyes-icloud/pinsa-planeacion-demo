'use client'

import ReactECharts from 'echarts-for-react'
import { Info } from 'lucide-react'
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

const PERIODS = ['2025-11', '2025-12', '2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06']
const PERIOD_LABELS: Record<string, string> = {
  '2025-11': 'Nov', '2025-12': 'Dic', '2026-01': 'Ene', '2026-02': 'Feb',
  '2026-03': 'Mar', '2026-04': 'Abr (F)', '2026-05': 'May (F)', '2026-06': 'Jun (F)',
}

const EVENT_MARKERS: Record<string, string> = {
  '2025-11': 'Buen Fin',
  '2025-12': 'Navidad',
  '2026-01': 'Navidad',
  '2026-04': 'Cuaresma · Semana Santa',
}

const chartData = PERIODS.map(period => {
  const recs = Forecast.filter(f => f.period === period)
  const statistical = recs.reduce((s, r) => s + r.statistical, 0)
  const forecastLow = recs.reduce((s, r) => s + (r.forecastLow ?? r.statistical), 0)
  const forecastHigh = recs.reduce((s, r) => s + (r.forecastHigh ?? r.statistical), 0)
  const collaborated = recs.reduce((s, r) => s + (r.collaborated ?? r.statistical), 0)
  const allActual = recs.every(r => r.actual !== null)
  const actual = allActual ? recs.reduce((s, r) => s + (r.actual ?? 0), 0) : null
  return { period, label: PERIOD_LABELS[period], statistical, forecastLow, forecastHigh, collaborated, actual, event: EVENT_MARKERS[period] }
})

export default function Step1Forecast() {
  const lineOption = {
    grid: { top: 30, right: 16, bottom: 48, left: 8, containLabel: true },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255,255,255,0.97)',
      borderColor: '#D8DAE8',
      borderWidth: 1,
      textStyle: { color: '#3D4466', fontSize: 11 },
      formatter: (params: Array<{ seriesName: string; value: number; dataIndex: number; color: string }>) => {
        if (!params?.length) return ''
        const d = chartData[params[0].dataIndex]
        const row = (label: string, val: number | null, color?: string) =>
          val === null ? '' :
          `<div style="display:flex;gap:6px;align-items:center;margin:2px 0">
            ${color ? `<span style="display:inline-block;width:8px;height:8px;border-radius:2px;background:${color}"></span>` : '<span style="display:inline-block;width:8px"></span>'}
            <span style="flex:1">${label}</span>
            <b>${Number(val).toLocaleString()}</b>
          </div>`
        return `<div style="font-weight:600;margin-bottom:4px">${d.label}${d.event ? ` · ${d.event}` : ''}</div>`
          + row('Rango bajo',  d.forecastLow,  '#D8DAE8')
          + row('Estadístico', d.statistical, '#242d51')
          + row('Rango alto',  d.forecastHigh, '#D8DAE8')
          + (d.collaborated !== d.statistical ? row('Colaborado', d.collaborated, '#B87D1A') : '')
          + (d.actual !== null ? row('Real',       d.actual,       '#1A7A6E') : '')
      },
    },
    legend: {
      bottom: 0,
      itemWidth: 10,
      itemHeight: 10,
      textStyle: { color: '#8E93AF', fontSize: 11 },
      data: ['Rango de confianza', 'Estadístico', 'Colaborado', 'Real'],
    },
    xAxis: {
      type: 'category',
      data: chartData.map(d => d.label),
      boundaryGap: false,
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
        name: 'low-base',
        type: 'line',
        stack: 'band',
        data: chartData.map(d => d.forecastLow),
        showSymbol: false,
        lineStyle: { opacity: 0 },
        areaStyle: { color: 'transparent' },
        silent: true,
        tooltip: { show: false },
        z: 1,
      },
      {
        name: 'Rango de confianza',
        type: 'line',
        stack: 'band',
        data: chartData.map(d => d.forecastHigh - d.forecastLow),
        showSymbol: false,
        lineStyle: { opacity: 0 },
        areaStyle: { color: 'rgba(36,45,81,0.12)' },
        tooltip: { show: false },
        z: 1,
      },
      {
        name: 'Estadístico',
        type: 'line',
        data: chartData.map(d => d.statistical),
        smooth: 0.25,
        showSymbol: true,
        symbolSize: 6,
        lineStyle: { color: '#242d51', width: 2 },
        itemStyle: { color: '#242d51' },
        z: 3,
      },
      {
        name: 'Colaborado',
        type: 'line',
        data: chartData.map(d => d.collaborated === d.statistical ? null : d.collaborated),
        connectNulls: false,
        showSymbol: true,
        symbolSize: 8,
        symbol: 'diamond',
        lineStyle: { color: '#B87D1A', width: 2, type: 'dashed' },
        itemStyle: { color: '#B87D1A' },
        z: 4,
      },
      {
        name: 'Real',
        type: 'line',
        data: chartData.map(d => d.actual),
        connectNulls: false,
        showSymbol: true,
        symbolSize: 7,
        lineStyle: { color: '#1A7A6E', width: 2 },
        itemStyle: { color: '#1A7A6E' },
        z: 5,
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
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
            Pronóstico con intervalo de confianza — últimos 6 períodos + 3 meses forward
          </div>
          <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-tertiary)' }}>
            <span className="inline-block w-3 h-3 rounded" style={{ background: 'rgba(36,45,81,0.2)' }} />
            Banda = rango del forecast estadístico
          </div>
        </div>

        <ReactECharts option={lineOption} style={{ height: 300 }} notMerge />

        {/* Event chips */}
        <div className="mt-3 flex flex-wrap gap-2">
          {chartData.filter(d => d.event).map(d => (
            <span
              key={d.period}
              className="text-xs px-2.5 py-1 rounded-full font-medium"
              style={{ background: 'rgba(184,125,26,0.1)', color: '#8A5C1F', border: '1px solid rgba(184,125,26,0.25)' }}
            >
              📅 {d.label.replace(' (F)', '')} — {d.event}
            </span>
          ))}
        </div>

        {/* Rango narrative callout */}
        <div className="mt-4 px-4 py-3 rounded-xl flex items-start gap-3" style={{ background: 'rgba(36,45,81,0.06)', border: '1px solid rgba(36,45,81,0.15)' }}>
          <Info size={16} style={{ color: 'var(--brand-navy)', flexShrink: 0, marginTop: 2 }} />
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              El rango — no el número — define tu stock de seguridad.
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
              Abr 2026: pronóstico estadístico {chartData.find(d => d.period === '2026-04')?.statistical.toLocaleString()} cajas, rango entre <b>{chartData.find(d => d.period === '2026-04')?.forecastLow.toLocaleString()}</b> y <b>{chartData.find(d => d.period === '2026-04')?.forecastHigh.toLocaleString()}</b> cajas.
              Si Supply Chain dimensiona sólo al punto medio, una caída de demanda del ~16% deja sobrestock de capital de trabajo; un pico del ~18% genera quiebre.
              El rango le dice a producción cuánto buffer necesita realmente.
            </p>
          </div>
        </div>
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
          Pendiente: colaboración comercial para ajuste por cuentas clave (Walmart, Sam&apos;s, OXXO).
        </p>
      </div>
    </div>
  )
}
