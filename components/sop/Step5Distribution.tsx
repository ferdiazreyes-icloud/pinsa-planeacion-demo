'use client'

import { Truck, Warehouse, ArrowRight } from 'lucide-react'

const replenishmentPlan = [
  { sku: 'DOL-170-ACE',       plantaStock: 44200, cedisStock: 18500, cedisTargetDays: 18, cedisActualDays: 14, replenishPlanta: 19500, sendToCedis: 6200 },
  { sku: 'DOL-170-AGU',       plantaStock: 52400, cedisStock: 21300, cedisTargetDays: 18, cedisActualDays: 15, replenishPlanta: 22000, sendToCedis: 7800 },
  { sku: 'POR-POUCH-ACE',     plantaStock: 65800, cedisStock: 22400, cedisTargetDays: 20, cedisActualDays: 12, replenishPlanta: 32000, sendToCedis: 14500 },
  { sku: 'MAZ-170-ACE',       plantaStock: 20800, cedisStock: 7200,  cedisTargetDays: 18, cedisActualDays: 16, replenishPlanta: 11000, sendToCedis: 3400 },
  { sku: 'ELD-SARD-JIT-425',  plantaStock: 14900, cedisStock: 4800,  cedisTargetDays: 22, cedisActualDays: 19, replenishPlanta: 8000,  sendToCedis: 1800 },
]

export default function Step5Distribution() {
  const totalSendToCedis = replenishmentPlan.reduce((s, r) => s + r.sendToCedis, 0)
  const urgentCount = replenishmentPlan.filter(r => r.cedisActualDays < r.cedisTargetDays - 3).length

  return (
    <div className="space-y-7">
      <div
        className="rounded-xl p-4"
        style={{ background: 'rgba(36,45,81,0.06)', border: '1px dashed rgba(36,45,81,0.25)' }}
      >
        <div className="flex items-center gap-2 mb-1">
          <Truck size={16} style={{ color: 'var(--brand-navy)' }} />
          <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
            Vista preview — plan de reposición Planta → CEDIS
          </span>
        </div>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          La versión completa (E5 del roadmap) incluirá señales por SKU y frecuencia de reabasto optimizada por política ABC. Esto es un preview con red PINSA real (1 planta Mazatlán + 1 CEDIS México).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl p-4 text-center" style={{ background: 'var(--bg-tertiary)' }}>
          <div className="text-3xl font-bold" style={{ color: 'var(--brand-navy)' }}>{totalSendToCedis.toLocaleString()}</div>
          <div className="text-sm mt-1 font-semibold" style={{ color: 'var(--text-primary)' }}>Cajas a enviar a CEDIS</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>~{Math.round(totalSendToCedis / 48)} pallets · semana 20 Abr</div>
        </div>
        <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(155,28,74,0.06)' }}>
          <div className="text-3xl font-bold" style={{ color: 'var(--negative)' }}>{urgentCount}</div>
          <div className="text-sm mt-1 font-semibold" style={{ color: 'var(--text-primary)' }}>SKUs en urgencia</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>Cobertura CEDIS bajo target</div>
        </div>
        <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(26,122,110,0.06)' }}>
          <div className="text-3xl font-bold" style={{ color: 'var(--positive)' }}>2</div>
          <div className="text-sm mt-1 font-semibold" style={{ color: 'var(--text-primary)' }}>Nodos de la red</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>Planta Mazatlán → CEDIS México</div>
        </div>
      </div>

      <div>
        <div className="text-sm font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Plan de reposición por SKU</div>
        <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid var(--border-primary)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--bg-tertiary)' }}>
                <th className="text-left  px-4 py-3 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>SKU</th>
                <th className="text-right px-4 py-3 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Stock planta</th>
                <th className="text-right px-4 py-3 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Stock CEDIS</th>
                <th className="text-right px-4 py-3 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Cobertura CEDIS</th>
                <th className="text-left  px-4 py-3 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Movimiento</th>
              </tr>
            </thead>
            <tbody>
              {replenishmentPlan.map(row => {
                const underTarget = row.cedisActualDays < row.cedisTargetDays - 3
                return (
                  <tr key={row.sku} style={{ borderTop: '1px solid var(--border-primary)' }}>
                    <td className="px-4 py-3 font-medium text-xs" style={{ color: 'var(--text-primary)' }}>{row.sku}</td>
                    <td className="px-4 py-3 text-right text-xs" style={{ color: 'var(--text-secondary)' }}>{row.plantaStock.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-xs" style={{ color: 'var(--text-secondary)' }}>{row.cedisStock.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right font-semibold text-xs" style={{ color: underTarget ? 'var(--negative)' : 'var(--positive)' }}>
                      {row.cedisActualDays}d / {row.cedisTargetDays}d
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5 text-xs font-medium" style={{ color: 'var(--brand-navy)' }}>
                        <Warehouse size={11} />
                        Planta
                        <ArrowRight size={10} />
                        CEDIS: <b>{row.sendToCedis.toLocaleString()} cajas</b>
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="px-4 py-3 rounded-xl" style={{ background: 'rgba(36,45,81,0.06)', border: '1px solid rgba(36,45,81,0.15)' }}>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Plan listo para ejecutar.</span>{' '}
          Los movimientos se liberan al WMS una vez que la Sesión Ejecutiva aprueba el ciclo. Impacto estimado en transporte: <span className="font-bold" style={{ color: 'var(--brand-navy)' }}>$1.8M MXN</span>.
        </p>
      </div>
    </div>
  )
}
