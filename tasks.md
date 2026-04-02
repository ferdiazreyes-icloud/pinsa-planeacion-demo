# PINSA Torre de Control — Tasks

## Fase A — Paleta PINSA + Sistema de diseno base [COMPLETADO]

- [x] A1 — Actualizar `globals.css`: paleta PINSA completa (navy `#242d51`, maroon `#601b4d`, dark `#0f1a3b`, gray `#acacac`) + colores semanticos complementarios
- [x] A2 — Mejorar `.ec-card`: box-shadow visible, borde mas definido
- [x] A3 — Actualizar sidebar gradient con nuevos navies (`#0f1a3b` a `#242d51`)
- [x] A4 — Actualizar colores hardcoded en dashboard (channel mix, KPICard status)
- [x] A5 — CSS para sliders estilizados (`input[type=range]`) en Simulador

## Fase B — Migracion a Apache ECharts [COMPLETADO]

- [x] B1 — `npm install echarts echarts-for-react` + `npm uninstall recharts`
- [x] B2 — `components/dashboard/FillRateChart.tsx` a ECharts
- [x] B3 — `components/dashboard/RevenueChart.tsx` a ECharts
- [x] B4 — `components/dashboard/WorkingCapitalChart.tsx` a ECharts
- [x] B5 — `components/sop/Step1Forecast.tsx` a ECharts
- [x] B6 — `components/sop/Step3Quality.tsx` a ECharts
- [x] B7 — `components/sop/Step4Inventory.tsx` a ECharts
- [x] B8 — `app/simulator/page.tsx` a ECharts

## Fase C — Polish final [COMPLETADO]

- [x] C1 — Pass visual completo: Home, Dashboard, S&OP (stepper + Step5Finance + AlertBanner), Simulador
- [x] C2 — Margenes de charts con `containLabel: true` y right margins en ECharts
- [x] C3 — Build limpio 0 errores TypeScript

## Fase T — Testing exhaustivo [COMPLETADO]

### T1 — Infraestructura
- [x] T1.1 — Instalar Vitest + React Testing Library + jsdom
- [x] T1.2 — Instalar Playwright + browsers
- [x] T1.3 — Crear `vitest.config.ts` + `vitest.setup.ts`
- [x] T1.4 — Crear `playwright.config.ts`
- [x] T1.5 — Scripts en `package.json`: `test`, `test:ui`, `test:e2e`

### T2 — Unit tests: `lib/`
- [x] T2.1 — `__tests__/lib/calculations.test.ts` (calculateMAPE, forecastAccuracy, calculateBias, simulateScenario, generateScenarioTimeline)
- [x] T2.2 — `__tests__/lib/formatters.test.ts` (formatCurrency, formatPct, formatNumber, deltaColor, deltaSign)

### T3 — Feature: validacion de valores extremos
- [x] T3.1 — `isExtremeScenario()` en `lib/calculations.ts`
- [x] T3.2 — Banner de advertencia en Simulador cuando supplyDisruption > 60 Y demandChange > 30
- [x] T3.3 — Tests unitarios para `isExtremeScenario()`

### T4 — Component tests
- [x] T4.1 — `__tests__/components/KPICard.test.tsx`
- [x] T4.2 — `__tests__/components/AlertBanner.test.tsx`
- [x] T4.3 — `__tests__/components/Sidebar.test.tsx`

### T5 — E2E Playwright (localhost:3001)
- [x] T5.1 — `e2e/home.spec.ts` (carga, 4 role cards, navegacion)
- [x] T5.2 — `e2e/dashboard.spec.ts` (KPIs, alertas, charts, tablas)
- [x] T5.3 — `e2e/sop.spec.ts` (flujo completo 5 pasos, aprobacion)
- [x] T5.4 — `e2e/simulator.spec.ts` (sliders, reset, banner extremo)

### T6 — Resultados
- [x] T6.1 — Documentar resultados en `TEST-RESULTS.md` (133/133 tests pasan)

## Fase D — Documentacion y tutoriales [COMPLETADO]

- [x] D1 — Actualizar `README.md` a v0.3.0
- [x] D2 — Crear `docs/RESUMEN_SISTEMA.md` — resumen ejecutivo de una pagina
- [x] D3 — Crear `docs/GUIA_DEMO.md` — tutorial paso a paso para presentar el demo

---

## Backlog V1

- [ ] Datos reales via API (PostgreSQL Railway add-on)
- [ ] Autenticacion por rol (NextAuth)
- [ ] Multi-tenant
- [ ] Export PDF/Excel del plan S&OP
- [ ] Notificaciones y alertas automaticas
