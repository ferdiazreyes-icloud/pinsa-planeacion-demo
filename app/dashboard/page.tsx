'use client'

import { BarChart3, TrendingUp, Package, DollarSign, RefreshCw } from 'lucide-react'
import KPICard from '@/components/dashboard/KPICard'
import AlertBanner from '@/components/dashboard/AlertBanner'
import FillRateChart from '@/components/dashboard/FillRateChart'
import RevenueChart from '@/components/dashboard/RevenueChart'
import WorkingCapitalChart from '@/components/dashboard/WorkingCapitalChart'
import { KPIs, type Alert } from '@/data'

export default function DashboardPage() {
  const { current, monthly } = KPIs
  const alerts = KPIs.alerts as Alert[]

  const fillRateData = monthly.map(m => ({
    label: m.label,
    fillRate: m.fillRate,
    target: 95,
  }))

  const revenueData = monthly.map(m => ({
    label: m.label,
    revenue: m.revenue,
    cogs: m.cogs,
    isForecast: m.fillRate === null,
  }))

  const wcData = monthly.map(m => ({
    label: m.label,
    wc: m.workingCapitalMXN,
  }))

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-8">
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Ejecutivo</h1>
          <p className="text-slate-500 text-sm mt-1">Snapshot de la cadena de valor · Actualizado Feb 2025</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <RefreshCw size={14} />
          Ciclo S&OP Mar 2025 en curso
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard
          title="Fill Rate (OTIF)"
          value={`${current.fillRate}%`}
          target={`${current.fillRateTarget}%`}
          trend={current.fillRate - (monthly[monthly.length - 3]?.fillRate ?? current.fillRate)}
          status={current.fillRate >= current.fillRateTarget ? 'ok' : current.fillRate >= 90 ? 'warning' : 'critical'}
          icon={<BarChart3 size={18} />}
          subtitle="Órdenes entregadas completas y a tiempo"
        />
        <KPICard
          title="Asertividad Pronóstico"
          value={`${current.forecastAccuracy}%`}
          target={`${current.forecastAccuracyTarget}%`}
          trend={current.forecastAccuracy - (monthly[monthly.length - 3]?.forecastAccuracy ?? current.forecastAccuracy)}
          status={current.forecastAccuracy >= current.forecastAccuracyTarget ? 'ok' : current.forecastAccuracy >= 68 ? 'warning' : 'critical'}
          icon={<TrendingUp size={18} />}
          subtitle="1 − MAPE promedio portafolio"
        />
        <KPICard
          title="Cobertura Inventario"
          value={`${current.inventoryDaysOfCover} días`}
          target={`${current.inventoryDocMin}–${current.inventoryDocMax} días`}
          trend={current.inventoryDaysOfCover - 34}
          status={
            current.inventoryDaysOfCover >= current.inventoryDocMin && current.inventoryDaysOfCover <= current.inventoryDocMax
              ? 'ok' : 'warning'
          }
          icon={<Package size={18} />}
          subtitle="Promedio ponderado portafolio"
        />
        <KPICard
          title="Capital de Trabajo"
          value={`$${(current.workingCapitalMXN / 1_000_000).toFixed(0)}M`}
          target={`$${(current.workingCapitalTargetMXN / 1_000_000).toFixed(0)}M`}
          trend={-((current.workingCapitalMXN - current.workingCapitalTargetMXN) / current.workingCapitalTargetMXN) * 100}
          status={current.workingCapitalMXN <= current.workingCapitalTargetMXN ? 'ok' : current.workingCapitalMXN <= 310_000_000 ? 'warning' : 'critical'}
          icon={<DollarSign size={18} />}
          subtitle="Inventario + cuentas por cobrar"
        />
      </div>

      {/* Alerts */}
      <div className="mb-8">
        <h2 className="text-base font-semibold text-slate-700 mb-3 flex items-center gap-2">
          Alertas activas
          <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-bold">{alerts.length}</span>
        </h2>
        <AlertBanner alerts={alerts} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-5 shadow-sm lg:col-span-1">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Fill Rate — últimos 12 meses</h3>
          <FillRateChart data={fillRateData} />
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm lg:col-span-1">
          <h3 className="text-sm font-semibold text-slate-700 mb-1">Ventas vs COGS</h3>
          <p className="text-xs text-slate-400 mb-4">Barras claras = pronóstico</p>
          <RevenueChart data={revenueData} />
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm lg:col-span-1">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Capital de trabajo (MXN)</h3>
          <WorkingCapitalChart data={wcData} />
        </div>
      </div>

      {/* Channel mix */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Mix de ventas por canal (Feb 2025)</h3>
          <div className="space-y-3">
            {[
              { channel: 'Autoservicio', pct: 48, color: 'bg-blue-500' },
              { channel: 'Mayoreo', pct: 28, color: 'bg-violet-500' },
              { channel: 'Tienda de proximidad', pct: 14, color: 'bg-emerald-500' },
              { channel: 'Foodservice', pct: 6, color: 'bg-amber-500' },
              { channel: 'Export', pct: 4, color: 'bg-slate-400' },
            ].map(({ channel, pct, color }) => (
              <div key={channel} className="flex items-center gap-3">
                <span className="text-sm text-slate-600 w-40 flex-shrink-0">{channel}</span>
                <div className="flex-1 bg-slate-100 rounded-full h-2.5">
                  <div className={`${color} h-2.5 rounded-full transition-all`} style={{ width: `${pct}%` }} />
                </div>
                <span className="text-sm font-medium text-slate-700 w-10 text-right">{pct}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Top SKUs por volumen — Feb 2025</h3>
          <div className="space-y-2.5">
            {[
              { sku: 'Dolores Atún Agua 170g', cases: 19500, fillRate: 93.2, trend: '+1.2pp' },
              { sku: 'Dolores Pouch Aceite 80g', cases: 27400, fillRate: 92.8, trend: '+0.8pp' },
              { sku: 'Dolores Atún Aceite 170g', cases: 16300, fillRate: 91.5, trend: '-0.3pp' },
              { sku: 'Guardamar Atún Aceite 170g', cases: 9000, fillRate: 89.4, trend: '-1.5pp' },
              { sku: 'La Sirena Sardina Jitomate', cases: 6300, fillRate: 94.1, trend: '+2.1pp' },
            ].map(({ sku, cases, fillRate, trend }) => (
              <div key={sku} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
                <span className="text-sm text-slate-700 flex-1">{sku}</span>
                <span className="text-xs text-slate-400 w-20 text-right">{cases.toLocaleString()} cajas</span>
                <span className={`text-xs font-medium w-16 text-right ${fillRate >= 93 ? 'text-emerald-600' : fillRate >= 90 ? 'text-amber-600' : 'text-red-500'}`}>
                  {fillRate}%
                </span>
                <span className={`text-xs w-14 text-right ${trend.startsWith('+') ? 'text-emerald-500' : 'text-red-400'}`}>{trend}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
