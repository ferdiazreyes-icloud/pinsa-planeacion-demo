'use client'

import { useState } from 'react'
import { CheckCircle2, AlertCircle, Edit3 } from 'lucide-react'

type CollabRow = {
  skuId: string
  sku: string
  channel: string
  statistical: number
  collaborated: number
  reason: string
  status: 'pending' | 'done'
}

const initialRows: CollabRow[] = [
  { skuId: 'DOL-170-ACE', sku: 'Dolores Atún Aceite 170g', channel: 'Walmart', statistical: 12800, collaborated: 14200, reason: 'Activación Semana Santa Walmart', status: 'done' },
  { skuId: 'DOL-170-AGU', sku: 'Dolores Atún Agua 170g', channel: 'Soriana', statistical: 16200, collaborated: 18000, reason: 'Exhibición especial Soriana + OXXO', status: 'done' },
  { skuId: 'POR-POUCH-ACE', sku: 'Portola Pouch Aceite 80g', channel: 'OXXO', statistical: 9800, collaborated: 12000, reason: 'Lanzamiento canal Kiosko OXXO', status: 'done' },
  { skuId: 'DOL-170-ACE', sku: 'Dolores Atún Aceite 170g', channel: 'Zorro Abarrotero', statistical: 6300, collaborated: 6300, reason: '', status: 'pending' },
  { skuId: 'DOL-280-ACE', sku: 'Dolores Atún Aceite 280g', channel: "Sam's Club", statistical: 4200, collaborated: 4200, reason: '', status: 'pending' },
  { skuId: 'MAZ-170-ACE', sku: 'Mazatún Atún Aceite 170g', channel: 'Chedraui', statistical: 7400, collaborated: 8100, reason: 'Pedido especial CHEDRAUI norte', status: 'done' },
  { skuId: 'ELD-SARD-JIT-425', sku: 'El Dorado Sardina Jitomate 425g', channel: 'Exportación LATAM', statistical: 3200, collaborated: 3200, reason: '', status: 'pending' },
  { skuId: 'DOL-FOODSVC-1KG', sku: 'Dolores Foodservice 1kg', channel: 'Foodservice', statistical: 1100, collaborated: 1100, reason: '', status: 'pending' },
]

export default function Step2Collaboration() {
  const [rows, setRows] = useState<CollabRow[]>(initialRows)
  const [editingIdx, setEditingIdx] = useState<number | null>(null)

  const doneCount = rows.filter(r => r.status === 'done').length
  const pct = Math.round((doneCount / rows.length) * 100)

  const handleCollabChange = (idx: number, value: string) => {
    setRows(prev => prev.map((r, i) => i === idx ? { ...r, collaborated: parseInt(value) || r.statistical } : r))
  }
  const handleReasonChange = (idx: number, value: string) => {
    setRows(prev => prev.map((r, i) => i === idx ? { ...r, reason: value } : r))
  }
  const handleConfirm = (idx: number) => {
    setRows(prev => prev.map((r, i) => i === idx ? { ...r, status: 'done' } : r))
    setEditingIdx(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex-1 bg-slate-100 rounded-full h-3">
          <div className="bg-emerald-500 h-3 rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
        <span className="text-sm font-semibold text-slate-700 flex-shrink-0">{doneCount}/{rows.length} SKUs colaborados ({pct}%)</span>
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
              <th className="text-left px-4 py-3 font-semibold">SKU</th>
              <th className="text-left px-4 py-3 font-semibold">Canal</th>
              <th className="text-right px-4 py-3 font-semibold">Estadístico</th>
              <th className="text-right px-4 py-3 font-semibold">Colaborado</th>
              <th className="text-right px-4 py-3 font-semibold">Δ</th>
              <th className="text-left px-4 py-3 font-semibold">Justificación</th>
              <th className="text-center px-4 py-3 font-semibold">Estado</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => {
              const delta = row.collaborated - row.statistical
              const deltaPct = ((delta / row.statistical) * 100).toFixed(1)
              const isEditing = editingIdx === idx

              return (
                <tr key={idx} className={`border-t border-slate-50 ${row.status === 'done' ? 'bg-white' : 'bg-amber-50/40'}`}>
                  <td className="px-4 py-3 font-medium text-slate-800">{row.sku}</td>
                  <td className="px-4 py-3 text-slate-500">{row.channel}</td>
                  <td className="px-4 py-3 text-right text-slate-600">{row.statistical.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">
                    {isEditing ? (
                      <input
                        type="number"
                        value={row.collaborated}
                        onChange={e => handleCollabChange(idx, e.target.value)}
                        className="w-24 text-right border border-blue-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    ) : (
                      <span className="font-medium text-slate-800">{row.collaborated.toLocaleString()}</span>
                    )}
                  </td>
                  <td className={`px-4 py-3 text-right text-xs font-semibold ${delta > 0 ? 'text-emerald-600' : delta < 0 ? 'text-red-500' : 'text-slate-400'}`}>
                    {delta !== 0 ? `${delta > 0 ? '+' : ''}${deltaPct}%` : '—'}
                  </td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <input
                        type="text"
                        value={row.reason}
                        placeholder="Razón del ajuste..."
                        onChange={e => handleReasonChange(idx, e.target.value)}
                        className="w-full border border-blue-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    ) : (
                      <span className="text-slate-500 text-xs">{row.reason || <span className="text-amber-400 italic">Sin justificación</span>}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
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
        <span className="font-semibold text-slate-800">Resumen:</span> Los ajustes al alza suman +5,600 cajas adicionales (+5.8%) sobre el pronóstico estadístico para Abril.
        Impacto estimado: +$2.4M MXN en revenue adicional si se captura con fill rate ≥95%.
      </div>
    </div>
  )
}
