'use client'

import { useState } from 'react'
import { CheckCircle2, AlertCircle, Edit3, TrendingUp, TrendingDown } from 'lucide-react'

type AdjustmentCategory = 'promocion' | 'lanzamiento' | 'anaquel' | 'competencia' | 'estacionalidad' | ''

type CollabRow = {
  skuId: string
  sku: string
  channel: string
  statistical: number
  collaborated: number
  reason: string
  category: AdjustmentCategory
  status: 'pending' | 'done'
}

// FVA histórico por categoría — mock de últimos 6 ciclos S&OP
// Positivo = ajustes de esta categoría históricamente mejoran la asertividad vs baseline
// Negativo = empeoran (sobre-ajustan o mal-ajustan)
const CATEGORY_META: Record<Exclude<AdjustmentCategory, ''>, { label: string; fvaPct: number; sample: number; hint: string }> = {
  promocion:      { label: 'Promoción',          fvaPct: +8.2, sample: 42, hint: 'Activaciones con cliente clave (Walmart, Soriana, OXXO)' },
  lanzamiento:    { label: 'Lanzamiento NPI',    fvaPct: +4.1, sample: 11, hint: 'Nuevo SKU o nueva presentación' },
  anaquel:        { label: 'Acuerdo de anaquel', fvaPct: +2.5, sample: 28, hint: 'Frentes o exhibición adicional negociada' },
  competencia:    { label: 'Acción competencia', fvaPct: -3.8, sample: 19, hint: 'Respuesta a promoción de Tuny o marca propia' },
  estacionalidad: { label: 'Estacionalidad',     fvaPct: +6.1, sample: 36, hint: 'Cuaresma, Semana Santa, Buen Fin, Navidad' },
}

const CATEGORY_ORDER: Exclude<AdjustmentCategory, ''>[] = ['promocion', 'estacionalidad', 'lanzamiento', 'anaquel', 'competencia']

const initialRows: CollabRow[] = [
  { skuId: 'DOL-170-ACE',      sku: 'Dolores Atún Aceite 170g',      channel: 'Walmart',             statistical: 12800, collaborated: 14200, reason: 'Activación Semana Santa Walmart',          category: 'estacionalidad', status: 'done' },
  { skuId: 'DOL-170-AGU',      sku: 'Dolores Atún Agua 170g',        channel: 'Soriana',             statistical: 16200, collaborated: 18000, reason: 'Exhibición especial Soriana + OXXO',        category: 'anaquel',        status: 'done' },
  { skuId: 'POR-POUCH-ACE',    sku: 'Portola Pouch Aceite 80g',      channel: 'OXXO',                statistical: 9800,  collaborated: 12000, reason: 'Lanzamiento canal Kiosko OXXO',             category: 'lanzamiento',    status: 'done' },
  { skuId: 'DOL-170-ACE',      sku: 'Dolores Atún Aceite 170g',      channel: 'Zorro Abarrotero',    statistical: 6300,  collaborated: 6300,  reason: '',                                           category: '',               status: 'pending' },
  { skuId: 'DOL-280-ACE',      sku: 'Dolores Atún Aceite 280g',      channel: "Sam's Club",          statistical: 4200,  collaborated: 4200,  reason: '',                                           category: '',               status: 'pending' },
  { skuId: 'MAZ-170-ACE',      sku: 'Mazatún Atún Aceite 170g',      channel: 'Chedraui',            statistical: 7400,  collaborated: 8100,  reason: 'Pedido especial CHEDRAUI norte',            category: 'promocion',      status: 'done' },
  { skuId: 'ELD-SARD-JIT-425', sku: 'El Dorado Sardina Jitomate 425g', channel: 'Exportación LATAM', statistical: 3200,  collaborated: 3200,  reason: '',                                           category: '',               status: 'pending' },
  { skuId: 'DOL-FOODSVC-1KG',  sku: 'Dolores Foodservice 1kg',       channel: 'Foodservice',         statistical: 1100,  collaborated: 1100,  reason: '',                                           category: '',               status: 'pending' },
]

