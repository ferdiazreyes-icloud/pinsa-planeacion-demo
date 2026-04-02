'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3, GitBranch, Sliders, Home, TrendingUp, Activity } from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: BarChart3, description: 'KPIs ejecutivos' },
  { href: '/sop', label: 'Ciclo S&OP', icon: GitBranch, description: 'Flujo mensual' },
  { href: '/simulator', label: 'Simulador', icon: Sliders, description: 'Escenarios' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col h-screen sticky top-0" style={{ background: 'linear-gradient(180deg, #0f1a3b 0%, #242d51 50%, #1a2240 100%)' }}>
      {/* Brand */}
      <div className="px-5 py-5 border-b" style={{ borderColor: 'var(--sidebar-border)' }}>
        <Link href="/" className="flex items-center gap-3 group">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-sm flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, #601b4d 0%, #8B2E6A 100%)',
              boxShadow: '0 0 16px rgba(96,27,77,0.5)',
            }}
          >
            P
          </div>
          <div>
            <div className="text-white font-bold text-sm tracking-tight leading-none">PINSA</div>
            <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Torre de Control</div>
          </div>
        </Link>
      </div>

      {/* Period badge */}
      <div className="px-5 py-3 border-b" style={{ borderColor: 'var(--sidebar-border)' }}>
        <div className="flex items-center gap-2">
          <Activity size={12} style={{ color: 'rgba(255,255,255,0.4)' }} />
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Ciclo S&OP</span>
          <span
            className="ml-auto text-xs px-2 py-0.5 rounded-full font-semibold"
            style={{ background: 'rgba(96,27,77,0.3)', color: '#D4A0C0' }}
          >
            Mar 2025
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <div className="px-2 mb-3">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Módulos
          </span>
        </div>

        {navItems.map(({ href, label, icon: Icon, description }) => {
          const isActive = pathname === href || pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group relative"
              style={{
                background: isActive ? 'rgba(96,27,77,0.25)' : 'transparent',
                borderLeft: isActive ? '3px solid #601b4d' : '3px solid transparent',
              }}
            >
              <Icon
                size={17}
                style={{ color: isActive ? '#D4A0C0' : 'rgba(255,255,255,0.55)' }}
              />
              <div>
                <div
                  className="text-sm font-medium leading-none"
                  style={{ color: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.75)' }}
                >
                  {label}
                </div>
                <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  {description}
                </div>
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Footer KPIs */}
      <div className="px-4 py-4 border-t mx-3 mb-4" style={{ borderColor: 'var(--sidebar-border)' }}>
        <div className="text-xs mb-3 font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>
          Snapshot
        </div>
        <div className="space-y-2.5">
          {[
            { label: 'Fill Rate', value: '91.4%', ok: false },
            { label: 'Asertividad', value: '71.2%', ok: false },
            { label: 'Cap. Trabajo', value: '$298M', ok: false },
          ].map(({ label, value, ok }) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>{label}</span>
              <span
                className="text-xs font-bold"
                style={{ color: ok ? '#6EE7B7' : '#FBBF24' }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Demo badge */}
      <div className="px-4 pb-5">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0 animate-pulse" />
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Demo Mode</span>
        </div>
      </div>
    </aside>
  )
}
