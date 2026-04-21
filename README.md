# PINSA Torre de Control de Planeacion

Demo interactivo de plataforma S&OP/IBP para mostrar a PINSA el valor de orquestar su cadena de valor.

**Version:** 0.4.1 · **Status:** Demo V0 — Alineado con propuesta Arena Analytics (E0) · **Ciclo activo:** Abril 2026

---

## Funcionalidad implementada

- [x] **Home / Role selector** — Landing page con KPIs actuales y acceso por rol
- [x] **Dashboard Directivo** — KPI cards (Fill Rate, Asertividad, Inventario, Capital de trabajo), alertas activas, graficas de tendencia (12 meses)
- [x] **Ciclo S&OP Mensual (5 pasos — alineado con propuesta Arena Analytics):**
  - [x] Paso 1: Pronóstico estadístico con accuracy por SKU
  - [x] Paso 2: Colaboración comercial (tabla editable con cuentas nombradas: Walmart, OXXO, Sam's, etc.)
  - [x] Paso 3: Planeación de Inventarios (dias de cobertura, ordenes de reposicion)
  - [x] Paso 4: Planeación de Producción (programa por línea, brecha capacidad con 3 opciones modeladas)
  - [x] Paso 5: Planeación de Distribución (plan Planta Mazatlán → CEDIS México)
- [x] **Simulador de Escenarios** — 4 variables (precio MP, desabasto, demanda, politica inventario), horizonte 1-12 meses, graficas reactivas en tiempo real

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
