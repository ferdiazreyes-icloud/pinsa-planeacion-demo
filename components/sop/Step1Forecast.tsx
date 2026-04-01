'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Forecast, SKUs } from '@/data'

const TOP_SKUS = ['DOL-170-ACE', 'DOL-170-AGU', 'DOL-POUCH-ACE', 'GUA-170-ACE', 'SIR-SARD-425']

const accuracyData = TOP_SKUS.map(skuId => {
  const sku = SKUs.find(s => s.id === skuId)!
  const records = Forecast.filter(f => f.skuId === skuId && f.actual !== null && f.statistical > 0)
  const mape = records.length
    ? records.reduce((sum, r) => sum + Math.abs((r.actual! - r.statistical) / r.actual!) * 100, 0) / records.length
    : 0
  return { sku: sku?.name.replace('Dolores ', 'DOL ').replace('Guardamar ', 'GUA ').replace('La Sirena ', 'SIR '), accuracy: Math.round((100 - mape) * 10) / 10 }
})

const chartData = ['2024-10', '2024-11', '2024-12', '2025-01', '2025-02', '2025-03'].map(period => {
  const label = { '2024-10': 'Oct', '2024-11': 'Nov', '2024-12': 'Dic', '2025-01': 'Ene', '2025-02': 'Feb', '2025-03': 'Mar (F)' }[period]
  const periodRecords = Forecast.filter(f => f.period === period)
  const statistical = periodRecords.reduce((s, r) => s + r.statistical, 0)
  const collaborated = periodRecords.reduce((s, r) => s + (r.collaborated ?? r.statistical), 0)
  const actual = periodRecords.every(r => r.actual !== null) ? periodRecords.reduce((s, r) => s + (r.actual ?? 0), 0) : null
  return { label, statistical, collaborated, actual }
})

export default function Step1Forecast() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-50 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-amber-600">71.2%</div>
          <div className="text-sm text-slate-600 mt-1">Asertividad Feb 2025</div>
          <div className="text-xs text-slate-400 mt-0.5">1 − MAPE promedio portafolio</div>
        </div>
        <div className="bg-slate-50 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-blue-600">+3.1pp</div>
          <div className="text-sm text-slate-600 mt-1">Mejora con colaboración</div>
          <div className="text-xs text-slate-400 mt-0.5">Estadístico 71.2% → Colaborado 74.3%</div>
        </div>
        <div className="bg-slate-50 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-violet-600">-2.4%</div>
          <div className="text-sm text-slate-600 mt-1">Sesgo del pronóstico</div>
          <div className="text-xs text-slate-400 mt-0.5">Ligero sub-pronóstico sistémico</div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Pronóstico estadístico vs colaborado vs real — últimos 6 períodos</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chartData} barSize={14} margin={{ top: 0, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
            <Tooltip
              contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8, color: '#f8fafc', fontSize: 12 }}
              formatter={(v) => [`${Number(v).toLocaleString()} cajas`]}
            />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="statistical" name="Estadístico" fill="#94a3b8" radius={[2, 2, 0, 0]} />
            <Bar dataKey="collaborated" name="Colaborado" fill="#6366f1" radius={[2, 2, 0, 0]} />
            <Bar dataKey="actual" name="Real" fill="#10b981" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Asertividad por SKU — últimos 12 meses</h3>
        <div className="space-y-2.5">
          {accuracyData.map(({ sku, accuracy }) => (
            <div key={sku} className="flex items-center gap-3">
              <span className="text-sm text-slate-600 w-52 flex-shrink-0 truncate">{sku}</span>
              <div className="flex-1 bg-slate-100 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${accuracy >= 75 ? 'bg-emerald-500' : accuracy >= 68 ? 'bg-amber-500' : 'bg-red-400'}`}
                  style={{ width: `${accuracy}%` }}
                />
              </div>
              <span className={`text-sm font-semibold w-14 text-right ${accuracy >= 75 ? 'text-emerald-600' : accuracy >= 68 ? 'text-amber-600' : 'text-red-500'}`}>
                {accuracy}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-800">
          <span className="font-semibold">Pronóstico estadístico Mar 2025 listo.</span> El modelo detecta un pico estacional de +19% por Semana Santa (confirmado históricamente en 2023 y 2024).
          Pendiente: colaboración de ventas para ajuste por clientes clave.
        </p>
      </div>
    </div>
  )
}
