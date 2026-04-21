# PINSA Torre de Control de Planeacion

Demo interactivo de plataforma S&OP/IBP para mostrar a PINSA el valor de orquestar su cadena de valor.

**Version:** 0.5.0 · **Status:** Demo V0.5 — Alineado con propuesta Arena Analytics (E0–E6 completos) · **Ciclo activo:** Abril 2026

---

## Funcionalidad implementada

- [x] **Home / Role selector** — Landing con 4 roles: Director de Operaciones, Directivo Cadena, Planeador Demanda, Planeador Inventarios
- [x] **Sesión Ejecutiva** (`/sesion-ejecutiva`) — vista mensual de 60 min para decidir (no reportar): 4 KPIs con drill-down, brechas abiertas con 3 opciones, P&L proyectado, decisión del ciclo
- [x] **Dashboard Directivo** — KPI cards continuos, alertas activas, gráficas de tendencia (12 meses)
- [x] **Ciclo S&OP Mensual (5 pasos — alineado con propuesta Arena Analytics):**
  - [x] Paso 1: Pronóstico estadístico con accuracy por SKU
  - [x] Paso 2: Colaboración comercial (tabla editable con cuentas nombradas: Walmart, OXXO, Sam's, etc.)
  - [x] Paso 3: Planeación de Inventarios (dias de cobertura, ordenes de reposicion)
  - [x] Paso 4: Planeación de Producción (programa por línea, brecha capacidad con 3 opciones modeladas)
  - [x] Paso 5: Planeación de Distribución (plan Planta Mazatlán → CEDIS México)
- [x] **Simulador de Escenarios** — 4 variables (precio MP, desabasto, demanda, politica inventario), horizonte 1-12 meses, graficas reactivas en tiempo real

## Completado en v0.5.0 (Fase E6 — Escenarios guardados + Eficiencia producción)

- [x] **Persistencia localStorage** (`lib/scenarios.ts`): guardar, cargar, borrar y marcar escenarios para Sesión Ejecutiva
- [x] **Botón "Guardar escenario"** en Simulador con modal para nombrar el escenario
- [x] **Panel "Escenarios guardados"** con lista, resumen de parámetros y métricas (Fill Rate, WC, Eficiencia)
- [x] **Comparación lado a lado** (modal) de 2 escenarios seleccionables mediante checkbox
- [x] **Botón martillo** para marcar escenario "para Sesión Ejecutiva" — aparece en la vista ejecutiva
- [x] **4º KPI Eficiencia producción** al simulador (según propuesta full): fórmula derivada de desabasto, demanda y utilización — rango 40–100%
- [x] **Sección "Escenarios what-if" en Sesión Ejecutiva** conectada a los marcados: tabla con 9 columnas comparativas
- [x] **4 nuevos E2E tests** para persistencia y conexión simulador↔sesión ejecutiva

## Completado en v0.4.6 (Fase E5 — Inventario multi-nodo + política ABC)

- [x] **Inventario por nodo**: cada registro ahora tiene desglose Planta Mazatlán vs CEDIS México con stock, días de cobertura y target por ubicación
- [x] **Toggle de vista** en Paso 3: Consolidado · Planta · CEDIS — cambia KPIs, gráfica y cálculos de status
- [x] **Política ABC diferenciada** visible: 3 tarjetas explican Clase A (seguridad dinámico, reabasto semanal), B (estándar, quincenal), C (racionalización, bajo demanda)
- [x] **Señales de reabasto Planta→CEDIS** automáticas cuando cobertura CEDIS < target, con cantidad calculada en cajas a enviar
- [x] **Badges ABC** en tabla con fondo de color por clase
- [x] **Diagrama de red** Planta → CEDIS visible en el header del paso
- [x] **Data layer**: `InventoryNode` type + `Inventory` como `InventoryRecord[]` tipado

## Completado en v0.4.5 (Fase E4 — Sesión Ejecutiva S&OP)

- [x] **Nuevo módulo** `/sesion-ejecutiva` — vista mensual de decisión, complementaria al Dashboard continuo
- [x] **4 KPIs ejecutivos con drill-down**: Fill Rate OTIF, Forecast Accuracy, Días Inventario, Brechas Abiertas. Un clic expande causa raíz + acción sugerida
- [x] **Sección "Brechas que requieren decisión"**: las 3 opciones de la brecha L5 Pouch con botones "Elegir esta opción" que registran la decisión en el acta
- [x] **Resumen financiero P&L**: migrado desde Step5Finance — 4 indicadores (Ventas, COGS, Margen, Capital) vs presupuesto + 4 riesgos identificados
- [x] **Escenarios comparados**: placeholder preparado (se activa en E6 con escenarios del Simulador)
- [x] **Decisión del ciclo**: botones Aprobar/Rechazar plan Abr 2026 con comentarios del Director de Operaciones
- [x] **Sidebar** actualizado con enlace · **Home** actualizado: tarjeta del Director de Operaciones reemplaza la de Ventas
- [x] **9 nuevos E2E tests** para la ruta `/sesion-ejecutiva`

## Completado en v0.4.4 (Fase E3 — Planeación de Producción con brecha de capacidad)

- [x] **Dataset real** `data/productionCapacity.json` con las **14 líneas de producción** de PINSA (brief), cada una con capacidad semanal, demanda, lote mínimo, tiempo de arranque y estado
- [x] **Bar chart doble**: capacidad (gris) vs demanda (coloreada por estado) por línea
- [x] **Tabla detalle por línea**: SKU primario, utilización %, lote mínimo, setup hours, estado
- [x] **Estados visuales**: OK (en capacidad) · Ajustado · Brecha (demanda > capacidad) · Holgura
- [x] **Brecha detectada automáticamente**: Línea 5 (Pouch 80g Portola) — 118% utilización, 17K cajas de brecha
- [x] **3 opciones modeladas con impactos calculados**:
  - A) Ampliar turno nocturno: +$1.85M OPEX, +22K cajas/sem, mantiene fill rate 95%
  - B) Aceptar quiebre controlado: −$3.4M ventas perdidas, fill rate cae a 87%, riesgo deslistado OXXO
  - C) Renegociar plan Walmart: −$4.8M revenue redistribuido, cero costo directo
