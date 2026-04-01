export function formatCurrency(value: number, compact = false): string {
  if (compact) {
    if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
    if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`
  }
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(value)
}

export function formatPct(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`
}

export function formatNumber(value: number, compact = false): string {
  if (compact) {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
    if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
  }
  return new Intl.NumberFormat('es-MX').format(value)
}

export function deltaColor(value: number, goodIsPositive = true): string {
  if (value === 0) return 'text-slate-500'
  const isGood = goodIsPositive ? value > 0 : value < 0
  return isGood ? 'text-emerald-600' : 'text-red-500'
}

export function deltaSign(value: number): string {
  return value > 0 ? '+' : ''
}
