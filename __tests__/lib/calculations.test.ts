import { describe, it, expect } from 'vitest'
import {
  calculateMAPE,
  forecastAccuracy,
  calculateBias,
  simulateScenario,
  generateScenarioTimeline,
  isExtremeScenario,
} from '@/lib/calculations'
import type { ForecastRecord } from '@/data'

// ── Helpers ──────────────────────────────────────────────────────────────────

function makeRecord(actual: number, statistical: number, collaborated?: number): ForecastRecord {
  return {
    skuId: 'TEST-SKU',
    period: '2025-01',
    statistical,
    collaborated: collaborated ?? null,
    actual,
    adjustmentReason: null,
    forecastLow: Math.round(statistical * 0.9),
    forecastHigh: Math.round(statistical * 1.1),
  }
}

const baseInputs = {
  rawMaterialPriceChangePct: 0,
  supplyDisruptionPct: 0,
  demandChangePct: 0,
  safetyStockDays: 33,
}

// ── calculateMAPE ─────────────────────────────────────────────────────────────

describe('calculateMAPE', () => {
  it('returns 0 for empty records', () => {
    expect(calculateMAPE([])).toBe(0)
  })

  it('returns 0 when no record has actual data', () => {
    const records: ForecastRecord[] = [
      { skuId: 'X', period: '2025-01', statistical: 100, collaborated: null, actual: null, adjustmentReason: null, forecastLow: 90, forecastHigh: 110 },
    ]
    expect(calculateMAPE(records)).toBe(0)
  })

  it('returns 0 for perfect forecast', () => {
    const records = [makeRecord(100, 100), makeRecord(200, 200)]
    expect(calculateMAPE(records)).toBe(0)
  })

  it('calculates MAPE correctly for a single record', () => {
    // |actual - forecast| / actual = |100 - 80| / 100 = 0.2 = 20%
    const records = [makeRecord(100, 80)]
    expect(calculateMAPE(records)).toBeCloseTo(20, 5)
  })

  it('averages MAPE across multiple records', () => {
    // record1: |100 - 80| / 100 = 20%
    // record2: |200 - 240| / 200 = 20%
    // avg = 20%
    const records = [makeRecord(100, 80), makeRecord(200, 240)]
    expect(calculateMAPE(records)).toBeCloseTo(20, 5)
  })

  it('uses collaborated forecast when useCollaborated=true and collaborated is not null', () => {
    // statistical gives 20% error, collaborated gives 0%
    const records = [makeRecord(100, 80, 100)]
    expect(calculateMAPE(records, true)).toBeCloseTo(0, 5)
    expect(calculateMAPE(records, false)).toBeCloseTo(20, 5)
  })

  it('falls back to statistical when collaborated is null', () => {
    const records = [makeRecord(100, 80, null)]
    expect(calculateMAPE(records, true)).toBeCloseTo(20, 5)
  })

  it('ignores records where actual is null', () => {
    const records = [
      makeRecord(100, 80),
      { skuId: 'X', period: '2025-01', statistical: 999, collaborated: null, actual: null, adjustmentReason: null, forecastLow: 900, forecastHigh: 1100 },
    ]
    expect(calculateMAPE(records)).toBeCloseTo(20, 5)
  })

  it('ignores records where actual is zero (division by zero guard)', () => {
    const records = [
      makeRecord(100, 80),
      makeRecord(0, 50),
    ]
    // Only the first record counts
    expect(calculateMAPE(records)).toBeCloseTo(20, 5)
  })
})

// ── forecastAccuracy ──────────────────────────────────────────────────────────

describe('forecastAccuracy', () => {
  it('returns 100 for perfect forecast', () => {
    const records = [makeRecord(100, 100)]
    expect(forecastAccuracy(records)).toBe(100)
  })

  it('returns 100 - MAPE', () => {
    const records = [makeRecord(100, 80)] // MAPE = 20%
    expect(forecastAccuracy(records)).toBeCloseTo(80, 5)
  })

  it('is floored at 0 for very bad forecasts', () => {
    // MAPE = |100 - 1000| / 100 = 900%  →  100 - 900 = -800, floored at 0
    const records = [makeRecord(100, 1000)]
    expect(forecastAccuracy(records)).toBe(0)
  })

  it('returns 0 for empty records (MAPE is 0, accuracy 100 - 0 = 100)', () => {
    // calculateMAPE returns 0 for empty → accuracy = 100
    expect(forecastAccuracy([])).toBe(100)
  })
})

// ── calculateBias ─────────────────────────────────────────────────────────────

