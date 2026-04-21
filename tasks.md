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

## Fase E — Alineación con propuesta Arena Analytics (v0.5.0) [PROPUESTO]

> Objetivo: cerrar las brechas entre el demo y la propuesta de diseño full (`diseno-solucion-full/Propuesta-diseno-full-Pinsa.md` + `AAN Brief - Pinsa Ops.pdf`) para que la narrativa del demo sea coherente 1:1 con el pitch comercial.

### E0 — Quick wins (ajustes de datos y nombres, bajo riesgo) [COMPLETADO v0.4.1]

- [x] E0.1 — Corregir marcas en `data/skus.json`: reemplazar `Guardamar` y `La Sirena` por las marcas reales de PINSA (`Dolores`, `Mazatún`, `El Dorado`, `Portola`). Actualizar todas las referencias en componentes y tests.
- [x] E0.2 — Corregir canales en `data/skus.json` y componentes: pasar de genéricos (`Autoservicio`, `Mayoreo`) a cuentas nombradas agrupadas por tipo (Autoservicios, Clubes de Precio, Conveniencia, Mayoristas, Distribuidores, Foodservice, Exportación) con hints visuales de cuentas reales (Walmart, Sam's, OXXO, Zorro, etc.)
- [x] E0.3 — Renombrar pasos del stepper S&OP para alinear con la propuesta:
  - Paso 3: `Revisión de Calidad` → **`Planeación de Inventarios`** (componente Step4Inventory)
  - Paso 4: `Plan de Inventarios` → **`Planeación de Producción`** (nuevo componente Step4Production preview con brecha capacidad + 3 opciones)
  - Paso 5: `Validación Financiera` → **`Planeación de Distribución`** (nuevo componente Step5Distribution preview planta→CEDIS)
  - Step3Quality.tsx y Step5Finance.tsx preservados para migrar a Sesión Ejecutiva (E4)
- [x] E0.4 — Validación: build ✅ · 88 unit tests ✅ · 44 E2E tests ✅

### E1 — Forecast con intervalo de confianza (Paso 1) [COMPLETADO v0.4.2]

- [x] E1.1 — Extender `data/forecast.json` con campos `forecastLow` y `forecastHigh` por SKU/mes (volatilidad diferenciada DOL 10-12%, MAZ 13%, ELD 16%, POR 18%, + premium por eventos estacionales)
- [x] E1.2 — Migrar `components/sop/Step1Forecast.tsx` de bar a line chart con banda de confianza stacked (área sombreada `rgba(36,45,81,0.12)` entre high/low)
- [x] E1.3 — Copy explicativo con ejemplo numérico concreto Abril 2026: "el rango — no el número — define tu stock de seguridad"
- [x] E1.4 — Chips de eventos calendáricos (Buen Fin, Navidad, Cuaresma · Semana Santa) sobre el eje temporal

### E2 — Forecast Value Added en Paso 2 (Colaboración Comercial) [COMPLETADO v0.4.3]

- [x] E2.1 — Selector de categoría de ajuste (5 categorías: Promoción, Estacionalidad, Lanzamiento NPI, Acuerdo de anaquel, Acción competencia)
- [x] E2.2 — FVA histórico mock por categoría en tarjetas superiores: Promoción +8.2%, Estacionalidad +6.1%, Lanzamiento +4.1%, Anaquel +2.5%, Competencia −3.8% (n=11-42 por cat.)
- [x] E2.3 — Badge verde/rojo inline al lado del ajuste según FVA histórico + FVA proyectado del ciclo como chip agregado

### E3 — Planeación de Producción con brecha de capacidad (Paso 4) [COMPLETADO v0.4.4]

- [x] E3.1 — Dataset `data/productionCapacity.json` con 14 líneas reales PINSA: capacidad semanal, demanda, lote mínimo, setup hours, status
- [x] E3.2 — `Step4Production.tsx` funcional con bar chart capacidad vs demanda + tabla detalle por línea
- [x] E3.3 — Brecha explícita L5 Pouch 80g Portola (118% util, 17K cajas): 3 opciones con impactos $ calculados (+$1.85M OPEX / −$3.4M ventas / −$4.8M revenue redistribuido)
- [x] E3.4 — Botón "Escalar a Sesión Ejecutiva" por opción con estado de confirmación

### E4 — Vista Sesión Ejecutiva Mensual (nuevo módulo) [COMPLETADO v0.4.5]

- [x] E4.1 — Nueva ruta `/sesion-ejecutiva` con los 4 KPIs: Fill Rate, Forecast Accuracy, Días Inventario, Brechas Abiertas
- [x] E4.2 — Drill-down de 1 clic por KPI (expande panel con causa raíz + acción sugerida)
- [x] E4.3 — Sección "Brechas que requieren decisión" conectada a `productionCapacity.gapAnalysis` (3 opciones, botón "Elegir esta opción")
- [x] E4.4 — Sección "Resumen financiero" migrada desde Step5Finance (P&L proyectado, 4 indicadores, 4 riesgos)
- [x] E4.5 — Sección "Escenarios comparados" como placeholder preparado para E6
- [x] E4.6 — Tarjeta "Director de Operaciones" en Home + enlace "Sesión Ejecutiva" en Sidebar + 9 nuevos E2E tests

### E5 — Vista multi-nodo inventario (1 planta + 1 CEDIS) [COMPLETADO v0.4.6]

- [x] E5.1 — `data/inventory.json` extendido con `byNode.planta` y `byNode.cedis` (stock, días, target, valor); splits por ABC class (A: 60/40, B: 65/35, C: 75/25)
- [x] E5.2 — Paso 3 con toggle Consolidado/Planta/CEDIS que cambia KPIs, gráfica y cálculos
- [x] E5.3 — Señales de reabasto automáticas cuando CEDIS < target con cantidad calculada
- [x] E5.4 — Política ABC diferenciada visible en 3 tarjetas + badges inline en tabla

### E6 — Escenarios guardados en Simulador [COMPLETADO v0.5.0]

- [x] E6.1 — Botón "Guardar escenario" con modal de nombre, persistencia en `lib/scenarios.ts` (localStorage)
- [x] E6.2 — Panel de escenarios guardados con lista, cargar, borrar y comparación 2-a-la-vez mediante modal
- [x] E6.3 — 4º KPI Eficiencia producción (fórmula: 85 − desabasto×0.55 + min(demanda,30)×0.35 − max(0,−demanda−20)×0.45, clamp 40–100)
- [x] E6.4 — Botón martillo "Para Sesión Ejecutiva" conecta simulador con vista ejecutiva; tabla comparativa de 9 columnas

### E7 — Tests

- [ ] E7.1 — Unit tests para nuevas funciones (FVA, brecha capacidad, comparación escenarios)
- [ ] E7.2 — E2E: flujo completo con el nuevo Paso 4 (Producción) y Sesión Ejecutiva
- [ ] E7.3 — Verificar que 45 E2E existentes sigan pasando con los renombres

### E8 — Documentación

- [ ] E8.1 — Actualizar `README.md` a v0.5.0 con la nueva funcionalidad
- [ ] E8.2 — Actualizar `docs/GUIA_DEMO.md` con el nuevo flujo (Home → Dashboard → 5 pasos → Sesión Ejecutiva → Simulador)
- [ ] E8.3 — Actualizar `docs/RESUMEN_SISTEMA.md`
- [ ] E8.4 — Actualizar `.specify/02-business-architecture.md` y `.specify/03-information-systems-architecture.md` con los nuevos flujos y datasets

---

## Backlog V1

- [ ] Datos reales via API (PostgreSQL Railway add-on)
- [ ] Autenticacion por rol (NextAuth)
- [ ] Multi-tenant
- [ ] Export PDF/Excel del plan S&OP
- [ ] Notificaciones y alertas automaticas
