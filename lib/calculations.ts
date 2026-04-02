import type { ForecastRecord } from '@/data'

/**
 * Calculate MAPE (Mean Absolute Percentage Error) for a set of forecast records
 * Returns a value between 0 and 100 (percentage)
 */
export function calculateMAPE(records: ForecastRecord[], useCollaborated = false): number {
  const withActuals = records.filter(r => r.actual !== null && r.actual > 0)
  if (withActuals.length === 0) return 0

  const errors = withActuals.map(r => {
    const forecast = useCollaborated && r.collaborated !== null ? r.collaborated : r.statistical
    return Math.abs((r.actual! - forecast) / r.actual!)
  })

  return (errors.reduce((a, b) => a + b, 0) / errors.length) * 100
}

/**
 * Forecast accuracy = 1 - MAPE (capped at 0 on the low end)
 */
export function forecastAccuracy(records: ForecastRecord[], useCollaborated = false): number {
  return Math.max(0, 100 - calculateMAPE(records, useCollaborated))
}

/**
 * Forecast bias: positive = over-forecast, negative = under-forecast
 */
export function calculateBias(records: ForecastRecord[], useCollaborated = false): number {
  const withActuals = records.filter(r => r.actual !== null && r.actual > 0)
  if (withActuals.length === 0) return 0

  const biases = withActuals.map(r => {
    const forecast = useCollaborated && r.collaborated !== null ? r.collaborated : r.statistical
    return (forecast - r.actual!) / r.actual!
  })

  return (biases.reduce((a, b) => a + b, 0) / biases.length) * 100
}

/**
 * Simulate financial impact of a scenario
 */
export type ScenarioInputs = {
  rawMaterialPriceChangePct: number   // -30 to +50
  supplyDisruptionPct: number         // 0 to 100 (% of supply at risk)
  demandChangePct: number             // -30 to +50
  safetyStockDays: number             // 15 to 90
}

export type ScenarioOutput = {
  fillRate: number
  inventoryValueMXN: number
  workingCapitalMXN: number
  revenueAtRiskMXN: number
  cogsDeltaMXN: number
}

const BASE = {
  fillRate: 91.4,
  inventoryValueMXN: 82_600_000,
  workingCapitalMXN: 298_500_000,
  revenueMXN: 130_000_000,
  cogsMXN: 83_200_000,
}

export function simulateScenario(inputs: ScenarioInputs, months = 3): ScenarioOutput {
  const supplyFactor = 1 - inputs.supplyDisruptionPct / 100
  const demandFactor = 1 + inputs.demandChangePct / 100
  const rawMatFactor = 1 + inputs.rawMaterialPriceChangePct / 100
  const stockFactor = inputs.safetyStockDays / 33 // 33 is baseline DOC

  // Fill rate degrades with supply disruption (non-linear)
  const fillRate = Math.min(
    99,
    Math.max(50, BASE.fillRate * supplyFactor * (1 + (supplyFactor - 1) * 0.5))
  )

  // Revenue at risk from fill rate drop
  const fillRateDrop = Math.max(0, BASE.fillRate - fillRate) / 100
  const revenueAtRiskMXN = BASE.revenueMXN * months * fillRateDrop * demandFactor

  // Inventory value changes with safety stock policy and demand
  const inventoryValueMXN = BASE.inventoryValueMXN * stockFactor * demandFactor

  // Working capital = inventory + receivables (simplified: inventory * 3.2 factor)
  const workingCapitalMXN = inventoryValueMXN * 3.2 + 35_000_000 // fixed other WC components

  // COGS impact from raw material price changes (52% of COGS is tuna-driven)
  const cogsDeltaMXN = BASE.cogsMXN * months * (rawMatFactor - 1) * 0.52 * demandFactor

  return {
    fillRate: Math.round(fillRate * 10) / 10,
    inventoryValueMXN: Math.round(inventoryValueMXN),
    workingCapitalMXN: Math.round(workingCapitalMXN),
    revenueAtRiskMXN: Math.round(revenueAtRiskMXN),
    cogsDeltaMXN: Math.round(cogsDeltaMXN),
  }
}

export function generateScenarioTimeline(
  inputs: ScenarioInputs,
  months: number
): Array<{ month: number; label: string } & ScenarioOutput & { baselineFillRate: number; baselineWC: number }> {
  const result = []
  const monthLabels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  const startMonth = 2 // March (0-indexed)

  for (let i = 0; i < months; i++) {
    const label = monthLabels[(startMonth + i) % 12]
    const scenarioOut = simulateScenario(inputs, 1)

    // Add slight variance per month to make it look real (deterministic to avoid SSR/CSR mismatch)
    const variance = 0.98 + ((i * 7 + 3) % 5) * 0.008
    result.push({
      month: i + 1,
      label,
      ...scenarioOut,
      fillRate: Math.round(scenarioOut.fillRate * variance * 10) / 10,
      workingCapitalMXN: Math.round(scenarioOut.workingCapitalMXN * (1 + i * 0.01)),
      baselineFillRate: BASE.fillRate,
      baselineWC: BASE.workingCapitalMXN,
    })
  }
  return result
}
