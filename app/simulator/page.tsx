'use client'

import { useState, useMemo, useEffect } from 'react'
import { generateScenarioTimeline, isExtremeScenario } from '@/lib/calculations'
import { formatCurrency } from '@/lib/formatters'
import { loadScenarios, addScenario, deleteScenario, toggleExecutiveSession, type SavedScenario } from '@/lib/scenarios'
import ReactECharts from 'echarts-for-react'
import { RefreshCw, Info, Save, Bookmark, BookmarkCheck, Trash2, GitCompare, Gavel, X } from 'lucide-react'
import TourGuide, { type TourStep } from '@/components/layout/TourGuide'

const SIM_TOUR: TourStep[] = [
  { target: '[data-tour="sim-horizon"]',  title: 'Horizonte de proyección',      desc: 'Elige entre 1, 3, 6 o 12 meses. Las gráficas y métricas se ajustan automáticamente al horizonte seleccionado.',                                 position: 'bottom' },
  { target: '[data-tour="sim-sliders"]',  title: 'Variables del escenario',      desc: 'Mueve los sliders para simular cualquier combinación: alza en materias primas, desabasto, variación de demanda o cambio en política de inventario.', position: 'bottom' },
  { target: '[data-tour="sim-impact"]',   title: 'Impacto en tiempo real',       desc: 'Estas 5 métricas se recalculan instantáneamente: Fill Rate, Capital de trabajo, Revenue en riesgo, Δ COGS y Eficiencia de producción.',             position: 'bottom' },
  { target: '[data-tour="sim-save"]',     title: 'Guardar escenarios',           desc: 'Guarda las variantes que te interesen y compáralas lado a lado. Marca "Para Sesión Ejecutiva" para que aparezcan en la vista de decisión mensual.', position: 'bottom' },
  { target: '[data-tour="sim-fillrate"]', title: 'Fill Rate proyectado',         desc: 'La línea azul es tu escenario. La gris punteada es el baseline sin cambios. La línea verde es la meta del 95%.',                                     position: 'bottom' },
]

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

  const [scenarios, setScenarios] = useState<SavedScenario[]>([])
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [scenarioName, setScenarioName] = useState('')
  const [compareIds, setCompareIds] = useState<string[]>([])
  const [showCompareModal, setShowCompareModal] = useState(false)

  useEffect(() => {
    setScenarios(loadScenarios())
  }, [])

  const scenarioData = useMemo(
    () => generateScenarioTimeline({ rawMaterialPriceChangePct: rawMatChange, supplyDisruptionPct: supplyDisruption, demandChangePct: demandChange, safetyStockDays: safetyStock }, horizon),
    [rawMatChange, supplyDisruption, demandChange, safetyStock, horizon]
  )

  const avgFillRate        = scenarioData.reduce((s, d) => s + d.fillRate, 0) / scenarioData.length
  const avgWC              = scenarioData.reduce((s, d) => s + d.workingCapitalMXN, 0) / scenarioData.length
  const totalRevenueAtRisk = scenarioData.reduce((s, d) => s + d.revenueAtRiskMXN, 0)
  const totalCogsDelta     = scenarioData.reduce((s, d) => s + d.cogsDeltaMXN, 0)
  const avgProductionEfficiency = scenarioData.reduce((s, d) => s + d.productionEfficiency, 0) / scenarioData.length
  const hasChanges         = rawMatChange !== 0 || supplyDisruption !== 0 || demandChange !== 0 || safetyStock !== 33
  const extreme            = isExtremeScenario({ rawMaterialPriceChangePct: rawMatChange, supplyDisruptionPct: supplyDisruption, demandChangePct: demandChange, safetyStockDays: safetyStock })

  const handleSave = () => {
    if (!scenarioName.trim()) return
    const saved = addScenario({
      name: scenarioName.trim(),
      horizon,
      params: { rawMaterialPriceChangePct: rawMatChange, supplyDisruptionPct: supplyDisruption, demandChangePct: demandChange, safetyStockDays: safetyStock },
      metrics: { avgFillRate, avgWC, totalRevenueAtRisk, totalCogsDelta, avgProductionEfficiency },
      forExecutiveSession: false,
    })
    setScenarios(prev => [saved, ...prev])
    setScenarioName('')
    setShowSaveModal(false)
  }

  const handleLoad = (s: SavedScenario) => {
    setHorizon(s.horizon)
    setRawMatChange(s.params.rawMaterialPriceChangePct)
    setSupplyDisruption(s.params.supplyDisruptionPct)
    setDemandChange(s.params.demandChangePct)
    setSafetyStock(s.params.safetyStockDays)
  }

  const handleDelete = (id: string) => {
    deleteScenario(id)
    setScenarios(loadScenarios())
    setCompareIds(prev => prev.filter(x => x !== id))
  }

  const handleToggleExecutive = (id: string) => {
    toggleExecutiveSession(id)
    setScenarios(loadScenarios())
  }

  const toggleCompare = (id: string) => {
    setCompareIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : prev.length >= 2 ? [prev[1], id] : [...prev, id])
  }

  const compareScenarios = scenarios.filter(s => compareIds.includes(s.id))

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
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Simulador de Escenarios</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>Ajusta las variables, guarda escenarios y compáralos lado a lado</p>
        </div>
        <div className="flex items-center gap-2">
          <div data-tour="sim-horizon" className="flex items-center gap-1 p-1 rounded-xl" style={{ background: 'var(--bg-tertiary)' }}>
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
          <button
            data-tour="sim-save"
            onClick={() => setShowSaveModal(true)}
            disabled={!hasChanges}
            className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl font-semibold text-white transition-opacity disabled:opacity-40"
            style={{ background: 'var(--brand-navy)' }}
          >
            <Save size={12} /> Guardar escenario
          </button>
          {compareIds.length >= 2 && (
            <button
              onClick={() => setShowCompareModal(true)}
              className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl font-semibold text-white transition-opacity"
              style={{ background: 'var(--brand-maroon)' }}
            >
              <GitCompare size={12} /> Comparar ({compareIds.length})
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Controls */}
        <div data-tour="sim-sliders" className="ec-card p-6 space-y-7 animate-fade-in-up">
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

          {/* Impact summary — 5 métricas incluyendo Eficiencia producción */}
          <div data-tour="sim-impact" className="pt-1">
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
                  label: 'Eficiencia producción',
                  value: `${avgProductionEfficiency.toFixed(1)}%`,
                  color: avgProductionEfficiency >= 85 ? 'var(--positive)' : avgProductionEfficiency >= 70 ? 'var(--warning)' : 'var(--negative)',
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

          {extreme && (
            <div
              data-testid="extreme-warning"
              className="flex items-start gap-3 p-4 rounded-xl animate-fade-in-up"
              style={{ background: 'rgba(155,28,74,0.07)', border: '1px solid rgba(155,28,74,0.3)' }}
            >
              <span style={{ color: '#9B1C4A', fontSize: 18, flexShrink: 0 }}>⚠</span>
              <div>
                <div className="text-sm font-bold" style={{ color: '#9B1C4A' }}>Valor fuera de rangos aceptables</div>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                  La combinación de desabasto &gt;60% con demanda &gt;+30% excede los parámetros del modelo.
                  Los resultados pueden no ser representativos de un escenario real.
                </p>
              </div>
            </div>
          )}

          <div data-tour="sim-fillrate" className="ec-card p-5 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <div className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Fill Rate proyectado vs baseline</div>
            <ReactECharts option={fillRateOption} style={{ height: 210 }} notMerge />
          </div>

          <div data-tour="sim-wc" className="ec-card p-5 animate-fade-in-up" style={{ animationDelay: '160ms' }}>
            <div className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Capital de trabajo proyectado</div>
            <ReactECharts option={wcOption} style={{ height: 210 }} notMerge />
          </div>

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
                {avgProductionEfficiency < 75 && `Eficiencia de producción cae a ${avgProductionEfficiency.toFixed(0)}% — líneas subutilizadas. `}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Escenarios guardados */}
      {scenarios.length > 0 && (
        <div className="mt-7 ec-card p-5 animate-fade-in-up">
          <div className="flex items-center gap-2 mb-4">
            <Bookmark size={15} style={{ color: 'var(--brand-navy)' }} />
            <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
              Escenarios guardados ({scenarios.length})
            </span>
            <span className="text-xs ml-2" style={{ color: 'var(--text-tertiary)' }}>
              Marca 2 para comparar · usa el ícono de martillo para llevar a Sesión Ejecutiva
            </span>
          </div>
          <div className="space-y-2">
            {scenarios.map(s => {
              const checked = compareIds.includes(s.id)
              return (
                <div
                  key={s.id}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
                  style={{
                    background: checked ? 'rgba(96,27,77,0.06)' : 'var(--bg-tertiary)',
                    border: `1px solid ${checked ? 'rgba(96,27,77,0.25)' : 'transparent'}`,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleCompare(s.id)}
                    className="flex-shrink-0"
                    style={{ accentColor: '#601b4d' }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{s.name}</div>
                    <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      {s.horizon}m · MP {s.params.rawMaterialPriceChangePct >= 0 ? '+' : ''}{s.params.rawMaterialPriceChangePct}% · Desabasto {s.params.supplyDisruptionPct}% · Demanda {s.params.demandChangePct >= 0 ? '+' : ''}{s.params.demandChangePct}% · Stock {s.params.safetyStockDays}d
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 text-xs">
                    <span style={{ color: s.metrics.avgFillRate >= 90 ? 'var(--positive)' : 'var(--negative)', fontWeight: 700 }}>
                      FR {s.metrics.avgFillRate.toFixed(1)}%
                    </span>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      WC {formatCurrency(s.metrics.avgWC, true)}
                    </span>
                    <span style={{ color: s.metrics.avgProductionEfficiency >= 80 ? 'var(--positive)' : 'var(--warning)' }}>
                      Ef {s.metrics.avgProductionEfficiency.toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => handleLoad(s)}
                      className="text-xs px-2 py-1 rounded-md transition-colors"
                      style={{ color: 'var(--brand-navy)', background: 'rgba(36,45,81,0.08)' }}
                    >
                      Cargar
                    </button>
                    <button
                      onClick={() => handleToggleExecutive(s.id)}
                      title={s.forExecutiveSession ? 'Quitar de Sesión Ejecutiva' : 'Enviar a Sesión Ejecutiva'}
                      className="p-1.5 rounded-md transition-colors"
                      style={{ color: s.forExecutiveSession ? '#601b4d' : 'var(--text-tertiary)', background: s.forExecutiveSession ? 'rgba(96,27,77,0.1)' : 'transparent' }}
                    >
                      {s.forExecutiveSession ? <BookmarkCheck size={14} /> : <Gavel size={14} />}
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      title="Borrar"
                      className="p-1.5 rounded-md transition-colors hover:bg-red-50"
                      style={{ color: 'var(--negative)' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Save modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4" style={{ background: 'rgba(15,26,59,0.5)' }}>
          <div className="rounded-2xl p-6 w-full max-w-md" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}>
            <div className="text-sm font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Guardar escenario</div>
            <p className="text-xs mb-4" style={{ color: 'var(--text-tertiary)' }}>
              Asígnale un nombre descriptivo. Podrás cargarlo de nuevo y compararlo con otros.
            </p>
            <input
              type="text"
              value={scenarioName}
              autoFocus
              onChange={e => setScenarioName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              placeholder="ej. Alza 20% atún · demanda +15% Semana Santa"
              className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none mb-4"
              style={{ border: '1px solid var(--border-primary)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowSaveModal(false)}
                className="text-xs px-4 py-2 rounded-lg"
                style={{ color: 'var(--text-secondary)', border: '1px solid var(--border-primary)' }}
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={!scenarioName.trim()}
                className="text-xs px-4 py-2 rounded-lg font-semibold text-white disabled:opacity-40"
                style={{ background: 'var(--brand-navy)' }}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Compare modal */}
      {showCompareModal && compareScenarios.length >= 2 && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4" style={{ background: 'rgba(15,26,59,0.5)' }}>
          <div className="rounded-2xl p-6 w-full max-w-3xl max-h-[85vh] overflow-auto" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Comparación de escenarios</div>
              <button onClick={() => setShowCompareModal(false)} className="p-1.5 rounded-lg" style={{ color: 'var(--text-tertiary)' }}>
                <X size={14} />
              </button>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs" style={{ color: 'var(--text-tertiary)', borderBottom: '1px solid var(--border-primary)' }}>
                  <th className="text-left py-2">Métrica</th>
                  {compareScenarios.map(s => (
                    <th key={s.id} className="text-right py-2 px-3 font-semibold" style={{ color: 'var(--brand-navy)' }}>{s.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-xs">
                {[
                  { label: 'Horizonte',          fmt: (s: SavedScenario) => `${s.horizon} meses` },
                  { label: 'Δ Precio MP',        fmt: (s: SavedScenario) => `${s.params.rawMaterialPriceChangePct >= 0 ? '+' : ''}${s.params.rawMaterialPriceChangePct}%` },
                  { label: 'Desabasto',          fmt: (s: SavedScenario) => `${s.params.supplyDisruptionPct}%` },
                  { label: 'Δ Demanda',          fmt: (s: SavedScenario) => `${s.params.demandChangePct >= 0 ? '+' : ''}${s.params.demandChangePct}%` },
                  { label: 'Stock seguridad',    fmt: (s: SavedScenario) => `${s.params.safetyStockDays}d` },
                  { label: 'Fill Rate promedio', fmt: (s: SavedScenario) => `${s.metrics.avgFillRate.toFixed(1)}%` },
                  { label: 'Capital trabajo',    fmt: (s: SavedScenario) => formatCurrency(s.metrics.avgWC, true) },
                  { label: 'Eficiencia prod.',   fmt: (s: SavedScenario) => `${s.metrics.avgProductionEfficiency.toFixed(1)}%` },
                  { label: 'Revenue en riesgo',  fmt: (s: SavedScenario) => formatCurrency(s.metrics.totalRevenueAtRisk, true) },
                  { label: 'Δ COGS',             fmt: (s: SavedScenario) => `${s.metrics.totalCogsDelta > 0 ? '+' : ''}${formatCurrency(s.metrics.totalCogsDelta, true)}` },
                ].map(({ label, fmt }) => (
                  <tr key={label} style={{ borderBottom: '1px solid var(--border-primary)' }}>
                    <td className="py-2 font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</td>
                    {compareScenarios.map(s => (
                      <td key={s.id} className="text-right py-2 px-3" style={{ color: 'var(--text-primary)' }}>{fmt(s)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <TourGuide
        steps={SIM_TOUR}
        storageKey="pinsa-tour-simulator"
        welcomeTitle="Simulador de Escenarios"
        welcomeDesc="Ajusta las 4 variables, guarda escenarios y compáralos. Los marcados con martillo van a la Sesión Ejecutiva."
      />
    </div>
  )
}