- [x] **Botón "Escalar a Sesión Ejecutiva"** por opción (el sistema no decide, presenta para decisión)

## Completado en v0.4.3 (Fase E2 — Forecast Value Added en Colaboración)

- [x] **5 categorías de ajuste** estructuradas: Promoción, Estacionalidad, Lanzamiento NPI, Acuerdo de anaquel, Acción competencia
- [x] **FVA histórico visible** como tarjetas superiores: muestra mejora/deterioro promedio del baseline por tipo de ajuste (n=muestras)
- [x] **Select de categoría** obligatorio en modo edición
- [x] **Badge verde/rojo** al lado del ajuste según FVA histórico de la categoría
- [x] **FVA proyectado del ciclo**: promedio ponderado de las categorías usadas en el S&OP actual
- [x] **Insight comercial**: "acción competencia" empeora baseline (−3.8%) → sobre-reacción. "promoción" y "estacionalidad" son los más predictivos

## Completado en v0.4.2 (Fase E1 — Forecast con intervalo de confianza)

- [x] **Banda de confianza** en Paso 1 del S&OP: área sombreada entre `forecastLow` y `forecastHigh` alrededor del pronóstico estadístico
- [x] **Chart upgrade** de bar a line con banda, smoothing y connectNulls para distinguir histórico vs forward
- [x] **Chips de eventos calendáricos**: Buen Fin, Navidad, Cuaresma · Semana Santa visibles sobre la gráfica
- [x] **Copy narrativo**: "El rango — no el número — define tu stock de seguridad" con ejemplo concreto de Abril 2026
- [x] **Dataset extendido**: `data/forecast.json` ahora incluye `forecastLow` y `forecastHigh` por SKU/mes con volatilidad diferenciada (DOL ±10-12%, MAZ ±13%, ELD ±16%, POR ±18%) y premium por evento estacional

