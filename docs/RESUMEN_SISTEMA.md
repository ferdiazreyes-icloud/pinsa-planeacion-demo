# PINSA Torre de Control de Planeación — Resumen del Sistema

**Versión:** 0.5.0 · **Fecha:** Abril 2026 · **Estado:** Demo alineado con propuesta Arena Analytics (E0–E6)

---

## Qué es este sistema

Plataforma S&OP/IBP que orquesta la cadena de valor completa de PINSA — desde forecast estadístico hasta plan de distribución — en un único flujo mensual que converge en una **Sesión Ejecutiva de decisión**.

El demo muestra cómo se vería la herramienta en producción con datos reales de PINSA (atún, sardinas, 4 marcas, 10 cuentas de canal, 14 líneas de producción).

---

## 5 módulos

| Módulo | Ruta | Para quién |
|--------|------|-----------|
| **Home** | `/` | Todos — role selector |
| **Sesión Ejecutiva** 🆕 | `/sesion-ejecutiva` | Director de Operaciones |
| **Dashboard continuo** | `/dashboard` | Directivos de la cadena |
| **Ciclo S&OP (5 pasos)** | `/sop` | Planeación · Comercial · Supply · Operaciones · Logística |
| **Simulador** | `/simulator` | Planeador de Inventarios |

---

## Qué hace cada módulo

### Sesión Ejecutiva — "60 min para decidir, no reportar"
- 4 KPIs ejecutivos con drill-down de 1 clic (Fill Rate · Accuracy · Inventario · Brechas)
- Brechas que requieren decisión ejecutiva con 3 opciones modeladas ($ calculado)
- P&L proyectado vs presupuesto + riesgos del ciclo
- Escenarios what-if traídos desde el Simulador
- Aprobación/rechazo del ciclo del Director de Operaciones

### Dashboard Directivo — monitoreo continuo
- 4 KPI cards (Fill Rate, Asertividad, Inventario, Capital)
- Alertas activas con severidad (Alta/Media/Baja)
- Gráficas 12 meses: Fill Rate, Ventas vs COGS, Capital de trabajo
- Mix de ventas por **canal con cuentas nombradas** (Walmart · Sam's · OXXO · Zorro …)
- Top SKUs por volumen

### Ciclo S&OP — 5 pasos alineados con propuesta Arena Analytics
1. **Pronóstico estadístico** — banda de confianza, eventos calendáricos, asertividad por SKU
2. **Colaboración Comercial** — 5 categorías de ajuste con **FVA histórico**, tabla con cuentas nombradas
3. **Planeación de Inventarios** — red multi-nodo (Planta Mazatlán + CEDIS México), política **ABC diferenciada**, señales de reabasto
4. **Planeación de Producción** — 14 líneas, **brecha de capacidad** con 3 opciones modeladas
5. **Planeación de Distribución** — plan Planta → CEDIS por SKU con cobertura objetivo

### Simulador de escenarios
- 4 variables ajustables + **5 métricas de impacto** (incluye nueva Eficiencia de producción)
- Gráficas reactivas Fill Rate y Capital de trabajo vs baseline
- Banner de advertencia para escenarios extremos (desabasto >60% Y demanda >30%)
- **Guardar escenarios** en localStorage · comparación lado a lado
- Botón martillo para llevar a Sesión Ejecutiva

---

## Números del sistema

| Métrica | Valor |
|---------|-------|
| SKUs | 10 (Dolores · Mazatún · El Dorado · Portola) |
| Canales | 7 grupos (Autoservicios, Clubes, Conveniencia, Mayoristas, Distribuidores, Foodservice, Exportación) |
| Cuentas nombradas | Walmart · Chedraui · Soriana · Sam's · Costco · OXXO · 7-Eleven · Zorro · 3B · Merza … |
| Líneas de producción | 14 (planta Mazatlán) |
| Red de distribución | 1 planta + 1 CEDIS |
| Meses de historial | 12 meses + 3 meses forward |
| Materias primas | 4 (atún, sardina, hojalata, aceite) |
| Tests automatizados | 160+ (103 unitarios + 57 E2E) |
| Tiempo de carga | < 2 segundos |

---

## Lo que NO incluye todavía (V1)

- Conexión real a SAP (el demo usa JSON; v1 agrega conectores de lectura solamente)
- Escritura bidireccional a SAP (pospuesto a v2 por complejidad de gobierno de datos)
- IA generativa para forecast (v2; el modelo estadístico calibrado es suficiente en v1)
- App móvil (no crítico — el S&OP es proceso de escritorio)
- Autenticación por rol (pospuesto — demo abierto)
- Exportación PDF/Excel del plan

---

## Cómo acceder

El demo corre en Railway. Contactar a FerDi para obtener la URL actualizada.

Para correr localmente:
```bash
npm install
npm run dev
# http://localhost:3001
```

Para tests:
```bash
npm run test       # 103 unitarios en ~1.5s
npm run test:e2e   # 57 E2E en ~25s (requiere dev server en :3001)
```