export default function Step2Collaboration() {
  const [rows, setRows] = useState<CollabRow[]>(initialRows)
  const [editingIdx, setEditingIdx] = useState<number | null>(null)

  const doneCount = rows.filter(r => r.status === 'done').length
  const pct = Math.round((doneCount / rows.length) * 100)

  // FVA proyectado para este ciclo: promedio ponderado de las categorías usadas
  const usedCategories = rows.filter(r => r.status === 'done' && r.category).map(r => r.category as Exclude<AdjustmentCategory, ''>)
  const cycleFVA = usedCategories.length
    ? usedCategories.reduce((s, c) => s + CATEGORY_META[c].fvaPct, 0) / usedCategories.length
    : 0

  const handleCollabChange = (idx: number, value: string) => {
    setRows(prev => prev.map((r, i) => i === idx ? { ...r, collaborated: parseInt(value) || r.statistical } : r))
  }
  const handleReasonChange = (idx: number, value: string) => {
    setRows(prev => prev.map((r, i) => i === idx ? { ...r, reason: value } : r))
  }
  const handleCategoryChange = (idx: number, value: string) => {
    setRows(prev => prev.map((r, i) => i === idx ? { ...r, category: value as AdjustmentCategory } : r))
  }
  const handleConfirm = (idx: number) => {
    setRows(prev => prev.map((r, i) => i === idx ? { ...r, status: 'done' } : r))
    setEditingIdx(null)
  }

  return (
    <div className="space-y-6">
      {/* FVA histórico por categoría */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
            Forecast Value Added (FVA) — últimos 6 ciclos S&OP
          </span>
          <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            · Mejora promedio que cada tipo de ajuste agregó al baseline estadístico
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {CATEGORY_ORDER.map(cat => {
            const m = CATEGORY_META[cat]
            const isPositive = m.fvaPct > 0
            return (
              <div
                key={cat}
                className="rounded-xl p-3"
                style={{
                  background: isPositive ? 'rgba(26,122,110,0.06)' : 'rgba(155,28,74,0.06)',
                  border: `1px solid ${isPositive ? 'rgba(26,122,110,0.2)' : 'rgba(155,28,74,0.2)'}`,
                }}
              >
                <div className="flex items-center gap-1 mb-1">
                  {isPositive
                    ? <TrendingUp size={12} style={{ color: 'var(--positive)' }} />
                    : <TrendingDown size={12} style={{ color: 'var(--negative)' }} />
                  }
                  <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{m.label}</span>
                </div>
                <div className="text-xl font-black" style={{ color: isPositive ? 'var(--positive)' : 'var(--negative)' }}>
                  {m.fvaPct > 0 ? '+' : ''}{m.fvaPct}%
                </div>
                <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                  n={m.sample} · {m.hint}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Progress + FVA proyectado ciclo */}
      <div className="flex items-center gap-4">
        <div className="flex-1 bg-slate-100 rounded-full h-3">
          <div className="bg-emerald-500 h-3 rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
        <span className="text-sm font-semibold text-slate-700 flex-shrink-0">{doneCount}/{rows.length} colaborados ({pct}%)</span>
        {cycleFVA !== 0 && (
          <span
            className="text-xs px-2 py-1 rounded-full flex items-center gap-1 flex-shrink-0 font-semibold"
            style={{
              background: cycleFVA > 0 ? 'rgba(26,122,110,0.1)' : 'rgba(155,28,74,0.1)',
              color: cycleFVA > 0 ? 'var(--positive)' : 'var(--negative)',
            }}
          >
            {cycleFVA > 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            FVA proyectado ciclo: {cycleFVA > 0 ? '+' : ''}{cycleFVA.toFixed(1)}%
          </span>
        )}
        {pct < 80 && (
          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full flex items-center gap-1 flex-shrink-0">
            <AlertCircle size={12} /> Bajo meta 80%
          </span>
        )}
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs">
              <th className="text-left  px-3 py-3 font-semibold">SKU</th>
              <th className="text-left  px-3 py-3 font-semibold">Cuenta</th>
              <th className="text-right px-3 py-3 font-semibold">Estadístico</th>
              <th className="text-right px-3 py-3 font-semibold">Colaborado</th>
              <th className="text-right px-3 py-3 font-semibold">Δ</th>
              <th className="text-left  px-3 py-3 font-semibold">Categoría</th>
              <th className="text-left  px-3 py-3 font-semibold">Justificación</th>
              <th className="text-center px-3 py-3 font-semibold">Estado</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => {
              const delta = row.collaborated - row.statistical
              const deltaPct = ((delta / row.statistical) * 100).toFixed(1)
              const isEditing = editingIdx === idx
              const meta = row.category ? CATEGORY_META[row.category] : null

              return (
                <tr key={idx} className={`border-t border-slate-50 ${row.status === 'done' ? 'bg-white' : 'bg-amber-50/40'}`}>
                  <td className="px-3 py-3 font-medium text-slate-800 text-xs">{row.sku}</td>
                  <td className="px-3 py-3 text-slate-500 text-xs">{row.channel}</td>
                  <td className="px-3 py-3 text-right text-slate-600 text-xs">{row.statistical.toLocaleString()}</td>
                  <td className="px-3 py-3 text-right">
                    {isEditing ? (
                      <input
                        type="number"
                        value={row.collaborated}
                        onChange={e => handleCollabChange(idx, e.target.value)}
                        className="w-24 text-right border border-blue-300 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    ) : (
                      <span className="font-medium text-slate-800 text-xs">{row.collaborated.toLocaleString()}</span>
                    )}
                  </td>
                  <td className={`px-3 py-3 text-right text-xs font-semibold ${delta > 0 ? 'text-emerald-600' : delta < 0 ? 'text-red-500' : 'text-slate-400'}`}>
                    {delta !== 0 ? `${delta > 0 ? '+' : ''}${deltaPct}%` : '—'}
                  </td>
                  <td className="px-3 py-3">
                    {isEditing ? (
                      <select
                        value={row.category}
                        onChange={e => handleCategoryChange(idx, e.target.value)}
                        className="w-full border border-blue-300 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                      >
                        <option value="">— Selecciona —</option>
                        {CATEGORY_ORDER.map(c => (
                          <option key={c} value={c}>{CATEGORY_META[c].label}</option>
                        ))}
                      </select>
                    ) : meta ? (
                      <span
                        className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full font-medium"
                        style={{
                          background: meta.fvaPct > 0 ? 'rgba(26,122,110,0.1)' : 'rgba(155,28,74,0.1)',
                          color: meta.fvaPct > 0 ? 'var(--positive)' : 'var(--negative)',
                        }}
                        title={`FVA histórico: ${meta.fvaPct > 0 ? '+' : ''}${meta.fvaPct}% (n=${meta.sample})`}
                      >
                        {meta.fvaPct > 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                        {meta.label}
                      </span>
                    ) : (
                      <span className="text-amber-400 italic text-[11px]">Sin categoría</span>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    {isEditing ? (
                      <input
                        type="text"
                        value={row.reason}
                        placeholder="Razón del ajuste..."
                        onChange={e => handleReasonChange(idx, e.target.value)}
                        className="w-full border border-blue-300 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    ) : (
                      <span className="text-slate-500 text-xs">{row.reason || <span className="text-amber-400 italic">Sin justificación</span>}</span>
                    )}
                  </td>
                  <td className="px-3 py-3 text-center">
                    {row.status === 'done' && !isEditing ? (
                      <div className="flex items-center justify-center gap-2">
                        <CheckCircle2 size={16} className="text-emerald-500" />
                        <button onClick={() => setEditingIdx(idx)} className="text-xs text-slate-400 hover:text-blue-500">
                          <Edit3 size={12} />
                        </button>
                      </div>
                    ) : isEditing ? (
                      <button onClick={() => handleConfirm(idx)} className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 font-medium">
                        Confirmar
                      </button>
                    ) : (
                      <button onClick={() => setEditingIdx(idx)} className="text-xs bg-amber-100 text-amber-700 px-3 py-1.5 rounded-lg hover:bg-amber-200 font-medium">
                        Colaborar
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-600">
        <span className="font-semibold text-slate-800">Lectura:</span> El sistema mide el Forecast Value Added de cada tipo de ajuste históricamente.
        Los ajustes de <span className="font-semibold" style={{ color: 'var(--negative)' }}>acción competencia</span> empeoran el baseline en promedio
        (−3.8%) — indicativo de sobre-reacción. Los ajustes de <span className="font-semibold" style={{ color: 'var(--positive)' }}>promoción</span> y{' '}
        <span className="font-semibold" style={{ color: 'var(--positive)' }}>estacionalidad</span> son los más predictivos.
        Ventas es dueña del plan, no usuaria de él.
      </div>
    </div>
  )
}
