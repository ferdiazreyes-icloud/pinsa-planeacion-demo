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

### E1 — Forecast con intervalo de confianza (Paso 1)

- [ ] E1.1 — Extender `data/forecast.json` con campos `forecastLow` y `forecastHigh` por SKU/mes (baseline ± rango)
- [ ] E1.2 — Actualizar `components/sop/Step1Forecast.tsx`: graficar banda de confianza (área sombreada entre high/low) además de la línea baseline
- [ ] E1.3 — Copy explicativo en la vista: "el rango, no el número, define tu stock de seguridad"
- [ ] E1.4 — Agregar chips visuales de eventos calendáricos (Semana Santa, temporada calor, Navidad) sobre el eje de tiempo

### E2 — Forecast Value Added en Paso 2 (Colaboración Comercial)

- [ ] E2.1 — Agregar selector de categoría de ajuste en tabla editable (`promoción / lanzamiento / acuerdo anaquel / acción competencia`)
- [ ] E2.2 — Mostrar FVA histórico por categoría (mock de datos): "Ajustes de tipo X mejoraron/empeoraron el baseline en Y% últimos 6 ciclos"
- [ ] E2.3 — Badge visual (verde/rojo) al lado del ajuste según el FVA histórico de esa categoría

### E3 — Planeación de Producción con brecha de capacidad (Paso 4)

- [ ] E3.1 — Nuevo dataset `data/productionCapacity.json` con capacidad por línea/semana (14 líneas según brief), lotes mínimos, tiempo de arranque
- [ ] E3.2 — Nuevo componente `Step4Production.tsx` con programa línea × semana
- [ ] E3.3 — **Brecha explícita** cuando demanda > capacidad: mostrar 3 opciones modeladas con impactos:
  - Opción A: Ampliar turno (costo $, impacto servicio)
  - Opción B: Quiebre controlado (ventas perdidas $, fill rate impacto)
  - Opción C: Ajustar plan de ventas (revenue perdido $, alineación comercial)
- [ ] E3.4 — CTA "Escalar a Sesión Ejecutiva" para las brechas no resueltas

### E4 — Vista Sesión Ejecutiva Mensual (nuevo módulo)

- [ ] E4.1 — Nueva ruta `/sesion-ejecutiva` con los 4 KPIs del `.md`: Fill Rate, Días Inventario, Forecast Accuracy, Brechas Abiertas
- [ ] E4.2 — Drill-down de 1 clic en cualquier KPI en rojo → causa raíz + opciones
- [ ] E4.3 — Sección "Brechas que requieren decisión" (alimentada por E3.4)
- [ ] E4.4 — Sección "Resumen financiero" (P&L del ciclo, riesgos, capital trabajo) — migrada desde el ex-Paso 5
- [ ] E4.5 — Sección "Escenarios comparados" (alimentada por E6)
- [ ] E4.6 — Agregar tarjeta de acceso en Home

### E5 — Vista multi-nodo inventario (1 planta + 1 CEDIS)

- [ ] E5.1 — Extender `data/inventory.json` con campo `location` (`"planta"` o `"cedis"`)
- [ ] E5.2 — En el nuevo Paso 3 "Planeación de Inventarios": separar vista por ubicación
- [ ] E5.3 — Mostrar señal de reabasto planta → CEDIS cuando CEDIS < target
- [ ] E5.4 — Aplicar política ABC visualmente diferenciada: A (dinámico), B (estándar), C (racionalización)

### E6 — Escenarios guardados en Simulador

- [ ] E6.1 — Botón "Guardar escenario" en `/simulator` → persiste en `localStorage` con nombre
- [ ] E6.2 — Vista lateral "Escenarios guardados" con lista + comparación lado a lado
- [ ] E6.3 — Agregar impacto en **eficiencia de producción** al simulador (4º eje que falta según `.md`)
- [ ] E6.4 — Botón "Llevar a Sesión Ejecutiva" → alimenta E4.5

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
