'use client'

import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid } from 'recharts'
import { CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react'

const qualityData = [
  { sku: 'DOL-170-ACE', statMAPE: 29.8, collabMAPE: 25.1, improvement: 4.7, lastActual: 16300, lastStat: 16000, lastCollab: 16800, accepted: true },
  { sku: 'DOL-170-AGU', statMAPE: 27.5, collabMAPE: 22.3, improvement: 5.2, lastActual: 19500, lastStat: 19200, lastCollab: 19200, accepted: true },
  { sku: 'DOL-POUCH-ACE', statMAPE: 31.2, collabMAPE: 26.8, improvement: 4.4, lastActual: 27400, lastStat: 27000, lastCollab: 27000, accepted: true },
  { sku: 'GUA-170-ACE', statMAPE: 34.1, collabMAPE: 28.5, improvement: 5.6, lastActual: 9000, lastStat: 8800, lastCollab: 8800, accepted: true },
  { sku: 'SIR-SARD-425', statMAPE: 25.8, collabMAPE: 21.2, improvement: 4.6, lastActual: 6300, lastStat: 6100, lastCollab: 6100, accepted: true },
]

const radarData = [
  { metric: 'Cobertura SKUs', value: 68 },
  { metric: 'Mejora MAPE', value: 82 },
  { metric: 'Justificaciones', value: 55 },
  { metric: 'Puntualidad', value: 75 },
  { metric: 'Precisión ajuste', value: 79 },
]

export default function Step3Quality() {
  const avgStatMAPE = qualityData.reduce((s, r) => s + r.statMAPE, 0) / qualityData.length
  const avgCollabMAPE = qualityData.reduce((s, r) => s + r.collabMAPE, 0) / qualityData.length
  const avgImprovement = qualityData.reduce((s, r) => s + r.improvement, 0) / qualityData.length

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-50 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-slate-600">{avgStatMAPE.toFixed(1)}%</div>
          <div className="text-sm text-slate-600 mt-1">MAPE estadístico</div>
          <div className="text-xs text-slate-400">Asertividad: {(100 - avgStatMAPE).toFixed(1)}%</div>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-blue-700">{avgCollabMAPE.toFixed(1)}%</div>
          <div className="text-sm text-slate-600 mt-1">MAPE colaborado</div>
          <div className="text-xs text-blue-500">Asertividad: {(100 - avgCollabMAPE).toFixed(1)}%</div>
        </div>
        <div className="bg-emerald-50 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-emerald-600">+{avgImprovement.toFixed(1)}pp</div>
          <div className="text-sm text-slate-600 mt-1">Mejora promedio</div>
          <div className="text-xs text-emerald-600">La colaboración agrega valor</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Comparativo por SKU: Estadístico vs Colaborado (MAPE)</h3>
          <div className="space-y-3">
            {qualityData.map(row => (
              <div key={row.sku} className="bg-slate-50 rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-700">{row.sku}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                      <TrendingUp size={10} /> -{row.improvement.toFixed(1)}pp MAPE
                    </span>
                    {row.accepted
                      ? <CheckCircle2 size={14} className="text-emerald-500" />
                      : <AlertCircle size={14} className="text-amber-500" />
                    }
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <div className="text-xs text-slate-400 mb-1">Estadístico {row.statMAPE}%</div>
                    <div className="bg-slate-200 rounded-full h-2">
                      <div className="bg-slate-400 h-2 rounded-full" style={{ width: `${row.statMAPE}%` }} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-blue-500 mb-1">Colaborado {row.collabMAPE}%</div>
                    <div className="bg-slate-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${row.collabMAPE}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Score calidad de colaboración — Feb 2025</h3>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: '#64748b' }} />
              <Radar name="Score" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={2} />
              <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8, color: '#f8fafc', fontSize: 12 }} formatter={(v) => [`${v}/100`]} />
            </RadarChart>
          </ResponsiveContainer>
          <div className="text-xs text-center text-slate-400 mt-2">Score global: 72/100 · Meta: 80/100</div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-sm text-amber-800">
          <span className="font-semibold">Oportunidades identificadas:</span> Mejorar justificación de ajustes (55/100) y cobertura de SKUs Clase B (solo 52% colaborados).
          La correlación histórica muestra que ajustes justificados tienen 2.3x mejor asertividad que los sin justificación.
        </p>
      </div>
    </div>
  )
}
