# TEST-RESULTS.md — PINSA Torre de Control

> Generated: 2026-04-01
> Branch: main

## Summary

| Suite | Tests | Status |
|---|---|---|
| Unit (Vitest + RTL) | 88/88 | ✅ All pass |
| E2E (Playwright) | 45/45 | ✅ All pass |
| **Total** | **133/133** | **✅** |

---

## Unit Tests — 88 tests across 5 files

### `__tests__/lib/calculations.test.ts` — 40+ tests

- `calculateMAPE`: base cases, zero actual, empty array
- `forecastAccuracy`: normal, perfect, exceeds-baseline
- `calculateBias`: positive/negative/zero bias
- `simulateScenario`: normal scenario, extreme scenario (supply>60 + demand>30), edge values, raw material impact on COGS
- `generateScenarioTimeline`: determinism (same inputs → same output), length by horizon (1/3/6/12), monotonicity of adjusted fill rate vs baseline
- `isExtremeScenario`: true when supply>60 AND demand>30, false for each condition alone, false at defaults, boundary values (60/30 are NOT extreme)

### `__tests__/lib/formatters.test.ts` — 14 tests

- `formatCurrency`: MXN formatting, millions abbreviation, compact vs full
- `formatPct`: decimal precision, sign handling
- `formatNumber`: comma separators
- `formatDays`: singular/plural
- `formatVariance`: positive/negative with sign

### `__tests__/components/KPICard.test.tsx` — 10 tests

- Renders label, value, trend, budget line
- Status badge: ok=`#1A7A6E`, warning=`#B87D1A`, critical=`#9B1C4A`
- IntersectionObserver mock to bypass opacity animation
- Negative trend shows TrendingDown icon

### `__tests__/components/AlertBanner.test.tsx` — 6 tests

- Renders alert message and impact value
- Severity colors: high=`#9B1C4A`, medium=`#B87D1A`, low=`#242d51`
- Dismiss button visible, handles click without crash

### `__tests__/components/Sidebar.test.tsx` — 8 tests

- PINSA logo visible
- All nav links render: `/dashboard`, `/sop`, `/simulator`
- Active link highlighted when `usePathname` matches
- Nav labels: "Dashboard Ejecutivo", "Ciclo S&OP", "Simulador"

---

## E2E Tests — 45 tests across 4 spec files

### `e2e/home.spec.ts` — 7 tests

- Branding: "Demo PINSA 2025", "S&OP / IBP Control Tower"
- Headline: "Orquesta tu cadena", "de valor completa"
- 4 role cards with correct hrefs
- All role names visible
- KPI strip: Fill Rate, Asertividad, Capital trabajo, Días cobertura
- Navigation: Directivo → `/dashboard`, Planeador → `/sop`, Simulador → `/simulator`

### `e2e/dashboard.spec.ts` — 9 tests

- Page title "Dashboard Ejecutivo"
- 4 KPI cards (with `waitForTimeout(600)` for IntersectionObserver)
- Status badges present (at least 1 of: En meta / Por mejorar / Alerta)
- "Alertas activas" section visible
- At least 1 alert with severity label
- 3 chart titles: "Fill Rate — 12 meses", "Ventas vs COGS", "Capital de trabajo (MXN)"
- ≥ 3 canvas elements (ECharts)
- "Mix de ventas por canal" with Autoservicio + Mayoreo
- "Top SKUs" table with Dolores Atún Agua 170g
- Sidebar navigation visible

### `e2e/sop.spec.ts` — 13 tests

- Page title + "Marzo 2025"
- Stepper shows 5 steps (Pronóstico, Colaboración, Calidad, Inventarios, Finanzas)
- Step 1 content visible by default ("Pronóstico estadístico", "Asertividad Feb 2025")
- Step 1 KPI cards: Asertividad, Mejora con colaboración, Sesgo del pronóstico
- Step 1 canvas renders
- Navigate step 1 → 2 ("Colaboración de ventas")
- Navigate all 5 steps in sequence
- Back button returns to previous step
- Back button disabled on step 1
- Step 5 P&L section: "P&L proyectado", Ventas netas, Margen bruto
- Step 5 risk flags visible
- Step 5 approve button → "Plan Marzo 2025 aprobado"
- Step 5 reject button → "Plan devuelto a revisión"
- Step 4 inventory chart renders (≥1 canvas)

### `e2e/simulator.spec.ts` — 11 tests (+ 3 for extreme warning feature)

- Page title "Simulador de Escenarios"
- 4 sliders (Precio MP, Desabasto MP, Variación demanda, Stock seguridad)
- Horizon selector: 1 mes, 3 meses, 6 meses, 12 meses
- Impact summary section visible
- Charts render (≥2 canvas)
- Reset button NOT visible at defaults
- Reset button appears after slider change
- Reset restores default values (33d safety stock)
- Horizon selector changes time range without crash
- **Extreme warning NOT visible at default values**
- **Extreme warning APPEARS when supply > 60 AND demand > 30**
- **Extreme warning DISAPPEARS when values return to safe range**
- Narrative interpretation appears when `hasChanges`

---

## Known Issues / Notes

None. All 133 tests pass cleanly on localhost:3001.

---

## How to Run

```bash
# Unit tests (fast, ~1s)
npm run test

# E2E tests (requires dev server running on :3001)
npm run test:e2e

# Interactive E2E UI
npm run test:e2e:ui
```
