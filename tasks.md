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

## Fase C — Polish final ✅

- [x] C1 — Pass visual completo: Home, Dashboard, S&OP (stepper + Step5Finance + AlertBanner), Simulador
- [x] C2 — Márgenes de charts con `containLabel: true` y right margins en ECharts
- [x] C3 — Build limpio 0 errores TypeScript
