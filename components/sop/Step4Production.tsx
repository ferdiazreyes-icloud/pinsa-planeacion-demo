'use client'

import { AlertTriangle, Factory, Clock, Zap } from 'lucide-react'

const productionPreview = [
  { line: 'Línea 1 — Lata 170g',   capacityWeek: 180000, demandWeek: 165000, utilization: 92, status: 'ok' as const },
  { line: 'Línea 4 — Pouch 80g',   capacityWeek: 95000,  demandWeek: 112000, utilization: 118, status: 'gap' as const },
  { line: 'Línea 7 — Lata 425g',   capacityWeek: 72000,  demandWeek: 68000,  utilization: 94, status: 'ok' as const },
  { line: 'Línea 9 — Lata 280g',   capacityWeek: 48000,  demandWeek: 44000,  utilization: 92, status: 'ok' as const },
  { line: 'Línea 12 — Foodservice 1kg', capacityWeek: 18000, demandWeek: 15500, utilization: 86, status: 'ok' as const },
]

const gapOptions = [
  {
    label: 'Ampliar turno nocturno Línea 4',
    icon: <Clock size={18} />,
    costMXN: 1_850_000,
    serviceImpact: 'Fill rate POR-POUCH se mantiene en 95%',
    feasibility: 'Disponible con 2 semanas de aviso',
    color: 'var(--brand-navy)',
  },
  {
    label: 'Aceptar quiebre controlado en OXXO',
    icon: <AlertTriangle size={18} />,
    costMXN: 3_400_000,
    serviceImpact: 'Fill rate cae a 87% · Riesgo pérdida de anaquel',
    feasibility: 'Decisión inmediata',
    color: 'var(--negative)',
  },
  {
    label: 'Re-negociar plan comercial',
    icon: <Zap size={18} />,
    costMXN: 0,
    serviceImpact: 'Revenue -$4.8M por redistribución de volumen',
    feasibility: 'Sujeto a aprobación comercial',
    color: 'var(--warning)',
  },
]

export default function Step4Production() {
  return (
    <div className="space-y-7">
      <div
        className="rounded-xl p-4"
        style={{ background: 'rgba(36,45,81,0.06)', border: '1px dashed rgba(36,45,81,0.25)' }}
      >
        <div className="flex items-center gap-2 mb-1">
          <Factory size={16} style={{ color: 'var(--brand-navy)' }} />
          <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
            Vista preview — brecha capacidad vs demanda
          </span>
        </div>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          La versión completa (E3 del roadmap) incluirá programa maestro por línea × semana con lotes mínimos, tiempo de arranque y 3 opciones modeladas para resolver brechas. Esto es un preview estático.
        </p>
      </div>

      <div>
        <div className="text-sm font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
          Programa preliminar — semana del 20 Abr 2026
        </div>
        <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid var(--border-primary)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--bg-tertiary)' }}>
                <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Línea</th>
                <th className="text-right px-4 py-3 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Capacidad (cajas/sem)</th>
                <th className="text-right px-4 py-3 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Demanda plan</th>
                <th className="text-right px-4 py-3 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Utilización</th>
                <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {productionPreview.map(row => (
                <tr key={row.line} style={{ borderTop: '1px solid var(--border-primary)' }}>
                  <td className="px-4 py-3 font-medium text-xs" style={{ color: 'var(--text-primary)' }}>{row.line}</td>
                  <td className="px-4 py-3 text-right text-xs" style={{ color: 'var(--text-secondary)' }}>{row.capacityWeek.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-xs" style={{ color: 'var(--text-secondary)' }}>{row.demandWeek.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-semibold text-xs" style={{ color: row.status === 'gap' ? 'var(--negative)' : 'var(--positive)' }}>
                    {row.utilization}%
                  </td>
                  <td className="px-4 py-3">
                    {row.status === 'gap' ? (
                      <span className="text-xs font-medium flex items-center gap-1.5" style={{ color: 'var(--negative)' }}>
                        <AlertTriangle size={12} /> Brecha +17,000 cajas
                      </span>
                    ) : (
                      <span className="text-xs" style={{ color: 'var(--positive)' }}>En capacidad</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="text-sm font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
          Brecha Línea 4 (Pouch 80g) — 3 opciones de resolución
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {gapOptions.map(opt => (
            <div
              key={opt.label}
              className="rounded-xl p-4"
              style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)' }}
            >
              <div className="flex items-center gap-2 mb-3" style={{ color: opt.color }}>
                {opt.icon}
                <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{opt.label}</span>
              </div>
              <div className="space-y-2 text-xs">
                <div>
                  <div className="font-semibold" style={{ color: 'var(--text-tertiary)' }}>Costo / impacto</div>
                  <div style={{ color: opt.color, fontWeight: 600 }}>
                    {opt.costMXN > 0 ? `$${(opt.costMXN / 1e6).toFixed(1)}M MXN` : opt.costMXN === 0 ? 'Sin costo directo' : `${opt.costMXN}`}
                  </div>
                </div>
                <div>
                  <div className="font-semibold" style={{ color: 'var(--text-tertiary)' }}>Servicio</div>
                  <div style={{ color: 'var(--text-secondary)' }}>{opt.serviceImpact}</div>
                </div>
                <div>
                  <div className="font-semibold" style={{ color: 'var(--text-tertiary)' }}>Factibilidad</div>
                  <div style={{ color: 'var(--text-secondary)' }}>{opt.feasibility}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 py-3 rounded-xl" style={{ background: 'rgba(155,28,74,0.06)', border: '1px solid rgba(155,28,74,0.18)' }}>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Brecha escalada a Sesión Ejecutiva.</span>{' '}
          La decisión entre las 3 opciones se toma en la sesión mensual con Dirección de Operaciones. El sistema no decide — presenta las opciones con datos.
        </p>
      </div>
    </div>
  )
}
