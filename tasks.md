# PINSA Torre de Control — Tasks

## Fase A — Paleta PINSA + Sistema de diseño base ✅

- [x] A1 — Actualizar `globals.css`: paleta PINSA completa (navy `#242d51`, maroon `#601b4d`, dark `#0f1a3b`, gray `#acacac`) + colores semánticos complementarios
- [x] A2 — Mejorar `.ec-card`: box-shadow visible, borde más definido
- [x] A3 — Actualizar sidebar gradient con nuevos navies (`#0f1a3b` → `#242d51`)
- [x] A4 — Actualizar colores hardcoded en dashboard (channel mix, KPICard status)
- [x] A5 — CSS para sliders estilizados (`input[type=range]`) en Simulador

## Fase B — Migración a Apache ECharts ✅

- [x] B1 — `npm install echarts echarts-for-react` + `npm uninstall recharts`
- [x] B2 — `components/dashboard/FillRateChart.tsx` → ECharts
- [x] B3 — `components/dashboard/RevenueChart.tsx` → ECharts
- [x] B4 — `components/dashboard/WorkingCapitalChart.tsx` → ECharts
- [x] B5 — `components/sop/Step1Forecast.tsx` → ECharts
- [x] B6 — `components/sop/Step3Quality.tsx` → ECharts
- [x] B7 — `components/sop/Step4Inventory.tsx` → ECharts
- [x] B8 — `app/simulator/page.tsx` → ECharts

## Fase T — Testing exhaustivo

### T1 — Infraestructura
- [ ] T1.1 — Instalar Vitest + React Testing Library + jsdom
- [ ] T1.2 — Instalar Playwright + browsers
- [ ] T1.3 — Crear `vitest.config.ts` + `vitest.setup.ts`
- [ ] T1.4 — Crear `playwright.config.ts`
- [ ] T1.5 — Scripts en `package.json`: `test`, `test:ui`, `test:e2e`

### T2 — Unit tests: `lib/`
- [ ] T2.1 — `__tests__/lib/calculations.test.ts` (calculateMAPE, forecastAccuracy, calculateBias, simulateScenario, generateScenarioTimeline)
- [ ] T2.2 — `__tests__/lib/formatters.test.ts` (formatCurrency, formatPct, formatNumber, deltaColor, deltaSign)

### T3 — Feature: validación de valores extremos
- [ ] T3.1 — `isExtremeScenario()` en `lib/calculations.ts`
- [ ] T3.2 — Banner de advertencia en Simulador cuando supplyDisruption > 60 Y demandChange > 30
- [ ] T3.3 — Tests unitarios para `isExtremeScenario()`

### T4 — Component tests
- [ ] T4.1 — `__tests__/components/KPICard.test.tsx`
- [ ] T4.2 — `__tests__/components/AlertBanner.test.tsx`
- [ ] T4.3 — `__tests__/components/Sidebar.test.tsx`

### T5 — E2E Playwright (localhost:3000)
- [ ] T5.1 — `e2e/home.spec.ts` (carga, 4 role cards, navegación)
- [ ] T5.2 — `e2e/dashboard.spec.ts` (KPIs, alertas, charts, tablas)
- [ ] T5.3 — `e2e/sop.spec.ts` (flujo completo 5 pasos, aprobación)
- [ ] T5.4 — `e2e/simulator.spec.ts` (sliders, reset, banner extremo)

### T6 — Resultados
- [ ] T6.1 — Documentar resultados en `TEST-RESULTS.md`

---

## Fase C — Polish final ✅

- [x] C1 — Pass visual completo: Home, Dashboard, S&OP (stepper + Step5Finance + AlertBanner), Simulador
- [x] C2 — Márgenes de charts con `containLabel: true` y right margins en ECharts
- [x] C3 — Build limpio 0 errores TypeScript
