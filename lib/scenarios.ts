import type { ScenarioInputs } from './calculations'

const STORAGE_KEY = 'pinsa-scenarios'

export type SavedScenario = {
  id: string
  name: string
  savedAt: string // ISO date
  horizon: number
  params: ScenarioInputs
  metrics: {
    avgFillRate: number
    avgWC: number
    totalRevenueAtRisk: number
    totalCogsDelta: number
    avgProductionEfficiency: number
  }
  forExecutiveSession: boolean
}

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

export function loadScenarios(): SavedScenario[] {
  if (!isBrowser()) return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const data = JSON.parse(raw) as SavedScenario[]
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

export function saveScenarios(scenarios: SavedScenario[]): void {
  if (!isBrowser()) return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(scenarios))
}

export function addScenario(scenario: Omit<SavedScenario, 'id' | 'savedAt'>): SavedScenario {
  const full: SavedScenario = {
    ...scenario,
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    savedAt: new Date().toISOString(),
  }
  const list = loadScenarios()
  saveScenarios([full, ...list])
  return full
}

export function deleteScenario(id: string): void {
  const list = loadScenarios().filter(s => s.id !== id)
  saveScenarios(list)
}

export function toggleExecutiveSession(id: string): void {
  const list = loadScenarios().map(s =>
    s.id === id ? { ...s, forExecutiveSession: !s.forExecutiveSession } : s
  )
  saveScenarios(list)
}

export function getExecutiveSessionScenarios(): SavedScenario[] {
  return loadScenarios().filter(s => s.forExecutiveSession)
}
