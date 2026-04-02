'use client'

import { useState, useMemo } from 'react'
import { generateScenarioTimeline } from '@/lib/calculations'
import { formatCurrency } from '@/lib/formatters'
import ReactECharts from 'echarts-for-react'
import { RefreshCw, Info } from 'lucide-react'

const HORIZON_OPTIONS = [
  { label: '1 mes', months: 1 },
  { label: '3 meses', months: 3 },
  { label: '6 meses', months: 6 },
  { label: '12 meses', months: 12 },
]

type SliderProps = {
  label: string
  description: string
  value: number
  min: number
  max: number
  step: number
  format: (v: number) => string
  onChange: (v: number) => void
  accentColor: string
}

function ScenarioSlider({ label, description, value, min, max, step, format, onChange, accentColor }: SliderProps) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{label}</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{description}</div>
        </div>
        <span className="text-lg font-black ml-4 flex-shrink-0" style={{ color: accentColor }}>{format(value)}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ accentColor }}
      />
      <div className="flex justify-between text-xs" style={{ color: 'var(--text-tertiary)' }}>
        <span>{format(min)}</span><span>{format(max)}</span>
      </div>
    </div>
  )
}

export default function SimulatorPage() {
  const [horizon, setHorizon]               = useState(3)
  const [rawMatChange, setRawMatChange]     = useState(0)
  const [supplyDisruption, setSupplyDisruption] = useState(0)
  const [demandChange, setDemandChange]     = useState(0)
  const [safetyStock, setSafetyStock]       = useState(33)

  const scenarioData = useMemo(
    () => generateScenarioTimeline({ rawMaterialPriceChangePct: rawMatChange, supplyDisruptionPct: supplyDisruption, demandChangePct: demandChange, safetyStockDays: safetyStock }, horizon),
    [rawMatChange, supplyDisruption, demandChange, safetyStock, horizon]
  )

  const avgFillRate        = scenarioData.reduce((s, d) => s + d.fillRate, 0) / scenarioData.length
  const avgWC              = scenarioData.reduce((s, d) => s + d.workingCapitalMXN, 0) / scenarioData.length
  const totalRevenueAtRisk = scenarioData.reduce((s, d) => s + d.revenueAtRiskMXN, 0)
  const totalCogsDelta     = scenarioData.reduce((s, d) => s + d.cogsDeltaMXN, 0)
  const hasChanges         = rawMatChange !== 0 || supplyDisruption !== 0 || demandChange !== 0 || safetyStock !== 33

  const fillRateOption = {
    grid: { top: 12, right: 44, bottom: 20, left: 8, containLabel: true },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255,255,255,0.97)',
      borderColor: '#D8DAE8',
      borderWidth: 1,
      textStyle: { color: '#3D4466', fontSize: 11 },
      formatter: (params: { seriesName: string; value: number; name: string }[]) =>
        `<span style="font-weight:600;color:#3D4466">${params[0]?.name ?? ''}</span><br/>` +
        params.map(p => `${p.seriesName}: <b>${Number(p.value).toFixed(1)}%</b>`).join('<br/>'),
    },
    legend: { bottom: 0, itemWidth: 10, itemHeight: 10, textStyle: { color: '#8E93AF', fontSize: 11 } },
    xAxis: {
      type: 'category',
      data: scenarioData.map(d => d.label),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#8E93AF', fontSize: 10 },
    },
    yAxis: {
      type: 'value',
      min: 75, max: 100,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#ECEDF3', type: 'dashed' } },
      axisLabel: { color: '#8E93AF', fontSize: 10, formatter: (v: number) => `${v}%` },
    },
    series: [
      {
        name: 'Baseline',
        type: 'line',
        data: scenarioData.map(d => d.baselineFillRate),
        smooth: 0.3,
        symbol: 'none',
        lineStyle: { color: '#acacac', width: 1.5, type: 'dashed' },
        markLine: {
          silent: true,
          symbol: 'none',
          data: [{ yAxis: 95, label: { color: '#1A7A6E', fontSize: 10, position: 'end', formatter: '95%' }, lineStyle: { color: '#1A7A6E', type: 'dashed', width: 1.5 } }],
        },
      },
      {
        name: 'Escenario',
        type: 'line',
        data: scenarioData.map(d => d.fillRate),
        smooth: 0.3,
        symbol: 'circle',
        symbolSize: 7,
        lineStyle: { color: '#242d51', width: 2.5 },
        itemStyle: { color: '#242d51', borderWidth: 2, borderColor: '#fff' },
      },
    ],
  }

  const wcOption = {
    grid: { top: 12, right: 56, bottom: 20, left: 8, containLabel: true },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255,255,255,0.97)',
      borderColor: '#D8DAE8',
      borderWidth: 1,
      textStyle: { color: '#3D4466', fontSize: 11 },
      formatter: (params: { seriesName: string; value: number; name: string }[]) =>
        `<span style="font-weight:600;color:#3D4466">${params[0]?.name ?? ''}</span><br/>` +
        params.map(p => `${p.seriesName}: <b>$${(p.value / 1e6).toFixed(1)}M</b>`).join('<br/>'),
    },
    legend: { bottom: 0, itemWidth: 10, itemHeight: 10, textStyle: { color: '#8E93AF', fontSize: 11 } },
    xAxis: {
      type: 'category',
      data: scenarioData.map(d => d.label),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#8E93AF', fontSize: 10 },
    },
    yAxis: {
      type: 'value',
      min: 220e6, max: 400e6,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#ECEDF3', type: 'dashed' } },
      axisLabel: { color: '#8E93AF', fontSize: 10, formatter: (v: number) => `$${(v / 1e6).toFixed(0)}M` },
    },
    series: [
      {
        name: 'Baseline',
        type: 'line',
        data: scenarioData.map(d => d.baselineWC),
        smooth: 0.3,
        symbol: 'none',
        lineStyle: { color: '#acacac', width: 1.5, type: 'dashed' },
        areaStyle: { color: 'rgba(172,172,172,0.06)' },
        markLine: {
          silent: true,
          symbol: 'none',
          data: [{ yAxis: 280e6, label: { color: '#1A7A6E', fontSize: 10, position: 'end', formatter: '$280M' }, lineStyle: { color: '#1A7A6E', type: 'dashed', width: 1.5 } }],
        },
      },
      {
        name: 'Escenario',
        type: 'line',
        data: scenarioData.map(d => d.workingCapitalMXN),
        smooth: 0.3,
        symbol: 'circle',
        symbolSize: 7,
        lineStyle: { color: '#B87D1A', width: 2.5 },
        itemStyle: { color: '#B87D1A', borderWidth: 2, borderColor: '#fff' },
        areaStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(184,125,26,0.18)' },
              { offset: 1, color: 'rgba(184,125,26,0)' },
            ],
          },
        },
      },
    ],
  }

  return (
    <div className="px-8 py-7 max-w-screen-xl">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Simulador de Escenarios</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>Ajusta las variables y ve el impacto en tiempo real</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: 'var(--bg-tertiary)' }}>
            {HORIZON_OPTIONS.map(opt => (
              <button
                key={opt.months}
                onClick={() => setHorizon(opt.months)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={{
                  background: horizon === opt.months ? 'var(--bg-secondary)' : 'transparent',
                  color: horizon === opt.months ? 'var(--text-primary)' : 'var(--text-tertiary)',
                  boxShadow: horizon === opt.months ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {hasChanges && (
            <button
              onClick={() => { setRawMatChange(0); setSupplyDisruption(0); setDemandChange(0); setSafetyStock(33) }}
              className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl transition-colors"
              style={{ border: '1px solid var(--border-primary)', color: 'var(--text-secondary)', background: 'var(--bg-secondary)' }}
            >
              <RefreshCw size={12} /> Reset
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Controls */}
        <div className="ec-card p-6 space-y-7 animate-fade-in-up">
          <div className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-tertiary)' }}>
            Variables del escenario
          </div>

          <ScenarioSlider
            label="Precio materia prima"
            description="Variación vs precio actual"
            value={rawMatChange} min={-30} max={50} step={1}
            format={v => `${v > 0 ? '+' : ''}${v}%`}
            onChange={setRawMatChange}
            accentColor={rawMatChange > 0 ? 'var(--negative)' : rawMatChange < 0 ? 'var(--positive)' : 'var(--text-tertiary)'}
          />
          <ScenarioSlider
            label="Desabasto de MP"
            description="% del abasto en riesgo"
            value={supplyDisruption} min={0} max={80} step={5}
            format={v => `${v}%`}
            onChange={setSupplyDisruption}
            accentColor={supplyDisruption > 30 ? 'var(--negative)' : supplyDisruption > 10 ? 'var(--warning)' : 'var(--text-tertiary)'}
          />
          <ScenarioSlider
            label="Variación de demanda"
            description="vs pronóstico base"
            value={demandChange} min={-30} max={50} step={1}
            format={v => `${v > 0 ? '+' : ''}${v}%`}
            onChange={setDemandChange}
            accentColor={demandChange >= 0 ? 'var(--brand-navy)' : 'var(--warning)'}
          />
          <ScenarioSlider
            label="Stock de seguridad"
            description="Días de cobertura mínima"
            value={safetyStock} min={15} max={90} step={5}
            format={v => `${v}d`}
            onChange={setSafetyStock}
            accentColor={safetyStock > 60 ? 'var(--warning)' : safetyStock < 20 ? 'var(--negative)' : 'var(--brand-teal)'}
          />

          {/* Impact summary */}
          <div className="pt-1">
            <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-tertiary)' }}>
              Impacto del escenario
            </div>
            <div className="space-y-2.5">
              {[
                {
                  label: 'Fill Rate promedio',
                  value: `${avgFillRate.toFixed(1)}%`,
                  color: avgFillRate >= 93 ? 'var(--positive)' : avgFillRate >= 88 ? 'var(--warning)' : 'var(--negative)',
                },
                {
                  label: 'Capital de trabajo',
                  value: formatCurrency(avgWC, true),
                  color: 'var(--text-primary)',
                },
                {
                  label: 'Revenue en riesgo',
                  value: totalRevenueAtRisk > 0 ? `-${formatCurrency(totalRevenueAtRisk, true)}` : '$0',
                  color: totalRevenueAtRisk > 0 ? 'var(--negative)' : 'var(--positive)',
                },
                {
                  label: 'Δ COGS materiales',
                  value: `${totalCogsDelta > 0 ? '+' : ''}${formatCurrency(totalCogsDelta, true)}`,
                  color: totalCogsDelta > 0 ? 'var(--negative)' : 'var(--positive)',
                },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{label}</span>
                  <span className="text-sm font-bold" style={{ color }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="lg:col-span-2 space-y-5">

          {/* Fill Rate */}
          <div className="ec-card p-5 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <div className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Fill Rate proyectado vs baseline</div>
            <ReactECharts option={fillRateOption} style={{ height: 210 }} notMerge />
          </div>

          {/* Working Capital */}
          <div className="ec-card p-5 animate-fade-in-up" style={{ animationDelay: '160ms' }}>
            <div className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Capital de trabajo proyectado</div>
            <ReactECharts option={wcOption} style={{ height: 210 }} notMerge />
          </div>

          {/* Narrative */}
          {hasChanges && (
            <div
              className="flex items-start gap-3 p-4 rounded-xl animate-fade-in-up"
              style={{ background: 'rgba(36,45,81,0.06)', border: '1px solid rgba(36,45,81,0.12)', animationDelay: '220ms' }}
            >
              <Info size={15} style={{ color: 'var(--brand-navy)', flexShrink: 0, marginTop: 1 }} />
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Interpretación: </span>
                {supplyDisruption > 20 && `Con ${supplyDisruption}% de desabasto el fill rate cae a ~${avgFillRate.toFixed(0)}%, generando ~${formatCurrency(totalRevenueAtRisk, true)} en ventas perdidas. `}
                {rawMatChange > 10 && `Alza de ${rawMatChange}% en MP incrementa COGS en ${formatCurrency(Math.abs(totalCogsDelta), true)} adicionales. `}
                {demandChange > 15 && `Incremento de demanda ${demandChange}% requiere mayor capital de trabajo (${formatCurrency(avgWC, true)} promedio). `}
                {safetyStock > 50 && `Aumentar stock de seguridad a ${safetyStock} días reduce riesgo de quiebre pero inmoviliza capital adicional. `}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
