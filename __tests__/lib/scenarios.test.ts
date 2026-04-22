import { describe, it, expect, beforeEach } from 'vitest'
import {
  addScenario,
  loadScenarios,
  deleteScenario,
  toggleExecutiveSession,
  getExecutiveSessionScenarios,
  type SavedScenario,
} from '@/lib/scenarios'

const sampleInput = {
  name: 'Test',
  horizon: 3,
  params: {
    rawMaterialPriceChangePct: 10,
    supplyDisruptionPct: 20,
    demandChangePct: 5,
    safetyStockDays: 33,
  },
  metrics: {
    avgFillRate: 88,
    avgWC: 300_000_000,
    totalRevenueAtRisk: 5_000_000,
    totalCogsDelta: 2_000_000,
    avgProductionEfficiency: 82,
  },
  forExecutiveSession: false,
}

describe('scenarios storage', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('loadScenarios returns empty array when storage is empty', () => {
    expect(loadScenarios()).toEqual([])
  })

  it('addScenario persists and returns full record with id and savedAt', () => {
    const saved = addScenario(sampleInput)
    expect(saved.id).toBeTruthy()
    expect(saved.savedAt).toBeTruthy()
    expect(saved.name).toBe('Test')

    const all = loadScenarios()
    expect(all).toHaveLength(1)
    expect(all[0].id).toBe(saved.id)
  })

  it('addScenario prepends new scenarios (most recent first)', () => {
    const first = addScenario({ ...sampleInput, name: 'First' })
    const second = addScenario({ ...sampleInput, name: 'Second' })
    const all = loadScenarios()
    expect(all[0].id).toBe(second.id)
    expect(all[1].id).toBe(first.id)
  })

  it('deleteScenario removes by id', () => {
    const a = addScenario({ ...sampleInput, name: 'A' })
    addScenario({ ...sampleInput, name: 'B' })
    deleteScenario(a.id)
    const all = loadScenarios()
    expect(all).toHaveLength(1)
    expect(all[0].name).toBe('B')
  })

  it('toggleExecutiveSession flips forExecutiveSession flag', () => {
    const s = addScenario(sampleInput)
    expect(s.forExecutiveSession).toBe(false)

    toggleExecutiveSession(s.id)
    let loaded = loadScenarios()
    expect(loaded[0].forExecutiveSession).toBe(true)

    toggleExecutiveSession(s.id)
    loaded = loadScenarios()
    expect(loaded[0].forExecutiveSession).toBe(false)
  })

  it('getExecutiveSessionScenarios filters to marked only', () => {
    const a = addScenario({ ...sampleInput, name: 'A' })
    addScenario({ ...sampleInput, name: 'B' })
    toggleExecutiveSession(a.id)
    const exec = getExecutiveSessionScenarios()
    expect(exec).toHaveLength(1)
    expect(exec[0].name).toBe('A')
  })

  it('loadScenarios handles corrupted JSON gracefully', () => {
    window.localStorage.setItem('pinsa-scenarios', '{not json}')
    expect(loadScenarios()).toEqual([])
  })

  it('loadScenarios returns empty when stored value is not an array', () => {
    window.localStorage.setItem('pinsa-scenarios', '{"foo":"bar"}')
    expect(loadScenarios()).toEqual([])
  })
})
