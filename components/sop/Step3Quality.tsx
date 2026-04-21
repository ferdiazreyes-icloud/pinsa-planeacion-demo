'use client'

import ReactECharts from 'echarts-for-react'
import { CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react'

const qualityData = [
  { sku: 'DOL-170-ACE', statMAPE: 29.8, collabMAPE: 25.1, improvement: 4.7, accepted: true },
  { sku: 'DOL-170-AGU', statMAPE: 27.5, collabMAPE: 22.3, improvement: 5.2, accepted: true },
  { sku: 'POR-POUCH-ACE', statMAPE: 31.2, collabMAPE: 26.8, improvement: 4.4, accepted: true },
  { sku: 'MAZ-170-ACE', statMAPE: 34.1, collabMAPE: 28.5, improvement: 5.6, accepted: true },
  { sku: 'ELD-SARD-JIT-425', statMAPE: 25.8, collabMAPE: 21.2, improvement: 4.6, accepted: true },
]

const radarData = [
  { metric: 'Cobertura SKUs', value: 68 },
  { metric: 'Mejora MAPE', value: 82 },
  { metric: 'Justificaciones', value: 55 },
  { metric: 'Puntualidad', value: 75 },
  { metric: 'Precisión ajuste', value: 79 },
]

export default function Step3Quality() {
  const avgStatMAPE   = qualityData.reduce((s, r) => s + r.statMAPE, 0) / qualityData.length
  const avgCollabMAPE = qualityData.reduce((s, r) => s + r.collabMAPE, 0) / qualityData.length
  const avgImprovement= qualityData.reduce((s, r) => s + r.improvement, 0) / qualityData.length

  const radarOption = {
    tooltip: {
      backgroundColor: 'rgba(255,255,255,0.97)',
      borderColor: '#D8DAE8',
      borderWidth: 1,
      textStyle: { color: '#3D4466', fontSize: 11 },
      formatter: (params: { name: string; value: number[] }) => {
        if (!params.value) return ''
        return radarData.map((d, i) =>
          `${d.metric}: <b>${params.value[i]}/100</b>`
        ).join('<br/>')
      },
    },
    radar: {
      indicator: radarData.map(d => ({ name: d.metric, max: 100 })),
      splitNumber: 4,
      axisName: { color: '#8E93AF', fontSize: 11 },
      splitLine: { lineStyle: { color: '#D8DAE8' } },
      splitArea: { areaStyle: { color: ['rgba(236,237,243,0.5)', 'rgba(255,255,255,0)'] } },
      axisLine: { lineStyle: { color: '#D8DAE8' } },
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: radarData.map(d => d.value),
            name: 'Score',
            areaStyle: { color: 'rgba(36,45,81,0.12)' },
            lineStyle: { color: '#242d51', width: 2 },
            itemStyle: { color: '#242d51' },
            symbol: 'circle',
            symbolSize: 5,
          },
        ],
      },
    ],
  }

  return (
    <div className="space-y-7">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { value: `${avgStatMAPE.toFixed(1)}%`,    label: 'MAPE estadístico',  sub: `Asertividad: ${(100-avgStatMAPE).toFixed(1)}%`,   color: 'var(--text-secondary)',  bg: 'var(--bg-tertiary)' },
          { value: `${avgCollabMAPE.toFixed(1)}%`,  label: 'MAPE colaborado',   sub: `Asertividad: ${(100-avgCollabMAPE).toFixed(1)}%`,  color: 'var(--brand-navy)',      bg: 'rgba(36,45,81,0.06)' },
          { value: `+${avgImprovement.toFixed(1)}pp`,label:'Mejora promedio',   sub: 'La colaboración agrega valor',                     color: 'var(--positive)',        bg: 'rgba(26,122,110,0.06)' },
        ].map(({ value, label, sub, color, bg }) => (
          <div key={label} className="rounded-xl p-4 text-center" style={{ background: bg }}>
            <div className="text-3xl font-black" style={{ color }}>{value}</div>
            <div className="text-sm mt-1 font-semibold" style={{ color: 'var(--text-primary)' }}>{label}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="text-sm font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Comparativo por SKU: Estadístico vs Colaborado (MAPE)</div>
          <div className="space-y-3">
            {qualityData.map(row => (
              <div key={row.sku} className="rounded-xl p-3" style={{ background: 'var(--bg-tertiary)' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{row.sku}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-medium flex items-center gap-1" style={{ color: 'var(--positive)' }}>
                      <TrendingUp size={10} /> -{row.improvement.toFixed(1)}pp
                    </span>
                    {row.accepted
                      ? <CheckCircle2 size={14} style={{ color: 'var(--positive)' }} />
                      : <AlertCircle size={14} style={{ color: 'var(--warning)' }} />
                    }
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <div className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>Estadístico {row.statMAPE}%</div>
                    <div className="rounded-full h-1.5" style={{ background: 'var(--border-primary)' }}>
                      <div className="h-1.5 rounded-full" style={{ width: `${row.statMAPE}%`, background: 'var(--brand-silver)' }} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs mb-1" style={{ color: 'var(--brand-navy)' }}>Colaborado {row.collabMAPE}%</div>
                    <div className="rounded-full h-1.5" style={{ background: 'var(--border-primary)' }}>
                      <div className="h-1.5 rounded-full" style={{ width: `${row.collabMAPE}%`, background: 'var(--brand-navy)' }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="text-sm font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Score calidad de colaboración — Mar 2026</div>
          <ReactECharts option={radarOption} style={{ height: 260 }} notMerge />
          <div className="text-xs text-center -mt-2" style={{ color: 'var(--text-tertiary)' }}>Score global: 72/100 · Meta: 80/100</div>
        </div>
      </div>

      <div className="px-4 py-3 rounded-xl" style={{ background: 'rgba(184,125,26,0.06)', border: '1px solid rgba(184,125,26,0.2)' }}>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Oportunidades identificadas:</span>{' '}
          Mejorar justificación de ajustes (55/100) y cobertura de SKUs Clase B (solo 52% colaborados).
          La correlación histórica muestra que ajustes justificados tienen 2.3x mejor asertividad.
        </p>
      </div>
    </div>
  )
}
