import Link from 'next/link'
import { BarChart3, GitBranch, Sliders, TrendingUp, Package, ArrowRight, Gavel } from 'lucide-react'
import TourGuide, { type TourStep } from '@/components/layout/TourGuide'

const HOME_TOUR: TourStep[] = [
  {
    target: '[data-tour="home-headline"]',
    title: 'Torre de Control PINSA',
    desc: 'Plataforma S&OP/IBP que centraliza todo el ciclo de planeación: desde el pronóstico de demanda hasta la aprobación financiera del plan mensual.',
    position: 'bottom',
  },
  {
    target: '[data-tour="home-roles"]',
    title: '4 roles, 4 perspectivas',
    desc: 'Cada tarjeta lleva a la vista de un rol diferente en PINSA. Haz clic en cualquiera para entrar directamente a ese módulo.',
    position: 'bottom',
  },
  {
    target: '[data-tour="home-kpi-strip"]',
    title: 'Métricas actuales',
    desc: 'Estos 4 indicadores muestran el estado real del negocio. En producción se actualizan en tiempo real desde el ERP de PINSA.',
    position: 'top',
  },
]

const roles = [
  {
    role: 'Director de Operaciones',
    description: 'Sesión Ejecutiva mensual: 4 KPIs, brechas abiertas, P&L y decisión del ciclo. 60 min para decidir, no para reportar.',
    href: '/sesion-ejecutiva',
    icon: Gavel,
    accentColor: '#601b4d',
    badge: '1 brecha · 4 KPIs',
    badgeBg: 'rgba(96,27,77,0.15)',
    badgeColor: '#D4A0C0',
  },
  {
    role: 'Directivo — Cadena',
    description: 'Dashboard continuo con KPIs operativos, alertas activas y tendencias de 12 meses.',
    href: '/dashboard',
    icon: BarChart3,
    accentColor: '#242d51',
    badge: '4 alertas activas',
    badgeBg: 'rgba(184,125,26,0.15)',
    badgeColor: '#E8C06A',
  },
  {
    role: 'Planeador de Demanda',
    description: 'Pronóstico estadístico, colaboración comercial y ciclo S&OP mensual de 5 pasos.',
    href: '/sop',
    icon: TrendingUp,
    accentColor: '#1A7A6E',
    badge: 'Ciclo Abr 26 abierto',
    badgeBg: 'rgba(26,122,110,0.15)',
    badgeColor: '#6ECEC5',
  },
  {
    role: 'Planeador de Inventarios',
    description: 'Simula niveles de inventario y calcula reposición ante cambios en demanda y abasto.',
    href: '/simulator',
    icon: Package,
    accentColor: '#B87D1A',
    badge: '1 SKU bajo mínimo',
    badgeBg: 'rgba(184,125,26,0.15)',
    badgeColor: '#E8C06A',
  },
]

export default function HomePage() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'linear-gradient(160deg, #0f1a3b 0%, #242d51 45%, #1a2240 100%)' }}
    >
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-16">

        {/* Logo mark */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-white text-2xl mb-8"
          style={{
            background: 'linear-gradient(135deg, #601b4d 0%, #8B2E6A 100%)',
            boxShadow: '0 0 32px rgba(96,27,77,0.6)',
          }}
        >
          P
        </div>

        {/* Headline */}
        <div
          className="text-xs font-semibold uppercase tracking-widest mb-4 px-4 py-1.5 rounded-full"
          style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.12)' }}
        >
          S&OP / IBP Control Tower · Demo PINSA 2026
        </div>

        <h1 data-tour="home-headline" className="text-4xl md:text-5xl font-black text-white text-center leading-tight tracking-tight mb-4">
          Orquesta tu cadena<br />
          <span style={{ color: '#D4A0C0' }}>de valor completa</span>
        </h1>

        <p className="text-center max-w-xl mb-12 leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15 }}>
          De la planeación de la demanda al abasto — una sola plataforma,
          decisiones más rápidas y menos capital de trabajo.
        </p>

        {/* Role cards */}
        <div data-tour="home-roles" className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl mb-14">
          {roles.map(({ role, description, href, icon: Icon, accentColor, badge, badgeBg, badgeColor }) => (
            <Link
              key={role}
              href={href}
              className="group flex items-start gap-4 p-5 rounded-2xl transition-all duration-200 hover:scale-[1.02]"
              style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${accentColor}25`, border: `1px solid ${accentColor}40` }}
              >
                <Icon size={20} style={{ color: accentColor }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-bold text-sm text-white">{role}</span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: badgeBg, color: badgeColor }}
                  >
                    {badge}
                  </span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{description}</p>
              </div>
              <ArrowRight size={14} className="flex-shrink-0 mt-1 opacity-40 group-hover:opacity-80 transition-opacity" style={{ color: 'white' }} />
            </Link>
          ))}
        </div>

        {/* KPI strip */}
        <div
          data-tour="home-kpi-strip"
          className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-2xl overflow-hidden w-full max-w-2xl"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          {[
            { label: 'Fill Rate', value: '91.4%', meta: 'Meta 95%', ok: false },
            { label: 'Asertividad', value: '71.2%', meta: 'Meta 75%', ok: false },
            { label: 'Capital trabajo', value: '$298M', meta: 'Meta $280M', ok: false },
            { label: 'Días cobertura', value: '33d', meta: 'Rango 30–45d', ok: true },
          ].map(({ label, value, meta, ok }) => (
            <div
              key={label}
              className="flex flex-col items-center justify-center py-5 px-3 text-center"
              style={{ background: 'rgba(255,255,255,0.03)' }}
            >
              <div className="text-2xl font-black" style={{ color: ok ? '#6ECEC5' : '#E8C06A' }}>{value}</div>
              <div className="text-xs mt-1 font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>{label}</div>
              <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>{meta}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 py-6">
        <div className="flex items-center gap-2">
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>Powered by</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logos/arena-blanco-h.png" alt="Arena Analytics" style={{ height: 18, width: 'auto', opacity: 0.35 }} />
        </div>
        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.12)' }}>
          Demo confidencial · {new Date().getFullYear()}
        </span>
      </div>

      <TourGuide
        steps={HOME_TOUR}
        storageKey="pinsa-tour-home"
        welcomeTitle="Bienvenido a PINSA Torre de Control"
        welcomeDesc="Demo interactivo de la plataforma S&OP/IBP. Explora los 4 módulos o sigue el recorrido guiado."
      />
    </div>
  )
}
