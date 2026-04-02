'use client'

import { BarChart3, TrendingUp, Package, DollarSign } from 'lucide-react'
import KPICard from '@/components/dashboard/KPICard'
import AlertBanner from '@/components/dashboard/AlertBanner'
import FillRateChart from '@/components/dashboard/FillRateChart'
import RevenueChart from '@/components/dashboard/RevenueChart'
import WorkingCapitalChart from '@/components/dashboard/WorkingCapitalChart'
import { KPIs, type Alert } from '@/data'

export default function DashboardPage() {
  const { current, monthly } = KPIs
  const alerts = KPIs.alerts as Alert[]

  const fillRateData = monthly.map(m => ({ label: m.label, fillRate: m.fillRate, target: 95 }))
  const revenueData  = monthly.map(m => ({ label: m.label, revenue: m.revenue, cogs: m.cogs, isForecast: m.fillRate === null }))
  const wcData       = monthly.map(m => ({ label: m.label, wc: m.workingCapitalMXN }))

  return (
    <div className="px-8 py-7 max-w-screen-xl">

      {/* Page header */}
      <div className="mb-7">
        <h1 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Dashboard Ejecutivo
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
          Snapshot de la cadena de valor · Actualizado Feb 2025
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-7 stagger-children">
        <KPICard
          title="Fill Rate (OTIF)"
          value={`${current.fillRate}%`}
          target={`${current.fillRateTarget}%`}
          trend={current.fillRate - (monthly[monthly.length - 3]?.fillRate ?? current.fillRate)}
          status={current.fillRate >= current.fillRateTarget ? 'ok' : current.fillRate >= 90 ? 'warning' : 'critical'}
          icon={<BarChart3 size={16} />}
          subtitle="Órdenes completas y a tiempo"
        />
        <KPICard
          title="Asertividad Pronóstico"
          value={`${current.forecastAccuracy}%`}
          target={`${current.forecastAccuracyTarget}%`}
          trend={current.forecastAccuracy - (monthly[monthly.length - 3]?.forecastAccuracy ?? current.forecastAccuracy)}
          status={current.forecastAccuracy >= current.forecastAccuracyTarget ? 'ok' : current.forecastAccuracy >= 68 ? 'warning' : 'critical'}
          icon={<TrendingUp size={16} />}
          subtitle="1 − MAPE portafolio"
        />
        <KPICard
          title="Cobertura Inventario"
          value={`${current.inventoryDaysOfCover}d`}
          target={`${current.inventoryDocMin}–${current.inventoryDocMax}d`}
          trend={current.inventoryDaysOfCover - 34}
          status={current.inventoryDaysOfCover >= current.inventoryDocMin && current.inventoryDaysOfCover <= current.inventoryDocMax ? 'ok' : 'warning'}
          icon={<Package size={16} />}
          subtitle="Promedio ponderado portafolio"
        />
        <KPICard
          title="Capital de Trabajo"
          value={`$${(current.workingCapitalMXN / 1e6).toFixed(0)}M`}
          target={`$${(current.workingCapitalTargetMXN / 1e6).toFixed(0)}M`}
          trend={-((current.workingCapitalMXN - current.workingCapitalTargetMXN) / current.workingCapitalTargetMXN) * 100}
          status={current.workingCapitalMXN <= current.workingCapitalTargetMXN ? 'ok' : current.workingCapitalMXN <= 310e6 ? 'warning' : 'critical'}
          icon={<DollarSign size={16} />}
          subtitle="Inventario + cuentas por cobrar"
        />
      </div>

      {/* Alerts */}
      <div className="ec-card p-5 mb-7 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Alertas activas</span>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-bold"
            style={{ background: 'rgba(155,28,74,0.08)', color: '#9B1C4A' }}
          >
            {alerts.length}
          </span>
        </div>
        <AlertBanner alerts={alerts} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-7">
        {[
          { title: 'Fill Rate — 12 meses', subtitle: null, chart: <FillRateChart data={fillRateData} />, delay: '250ms' },
          { title: 'Ventas vs COGS', subtitle: 'Barras claras = pronóstico', chart: <RevenueChart data={revenueData} />, delay: '300ms' },
          { title: 'Capital de trabajo (MXN)', subtitle: null, chart: <WorkingCapitalChart data={wcData} />, delay: '350ms' },
        ].map(({ title, subtitle, chart, delay }) => (
          <div key={title} className="ec-card p-5 animate-fade-in-up" style={{ animationDelay: delay }}>
            <div className="text-sm font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>{title}</div>
            {subtitle && <div className="text-xs mb-3" style={{ color: 'var(--text-tertiary)' }}>{subtitle}</div>}
            <div className="mt-3">{chart}</div>
          </div>
        ))}
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Channel mix */}
        <div className="ec-card p-5 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <div className="text-sm font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Mix de ventas por canal</div>
          <div className="space-y-3">
            {[
              { channel: 'Autoservicio', pct: 48, color: 'var(--brand-navy)' },
              { channel: 'Mayoreo', pct: 28, color: 'var(--brand-maroon)' },
              { channel: 'Tienda de proximidad', pct: 14, color: 'var(--brand-teal)' },
              { channel: 'Foodservice', pct: 6, color: 'var(--brand-gold)' },
              { channel: 'Export', pct: 4, color: 'var(--brand-silver)' },
            ].map(({ channel, pct, color }) => (
              <div key={channel} className="flex items-center gap-3">
                <span className="text-xs w-40 flex-shrink-0" style={{ color: 'var(--text-secondary)' }}>{channel}</span>
                <div className="flex-1 rounded-full h-2" style={{ background: 'var(--bg-tertiary)' }}>
                  <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
                </div>
                <span className="text-xs font-semibold w-8 text-right" style={{ color: 'var(--text-primary)' }}>{pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top SKUs */}
        <div className="ec-card p-5 animate-fade-in-up" style={{ animationDelay: '440ms' }}>
          <div className="text-sm font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Top SKUs por volumen — Feb 2025</div>
          <div className="space-y-0">
            {[
              { sku: 'Dolores Atún Agua 170g',    cases: 19500, fillRate: 93.2, trend: '+1.2pp' },
              { sku: 'Dolores Pouch Aceite 80g',  cases: 27400, fillRate: 92.8, trend: '+0.8pp' },
              { sku: 'Dolores Atún Aceite 170g',  cases: 16300, fillRate: 91.5, trend: '-0.3pp' },
              { sku: 'Guardamar Atún Aceite 170g',cases: 9000,  fillRate: 89.4, trend: '-1.5pp' },
              { sku: 'La Sirena Sardina Jitomate',cases: 6300,  fillRate: 94.1, trend: '+2.1pp' },
            ].map(({ sku, cases, fillRate, trend }) => (
              <div
                key={sku}
                className="flex items-center justify-between py-2.5 transition-all"
                style={{ borderBottom: '1px solid var(--border-secondary)' }}
              >
                <span className="text-xs flex-1" style={{ color: 'var(--text-primary)' }}>{sku}</span>
                <span className="text-xs w-20 text-right" style={{ color: 'var(--text-tertiary)' }}>{cases.toLocaleString()} cajas</span>
                <span
                  className="text-xs font-bold w-14 text-right"
                  style={{ color: fillRate >= 93 ? 'var(--positive)' : fillRate >= 90 ? 'var(--warning)' : 'var(--negative)' }}
                >
                  {fillRate}%
                </span>
                <span
                  className="text-xs w-14 text-right font-medium"
                  style={{ color: trend.startsWith('+') ? 'var(--positive)' : 'var(--negative)' }}
                >
                  {trend}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
