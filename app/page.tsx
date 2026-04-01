import Link from 'next/link'
import { BarChart3, GitBranch, Sliders, TrendingUp, Package } from 'lucide-react'

const roles = [
  {
    role: 'Directivo',
    description: 'Vista ejecutiva con KPIs de la cadena, tendencias y alertas activas.',
    href: '/dashboard',
    icon: BarChart3,
    color: 'from-blue-500 to-blue-700',
    badge: '4 alertas activas',
    badgeColor: 'bg-amber-100 text-amber-700',
  },
  {
    role: 'Planeador de Demanda',
    description: 'Revisa el pronóstico estadístico, evalúa la colaboración y gestiona el ciclo S&OP mensual.',
    href: '/sop',
    icon: TrendingUp,
    color: 'from-violet-500 to-violet-700',
    badge: 'Ciclo Mar 25 abierto',
    badgeColor: 'bg-violet-100 text-violet-700',
  },
  {
    role: 'Ventas / Colaboración',
    description: 'Ajusta el pronóstico por cliente y canal con visibilidad del baseline estadístico.',
    href: '/sop?step=2',
    icon: GitBranch,
    color: 'from-emerald-500 to-emerald-700',
    badge: '32% SKUs pendientes',
    badgeColor: 'bg-red-100 text-red-600',
  },
  {
    role: 'Planeador de Inventarios',
    description: 'Simula niveles de inventario y calcula reposición ante cambios en demanda y abasto.',
    href: '/simulator',
    icon: Package,
    color: 'from-teal-500 to-teal-700',
    badge: '1 SKU bajo mínimo',
    badgeColor: 'bg-orange-100 text-orange-700',
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-6 inline-flex items-center gap-2 bg-blue-500/20 text-blue-200 text-sm px-4 py-2 rounded-full border border-blue-500/30">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          S&OP / IBP Control Tower — Demo PINSA 2025
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight tracking-tight">
          Orquesta tu cadena<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
            de valor completa
          </span>
        </h1>

        <p className="text-slate-300 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed">
          De la planeación de la demanda al abasto — una sola plataforma, datos en tiempo real,
          decisiones más rápidas y menos capital de trabajo.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
          {roles.map(({ role, description, href, icon: Icon, color, badge, badgeColor }) => (
            <Link
              key={role}
              href={href}
              className="group bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/40 rounded-2xl p-6 text-left transition-all duration-200 hover:scale-[1.02] hover:shadow-2xl"
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                  <Icon size={22} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-semibold text-white">{role}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badgeColor}`}>{badge}</span>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">{description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-3xl">
          {[
            { label: 'Fill Rate actual', value: '91.4%', target: 'Meta: 95%', alert: true },
            { label: 'Asertividad pronóstico', value: '71.2%', target: 'Meta: 75%', alert: true },
            { label: 'Capital de trabajo', value: '$298M', target: 'Meta: $280M', alert: true },
            { label: 'Cobertura inventario', value: '33 días', target: 'Rango: 30–45', alert: false },
          ].map(({ label, value, target, alert }) => (
            <div key={label} className="text-center">
              <div className={`text-2xl font-bold ${alert ? 'text-amber-400' : 'text-emerald-400'}`}>{value}</div>
              <div className="text-slate-300 text-sm mt-1">{label}</div>
              <div className="text-slate-500 text-xs mt-0.5">{target}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center py-6 text-slate-600 text-xs">
        PINSA Torre de Control · Demo confidencial · {new Date().getFullYear()}
      </div>
    </div>
  )
}