describe('calculateBias', () => {
  it('returns 0 for empty records', () => {
    expect(calculateBias([])).toBe(0)
  })

  it('returns 0 for unbiased forecast', () => {
    const records = [makeRecord(100, 100), makeRecord(200, 200)]
    expect(calculateBias(records)).toBe(0)
  })

  it('returns positive bias when over-forecasting', () => {
    // (forecast - actual) / actual = (120 - 100) / 100 = 0.2 → 20%
    const records = [makeRecord(100, 120)]
    expect(calculateBias(records)).toBeCloseTo(20, 5)
  })

  it('returns negative bias when under-forecasting', () => {
    // (80 - 100) / 100 = -0.2 → -20%
    const records = [makeRecord(100, 80)]
    expect(calculateBias(records)).toBeCloseTo(-20, 5)
  })

  it('uses collaborated forecast when useCollaborated=true', () => {
    const records = [makeRecord(100, 80, 105)]
    expect(calculateBias(records, true)).toBeCloseTo(5, 5)
    expect(calculateBias(records, false)).toBeCloseTo(-20, 5)
  })
})

// ── simulateScenario ──────────────────────────────────────────────────────────

describe('simulateScenario', () => {
  it('returns baseline fill rate with no disruption', () => {
    const out = simulateScenario(baseInputs)
    expect(out.fillRate).toBe(91.4)
  })

  it('fill rate degrades with supply disruption', () => {
    const out = simulateScenario({ ...baseInputs, supplyDisruptionPct: 50 })
    expect(out.fillRate).toBeLessThan(91.4)
    expect(out.fillRate).toBeGreaterThanOrEqual(50)
  })

  it('fill rate is capped at 99', () => {
    const out = simulateScenario({ ...baseInputs, supplyDisruptionPct: 0, demandChangePct: -30 })
    expect(out.fillRate).toBeLessThanOrEqual(99)
  })

  it('fill rate is floored at 50', () => {
    const out = simulateScenario({ ...baseInputs, supplyDisruptionPct: 80 })
    expect(out.fillRate).toBeGreaterThanOrEqual(50)
  })

  it('revenueAtRiskMXN is 0 with no disruption', () => {
    const out = simulateScenario(baseInputs)
    expect(out.revenueAtRiskMXN).toBe(0)
  })

  it('revenueAtRiskMXN increases with supply disruption', () => {
    const out = simulateScenario({ ...baseInputs, supplyDisruptionPct: 40 })
    expect(out.revenueAtRiskMXN).toBeGreaterThan(0)
  })

  it('cogsDeltaMXN is 0 with no raw material change', () => {
    const out = simulateScenario(baseInputs)
    expect(out.cogsDeltaMXN).toBe(0)
  })

  it('cogsDeltaMXN is positive when raw material price increases', () => {
    const out = simulateScenario({ ...baseInputs, rawMaterialPriceChangePct: 20 })
    expect(out.cogsDeltaMXN).toBeGreaterThan(0)
  })

  it('cogsDeltaMXN is negative when raw material price decreases', () => {
    const out = simulateScenario({ ...baseInputs, rawMaterialPriceChangePct: -20 })
    expect(out.cogsDeltaMXN).toBeLessThan(0)
  })

  it('working capital increases with higher safety stock', () => {
    const low  = simulateScenario({ ...baseInputs, safetyStockDays: 15 })
    const high = simulateScenario({ ...baseInputs, safetyStockDays: 90 })
    expect(high.workingCapitalMXN).toBeGreaterThan(low.workingCapitalMXN)
  })

  it('all output values are rounded integers (no decimals except fillRate)', () => {
    const out = simulateScenario({ ...baseInputs, supplyDisruptionPct: 30, rawMaterialPriceChangePct: 15 })
    expect(out.inventoryValueMXN).toBe(Math.round(out.inventoryValueMXN))
    expect(out.workingCapitalMXN).toBe(Math.round(out.workingCapitalMXN))
    expect(out.revenueAtRiskMXN).toBe(Math.round(out.revenueAtRiskMXN))
    expect(out.cogsDeltaMXN).toBe(Math.round(out.cogsDeltaMXN))
  })

  it('handles extreme inputs without crashing (80% disruption + 50% demand)', () => {
    expect(() =>
      simulateScenario({ ...baseInputs, supplyDisruptionPct: 80, demandChangePct: 50 })
    ).not.toThrow()
    const out = simulateScenario({ ...baseInputs, supplyDisruptionPct: 80, demandChangePct: 50 })
    expect(out.fillRate).toBeGreaterThanOrEqual(50)
    expect(out.fillRate).toBeLessThanOrEqual(99)
  })
})

// ── generateScenarioTimeline ──────────────────────────────────────────────────

