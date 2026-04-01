'use client'

import { useState, useMemo } from 'react'
import { generateScenarioTimeline } from '@/lib/calculations'
import { formatCurrency } from '@/lib/formatters'
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Legend
} from 'recharts'
import { Sliders, RefreshCw, Info } from 'lucide-react'

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
  color: string
}

function ScenarioSlider({ label, description, value, min, max, step, format, onChange, color }: SliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-slate-700">{label}</div>
          <div className="text-xs text-slate-400">{description}</div>
        </div>
        <span className={`text-lg font-bold ${color}`}>{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-600"
      />
      <div className="flex justify-between text-xs text-slate-400">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  )
}

export default function SimulatorPage() {
  const [horizon, setHorizon] = useState(3)
  const [rawMatChange, setRawMatChange] = useState(0)
  const [supplyDisruption, setSupplyDisruption] = useState(0)
  const [demandChange, setDemandChange] = useState(0)
  const [safetyStock, setSafetyStock] = useState(33)

  const scenarioData = useMemo(
    () => generateScenarioTimeline({ rawMaterialPriceChangePct: rawMatChange, supplyDisruptionPct: supplyDisruption, demandChangePct: demandChange, safetyStockDays: safetyStock }, horizon),
    [rawMatChange, supplyDisruption, demandChange, safetyStock, horizon]
  )

  const avgFillRate = scenarioData.reduce((s, d) => s + d.fillRate, 0) / scenarioData.length
  const avgWC = scenarioData.reduce((s, d) => s + d.workingCapitalMXN, 0) / scenarioData.length
  const totalRevenueAtRisk = scenarioData.reduce((s, d) => s + d.revenueAtRiskMXN, 0)
  const totalCogsDelta = scenarioData.reduce((s, d) => s + d.cogsDeltaMXN, 0)

  const hasChanges = rawMatChange !== 0 || supplyDisruption !== 0 || demandChange !== 0 || safetyStock !== 33

  const handleReset = () => {
    setRawMatChange(0)
    setSupplyDisruption(0)
    setDemandChange(0)
    setSafetyStock(33)
  }

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Simulador de Escenarios</h1>
          <p className="text-slate-500 text-sm mt-1">Ajusta las variables y ve el impacto en tiempo real</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
            {HORIZON_OPTIONS.map(opt => (
              <button
                key={opt.months}
                onClick={() => setHorizon(opt.months)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${horizon === opt.months ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {hasChanges && (
            <button onClick={handleReset} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 px-3 py-2 border border-slate-200 rounded-xl hover:bg-slate-50">
              <RefreshCw size={13} /> Reset
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-8">
          <div className="flex items-center gap-2 text-slate-700 font-semibold">
            <Sliders size={16} />
            Variables del escenario
          </div>

          <ScenarioSlider
            label="Precio materia prima"
            description="Variación vs precio actual (atún, aceite, hojalata)"
            value={rawMatChange}
            min={-30}
            max={50}
            step={1}
            format={v => `${v > 0 ? '+' : ''}${v}%`}
            onChange={setRawMatChange}
            color={rawMatChange > 0 ? 'text-red-500' : rawMatChange < 0 ? 'text-emerald-600' : 'text-slate-400'}
          />

          <ScenarioSlider
            label="Desabasto de materia prima"
            description="% del abasto en riesgo (veda, proveedor, aranceles)"
            value={supplyDisruption}
            min={0}
            max={80}
            step={5}
            format={v => `${v}%`}
            onChange={setSupplyDisruption}
            color={supplyDisruption > 30 ? 'text-red-500' : supplyDisruption > 10 ? 'text-amber-600' : 'text-slate-400'}
          />

          <ScenarioSlider
            label="Variación de demanda"
            description="Cambio vs pronóstico base (estacionalidad, promo, etc.)"
            value={demandChange}
            min={-30}
            max={50}
            step={1}
            format={v => `${v > 0 ? '+' : ''}${v}%`}
            onChange={setDemandChange}
            color={demandChange > 0 ? 'text-blue-600' : demandChange < 0 ? 'text-amber-600' : 'text-slate-400'}
          />

          <ScenarioSlider
            label="Política de inventario de seguridad"
            description="Días de cobertura mínima requerida"
            value={safetyStock}
            min={15}
            max={90}
            step={5}
            format={v => `${v} días`}
            onChange={setSafetyStock}
            color={safetyStock > 60 ? 'text-amber-600' : safetyStock < 20 ? 'text-red-500' : 'text-slate-600'}
          />

          {/* Scenario summary */}
          <div className="bg-slate-50 rounded-xl p-4 space-y-3">
            <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Impacto del escenario</div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Fill Rate promedio</span>
                <span className={`font-semibold ${avgFillRate >= 93 ? 'text-emerald-600' : avgFillRate >= 88 ? 'text-amber-600' : 'text-red-500'}`}>
                  {avgFillRate.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Capital de trabajo prom.</span>
                <span className="font-semibold text-slate-800">{formatCurrency(avgWC, true)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Revenue en riesgo</span>
                <span className={`font-semibold ${totalRevenueAtRisk > 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                  {totalRevenueAtRisk > 0 ? `-${formatCurrency(totalRevenueAtRisk, true)}` : '$0'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Δ COGS materiales</span>
                <span className={`font-semibold ${totalCogsDelta > 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                  {totalCogsDelta > 0 ? '+' : ''}{formatCurrency(totalCogsDelta, true)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="lg:col-span-2 space-y-5">
          {/* Fill Rate */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Fill Rate proyectado vs baseline</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={scenarioData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis domain={[75, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8, color: '#f8fafc', fontSize: 12 }} formatter={(v) => [`${Number(v).toFixed(1)}%`]} />
                <ReferenceLine y={95} stroke="#10b981" strokeDasharray="4 4" label={{ value: 'Meta 95%', fill: '#10b981', fontSize: 10, position: 'right' }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="baselineFillRate" name="Baseline" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
                <Line type="monotone" dataKey="fillRate" name="Escenario" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4, fill: '#3b82f6' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Working Capital */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Capital de trabajo proyectado</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={scenarioData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="wcScenGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="wcBaseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis
                  domain={[220_000_000, 400_000_000]}
                  tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false}
                  tickFormatter={v => `$${(v / 1_000_000).toFixed(0)}M`}
                />
                <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8, color: '#f8fafc', fontSize: 12 }} formatter={(v) => [`$${(Number(v) / 1_000_000).toFixed(1)}M`]} />
                <ReferenceLine y={280_000_000} stroke="#10b981" strokeDasharray="4 4" label={{ value: 'Meta $280M', fill: '#10b981', fontSize: 10, position: 'right' }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="baselineWC" name="Baseline" stroke="#94a3b8" fill="url(#wcBaseGrad)" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
                <Area type="monotone" dataKey="workingCapitalMXN" name="Escenario" stroke="#f59e0b" fill="url(#wcScenGrad)" strokeWidth={2.5} dot={{ r: 4, fill: '#f59e0b' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Scenario description */}
          {hasChanges && (
            <div className="bg-slate-800 text-white rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <Info size={16} className="text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm leading-relaxed text-slate-200">
                  <span className="text-white font-semibold">Interpretación del escenario:</span>{' '}
                  {supplyDisruption > 20 && `Con un ${supplyDisruption}% de desabasto, el fill rate cae a ~${avgFillRate.toFixed(0)}%, generando ~${formatCurrency(totalRevenueAtRisk, true)} en ventas perdidas. `}
                  {rawMatChange > 10 && `El alza de ${rawMatChange}% en MP incrementa COGS en ${formatCurrency(Math.abs(totalCogsDelta), true)} adicionales. `}
                  {demandChange > 15 && `El incremento de demanda de ${demandChange}% requiere mayor capital de trabajo (${formatCurrency(avgWC, true)} promedio). `}
                  {safetyStock > 50 && `Aumentar el stock de seguridad a ${safetyStock} días inmoviliza capital adicional pero reduce riesgo de desabasto. `}
                  {!supplyDisruption && !rawMatChange && demandChange <= 0 && safetyStock <= 45 && 'Ajusta las variables para ver el impacto en fill rate y capital de trabajo.'}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
