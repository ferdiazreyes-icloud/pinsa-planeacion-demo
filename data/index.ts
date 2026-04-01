import skus from './skus.json'
import forecast from './forecast.json'
import inventory from './inventory.json'
import rawMaterials from './rawMaterials.json'
import kpis from './kpis.json'

export type SKU = {
  id: string
  name: string
  brand: string
  category: string
  presentation: string
  packType: string
  channels: string[]
  unitPriceMXN: number
  cogsPerCaseMXN: number
  casesPerPallet: number
  abcClass: 'A' | 'B' | 'C'
}

export type ForecastRecord = {
  skuId: string
  period: string
  statistical: number
  collaborated: number | null
  actual: number | null
  adjustmentReason: string | null
}

export type InventoryRecord = {
  skuId: string
  period: string
  openingStock: number
  closingStock: number
  daysOfCover: number
  safetyStockDays: number
  replenishmentOrder: number
  stockValueMXN: number
}

export type Alert = {
  id: string
  severity: 'high' | 'medium' | 'low'
  type: 'supply' | 'forecast' | 'inventory' | 'price'
  title: string
  description: string
  skusAffected: string[]
  financialImpactMXN: number
}

export type MonthlyKPI = {
  period: string
  label: string
  fillRate: number | null
  forecastAccuracy: number | null
  daysOfCover: number | null
  workingCapitalMXN: number | null
  revenue: number
  cogs: number
}

export { skus as SKUs, forecast as Forecast, inventory as Inventory, rawMaterials as RawMaterials }
export const KPIs = kpis