## Completado en v0.4.1 (Fase E0 — Alineación con propuesta full)

- [x] **Marcas reales PINSA**: Dolores, Mazatún, El Dorado, Portola (reemplaza Guardamar/La Sirena)
- [x] **Canales con cuentas nombradas**: Autoservicios (Walmart, Chedraui, Soriana, Bodega), Clubes de Precio (Sam's, Costco, City), Conveniencia (OXXO, 7-Eleven, Super K), Mayoristas (Zorro, 3B, Merza), Distribuidores, Foodservice, Exportación
- [x] **Stepper S&OP renombrado**: Pasos 3/4/5 ahora son Planeación de Inventarios / Producción / Distribución
- [x] **Nuevos componentes preview**: `Step4Production` (brecha capacidad + 3 opciones) y `Step5Distribution` (reposición Planta→CEDIS)
- [x] **Tests actualizados**: 88/88 unit · 44/44 E2E · build limpio

## Completado en v0.4.0

- [x] **Tour guiado interactivo** — Spotlight + tooltip + welcome modal en los 4 módulos (Home, Dashboard, S&OP, Simulador)
- [x] **Sidebar "Ver tour guiado"** — botón persistente en sidebar dispara el tour desde cualquier página
- [x] **Posicionamiento inteligente de tooltip** — auto-flip (bottom↔top, left↔right) y clamp para que nunca salga del viewport
- [x] **Branding Arena Analytics** — logos integrados en Home (footer), Sidebar ("Powered by") y welcome modal del tour
- [x] **Datos actualizados al ciclo Abril 2026** — todos los períodos de JSON y textos de UI actualizados (+13 meses)
- [x] **45/45 tests E2E pasan** — incluyendo fix strict-mode en simulator.spec.ts
- [x] **Documentación UAT** — `docs/UAT_GUIA_PRUEBAS.md` y `docs/UAT_DATOS_DEMO.md`

## Completado en v0.3.0

- [x] **Fase T** — 133 tests exhaustivos (88 unitarios + 45 E2E Playwright), todos pasan
- [x] **Extreme warning banner** — aparece en Simulador cuando desabasto > 60% Y demanda > 30%
- [x] **Bug fix** — flujo de rechazo en Step5Finance (boton "Devolver con observaciones")
- [x] **Documentacion** — TEST-RESULTS.md, GUIA_DEMO.md, RESUMEN_SISTEMA.md

## Completado en v0.2.0

- [x] **Fase A** — Paleta de colores PINSA oficial aplicada en todo el sistema
- [x] **Fase B** — Migracion de Recharts a Apache ECharts (8 componentes)
- [x] **Fase C** — Polish visual final: Home, Dashboard, S&OP, Simulador

Ver `tasks.md` para historial completo de tareas.

## Pendientes (V1)

- [ ] Datos reales via API (PostgreSQL)
- [ ] Autenticacion por rol
- [ ] Multi-tenant (soporte para mas clientes)
- [ ] Export PDF/Excel del plan S&OP
- [ ] Notificaciones y alertas automaticas

## Como correr localmente

```bash
npm install
npm run dev
# Abre http://localhost:3001
```

## Como correr los tests

```bash
# Unit tests (rapido, ~1s)
npm run test

# E2E (requiere dev server corriendo en :3001)
npm run test:e2e

# Ver reporte interactivo de E2E
npm run test:e2e:ui
```

## Como hacer build

```bash
npm run build
npm run start
```

## Deploy en Railway

1. Conecta el repo GitHub en Railway
2. Railway detecta Next.js automaticamente
3. No se requieren variables de entorno en V0
4. El deploy ocurre en cada `git push` a `main`

## Stack

Next.js 14 · TypeScript · Tailwind CSS · Apache ECharts · lucide-react · Vitest · Playwright · Railway

## Documentacion adicional

- `docs/RESUMEN_SISTEMA.md` — resumen ejecutivo de una pagina
- `docs/GUIA_DEMO.md` — tutorial paso a paso para presentar el demo
- `TEST-RESULTS.md` — resultados completos de los 133 tests
