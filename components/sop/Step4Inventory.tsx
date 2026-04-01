'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts'
import { AlertTriangle, CheckCircle2, Package } from 'lucide-react'

const inventoryPlan = [
  { sku: 'DOL-170-ACE', demand: 20800, currentStock: 44200, safetyDays: 35, daysOfCover: 27, replenishment: 19500, status: 'warning' as const, statusNote: 'Por debajo del mínimo post-Semana Santa' },
  { sku: 'DOL-170-AGU', demand: 25000, currentStock: 52400, safetyDays: 35, daysOfCover: 25, replenishment: 22000, status: 'warning' as const, statusNote: 'Ajustar orden de compra +10%' },
  { sku: 'DOL-POUCH-ACE', demand: 35000, currentStock: 65800, safetyDays: 32, daysOfCover: 22, replenishment: 32000, status: 'critical' as const, statusNote: 'Inventario crítico — priorizar producción' },
  { sku: 'GUA-170-ACE', demand: 11200, currentStock: 20800, safetyDays: 35, daysOfCover: 19, replenishment: 11000, status: 'critical' as const, statusNote: 'Riesgo desabasto post-veda hojalata' },
  { sku: 'SIR-SARD-425', demand: 8000, currentStock: 14900, safetyDays: 38, daysOfCover: 21, replenishment: 8000, status: 'warning' as const, statusNote: 'Cobertura justa para temporada' },
]

const chartData = inventoryPlan.map(row => ({
  sku: row.sku.replace('DOL-', '').replace('GUA-', 'GUA-').replace('SIR-', 'SIR-'),
  daysOfCover: row.daysOfCover,
  status: row.status,
}))

export default function Step4Inventory() {
  const totalReplenishment = inventoryPlan.reduce((s, r) => s + r.replenishment, 0)
  const avgDOC = Math.round(inventoryPlan.reduce((s, r) => s + r.daysOfCover, 0) / inventoryPlan.length)

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-50 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-amber-600">{avgDOC} días</div>
          <div className="text-sm text-slate-600 mt-1">Cobertura promedio</div>
          <div className="text-xs text-slate-400">Mínimo requerido: 35 días</div>
        </div>
        <div className="bg-slate-50 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-blue-600">{totalReplenishment.toLocaleString()}</div>
          <div className="text-sm text-slate-600 mt-1">Cajas a reponer (Mar 25)</div>
          <div className="text-xs text-slate-400">~{Math.round(totalReplenishment / 48)} pallets</div>
        </div>
        <div className="bg-red-50 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-red-600">2</div>
          <div className="text-sm text-slate-600 mt-1">SKUs en estado crítico</div>
          <div className="text-xs text-red-500">Requieren acción inmediata</div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Días de cobertura proyectada — cierre Mar 2025</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} barSize={36} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="sku" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8, color: '#f8fafc', fontSize: 12 }} formatter={(v) => [`${v} días`]} />
            <ReferenceLine y={35} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: 'Mín 35d', fill: '#f59e0b', fontSize: 10, position: 'right' }} />
            <ReferenceLine y={20} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'Crítico 20d', fill: '#ef4444', fontSize: 10, position: 'right' }} />
            <Bar dataKey="daysOfCover" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.status === 'critical' ? '#ef4444' : entry.status === 'warning' ? '#f59e0b' : '#10b981'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Plan de reposición detallado</h3>
        <div className="overflow-x-auto rounded-xl border border-slate-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs">
                <th className="text-left px-4 py-3 font-semibold">SKU</th>
                <th className="text-right px-4 py-3 font-semibold">Demanda proyectada</th>
                <th className="text-right px-4 py-3 font-semibold">Inventario actual</th>
                <th className="text-right px-4 py-3 font-semibold">Días cobertura</th>
                <th className="text-right px-4 py-3 font-semibold">Orden reposición</th>
                <th className="text-left px-4 py-3 font-semibold">Acción</th>
              </tr>
            </thead>
            <tbody>
              {inventoryPlan.map(row => (
                <tr key={row.sku} className="border-t border-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">{row.sku}</td>
                  <td className="px-4 py-3 text-right text-slate-600">{row.demand.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-slate-600">{row.currentStock.toLocaleString()}</td>
                  <td className={`px-4 py-3 text-right font-semibold ${row.status === 'critical' ? 'text-red-600' : row.status === 'warning' ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {row.daysOfCover}d
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-blue-700">{row.replenishment.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`flex items-center gap-1.5 text-xs font-medium ${row.status === 'critical' ? 'text-red-600' : row.status === 'warning' ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {row.status === 'critical' ? <AlertTriangle size={12} /> : row.status === 'warning' ? <AlertTriangle size={12} /> : <CheckCircle2 size={12} />}
                      {row.statusNote}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-800">
          <span className="font-semibold">Plan listo para validación financiera.</span> La orden de reposición total representa un desembolso estimado de <span className="font-bold">$22.4M MXN</span> en materiales y producción.
          Requiere aprobación de Finanzas antes de liberar órdenes de compra.
        </p>
      </div>
    </div>
  )
}