describe('generateScenarioTimeline', () => {
  it('returns the correct number of data points', () => {
    expect(generateScenarioTimeline(baseInputs, 1)).toHaveLength(1)
    expect(generateScenarioTimeline(baseInputs, 3)).toHaveLength(3)
    expect(generateScenarioTimeline(baseInputs, 6)).toHaveLength(6)
    expect(generateScenarioTimeline(baseInputs, 12)).toHaveLength(12)
  })

  it('each point has the required fields', () => {
    const [point] = generateScenarioTimeline(baseInputs, 1)
    expect(point).toHaveProperty('month')
    expect(point).toHaveProperty('label')
    expect(point).toHaveProperty('fillRate')
    expect(point).toHaveProperty('workingCapitalMXN')
    expect(point).toHaveProperty('revenueAtRiskMXN')
    expect(point).toHaveProperty('cogsDeltaMXN')
    expect(point).toHaveProperty('baselineFillRate')
    expect(point).toHaveProperty('baselineWC')
  })

  it('month numbers are sequential starting at 1', () => {
    const data = generateScenarioTimeline(baseInputs, 4)
    data.forEach((d, i) => expect(d.month).toBe(i + 1))
  })

  it('is deterministic — same inputs always produce same output', () => {
    const a = generateScenarioTimeline(baseInputs, 3)
    const b = generateScenarioTimeline(baseInputs, 3)
    a.forEach((pointA, i) => {
      expect(pointA.fillRate).toBe(b[i].fillRate)
      expect(pointA.workingCapitalMXN).toBe(b[i].workingCapitalMXN)
    })
  })

  it('baseline fill rate is always the same regardless of inputs', () => {
    const data = generateScenarioTimeline({ ...baseInputs, supplyDisruptionPct: 50 }, 3)
    data.forEach(d => expect(d.baselineFillRate).toBe(91.4))
  })
})

// ── isExtremeScenario ─────────────────────────────────────────────────────────

describe('isExtremeScenario', () => {
  it('returns false for baseline inputs', () => {
    expect(isExtremeScenario(baseInputs)).toBe(false)
  })

  it('returns false when only supply is extreme', () => {
    expect(isExtremeScenario({ ...baseInputs, supplyDisruptionPct: 80 })).toBe(false)
  })

  it('returns false when only demand is extreme', () => {
    expect(isExtremeScenario({ ...baseInputs, demandChangePct: 50 })).toBe(false)
  })

  it('returns false at boundary values (exactly 60 and 30)', () => {
    expect(isExtremeScenario({ ...baseInputs, supplyDisruptionPct: 60, demandChangePct: 30 })).toBe(false)
  })

  it('returns true when both supply > 60 AND demand > 30', () => {
    expect(isExtremeScenario({ ...baseInputs, supplyDisruptionPct: 61, demandChangePct: 31 })).toBe(true)
  })

  it('returns true for maximum extreme values (80% disruption + 50% demand)', () => {
    expect(isExtremeScenario({ ...baseInputs, supplyDisruptionPct: 80, demandChangePct: 50 })).toBe(true)
  })

  it('returns false when demand is negative even with high supply disruption', () => {
    expect(isExtremeScenario({ ...baseInputs, supplyDisruptionPct: 80, demandChangePct: -20 })).toBe(false)
  })
})

// ── productionEfficiency ──────────────────────────────────────────────────────

describe('productionEfficiency', () => {
  it('returns baseline 85% for no changes', () => {
    expect(simulateScenario(baseInputs).productionEfficiency).toBe(85)
  })

  it('drops with supply disruption (less input → less throughput)', () => {
    const out = simulateScenario({ ...baseInputs, supplyDisruptionPct: 40 })
    expect(out.productionEfficiency).toBeLessThan(85)
  })

  it('rises with moderate demand increase (more throughput)', () => {
    const out = simulateScenario({ ...baseInputs, demandChangePct: 20 })
    expect(out.productionEfficiency).toBeGreaterThan(85)
  })

  it('caps contribution of demand at +30% (overload ceiling)', () => {
    const at30  = simulateScenario({ ...baseInputs, demandChangePct: 30 })
    const at50  = simulateScenario({ ...baseInputs, demandChangePct: 50 })
    // Demand above 30 should not add additional efficiency
    expect(at50.productionEfficiency).toBe(at30.productionEfficiency)
  })

  it('drops with deep negative demand (line idling)', () => {
    const out = simulateScenario({ ...baseInputs, demandChangePct: -30 })
    expect(out.productionEfficiency).toBeLessThan(85)
  })

  it('clamps between 40 and 100', () => {
    const worst = simulateScenario({ ...baseInputs, supplyDisruptionPct: 80, demandChangePct: -30 })
    expect(worst.productionEfficiency).toBeGreaterThanOrEqual(40)
    const best = simulateScenario({ ...baseInputs, supplyDisruptionPct: 0, demandChangePct: 30 })
    expect(best.productionEfficiency).toBeLessThanOrEqual(100)
  })

  it('is a number with at most 1 decimal place', () => {
    const out = simulateScenario({ ...baseInputs, supplyDisruptionPct: 25, demandChangePct: 15 })
    expect(out.productionEfficiency).toBe(Math.round(out.productionEfficiency * 10) / 10)
  })
})
