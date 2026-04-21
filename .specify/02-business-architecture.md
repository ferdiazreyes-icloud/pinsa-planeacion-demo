# 02 — Business Architecture

## User Flows

### Flow A: Continuous Monitoring (Dashboard)
1. Directivo enters `/dashboard` → sees KPI snapshot (fill rate, asertividad, inventario, capital de trabajo)
2. Reviews trend charts (12 months) and active alerts
3. Drills into specific module as needed

### Flow B: Monthly Executive Session (Sesión Ejecutiva)
The flagship flow — 60-min monthly meeting where the 5 S&OP links converge.

1. Director de Operaciones enters `/sesion-ejecutiva`
2. Reviews 4 executive KPIs with click-to-expand drill-down
3. Reviews gaps requiring decision (production capacity shortfall, fill rate risks)
4. Reviews 3 modeled options per gap (with $ impact) and **selects one**
5. Reviews P&L projection vs budget + 4 identified risks
6. Reviews "what-if" scenarios brought from Simulator
7. **Approves or rejects** the cycle plan with comments

### Flow C: Monthly S&OP Cycle (5-step operational walkthrough)

```
Step 1 — Pronóstico estadístico (Planeador Demanda)
  → Baseline with confidence interval (range, not number)
  → Calendar events chips (Cuaresma, Buen Fin, Navidad)
  → Accuracy per SKU (MAPE, bias, improvement with collaboration)

Step 2 — Colaboración Comercial (Equipo Comercial)
  → 5 adjustment categories with FVA historical:
    Promoción (+8.2%), Estacionalidad (+6.1%), Lanzamiento (+4.1%),
    Acuerdo anaquel (+2.5%), Acción competencia (-3.8%)
  → Editable table with named accounts (Walmart, Sam's, OXXO…)
  → Badge verde/rojo per row based on category FVA
  → Projected cycle FVA displayed

Step 3 — Planeación de Inventarios (Supply Chain)
  → Multi-node view: Planta Mazatlán | CEDIS México | Consolidado
  → ABC policy differentiated: A (dinámico), B (estándar), C (racionalización)
  → Table per SKU with planta/CEDIS breakdown + ABC badge
  → Auto replenishment signals Planta → CEDIS when CEDIS < target

Step 4 — Planeación de Producción (Operaciones Planta)
  → 14 production lines with capacity vs demand bar chart
  → Line-level detail: min batch, setup hours, status
  → Gap detection → 3 modeled options with $ impact
  → Escalate to Sesión Ejecutiva button

Step 5 — Planeación de Distribución (Logística)
  → Replenishment plan Planta → CEDIS per SKU
  → Cases to send, urgency flags, target coverage
```

### Flow D: What-If Scenario Simulation (Simulador)
1. User selects time horizon (1, 3, 6, 12 months)
2. Adjusts 4 levers:
   - Raw material price change (−30% to +50%)
   - Supply disruption % (0–80%)
   - Demand change (−30% to +50%)
   - Safety stock days (15–90d)
3. 5 metrics update in real-time:
   - Fill Rate promedio
   - Capital de trabajo
   - Production efficiency (new in v0.5)
   - Revenue at risk
   - Δ COGS
4. **Saves scenario** to localStorage with name
5. **Compares** up to 2 scenarios side-by-side
6. **Marks scenario for Executive Session** (gavel icon) → appears in `/sesion-ejecutiva`

## Business Processes (S&OP Calendar)

| Week | Activity |
|------|----------|
| Week 1 | Statistical forecast generation + demand review (Paso 1) |
| Week 2 | Commercial collaboration window (Paso 2) |
| Week 3 | Supply + inventory + production + distribution planning (Pasos 3–5) |
| Week 4 | **Sesión Ejecutiva S&OP** + plan lock + decision recorded |

## KPIs Tracked

| KPI | Target | Alert Threshold |
|-----|--------|-----------------|
| Fill Rate (OTIF) | ≥ 95% | < 90% |
| Forecast Accuracy (1−MAPE) | ≥ 75% | < 65% |
| Inventory Days of Cover | 30–45d | > 60 or < 20 |
| Working Capital (MXN M) | ≤ $280M | > $320M |
| Collaboration Rate | ≥ 80% SKUs adjusted | < 60% |
| Production Efficiency | ≥ 85% | < 70% |
