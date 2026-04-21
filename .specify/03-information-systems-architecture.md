# 03 — Information Systems Architecture

## Data Model

### SKUs (Products)

```typescript
type SKU = {
  id: string              // e.g. "DOL-170-ACE" | "POR-POUCH-ACE" | "MAZ-170-AGU" | "ELD-SARD-JIT-425"
  name: string            // e.g. "Dolores Atún en Aceite 170g"
  brand: string           // Dolores | Mazatún | El Dorado | Portola
  category: string        // Atún | Sardina
  presentation: string    // 80g | 170g | 215g | 280g | 425g | 1kg
  packType: string        // Lata | Pouch
  channels: string[]      // Autoservicios | Clubes de Precio | Conveniencia | Mayoristas | Distribuidores | Foodservice | Exportación
  unitPriceMXN: number
  cogsPerCaseMXN: number
  casesPerPallet: number
  abcClass: 'A' | 'B' | 'C'
}
```

### Forecast (with confidence band — v0.4.2)

```typescript
type ForecastRecord = {
  skuId: string
  period: string          // "2026-04" format
  statistical: number
  collaborated: number | null
  actual: number | null
  adjustmentReason: string | null
  forecastLow: number     // lower bound of confidence range
  forecastHigh: number    // upper bound
}
```

Volatility per SKU family drives the band width: DOL 10–12%, MAZ 13%, ELD 16%, POR 18%. Events (Cuaresma, Buen Fin, Navidad) add asymmetric premium to the upside.

### Inventory (multi-node — v0.4.6)

```typescript
type InventoryNode = {
  location: 'planta' | 'cedis'
  openingStock: number
  closingStock: number
  daysOfCover: number
  targetDays: number
  stockValueMXN: number
}

type InventoryRecord = {
  skuId: string
  period: string
  openingStock: number     // aggregate (planta + cedis)
  closingStock: number
  daysOfCover: number
  safetyStockDays: number
  replenishmentOrder: number
  stockValueMXN: number
  abcClass?: 'A' | 'B' | 'C'
  byNode?: {               // node-level detail
    planta: InventoryNode
    cedis: InventoryNode
  }
}
```

ABC splits: A → 60/40 (planta/cedis), B → 65/35, C → 75/25.

### Production Capacity (14 lines — v0.4.4)

```typescript
type ProductionLine = {
  id: string              // L1–L14
  name: string
  primarySkus: string[]
  family: string          // Atún 170g | Pouch | Sardina 425g | Foodservice | Flex | Otros
  capacityWeekCases: number
  demandWeekCases: number
  setupHours: number
  minBatchCases: number
  status: 'ok' | 'tight' | 'gap' | 'slack'
}

type GapOption = {
  id: string
  label: string
  type: 'expand-capacity' | 'accept-stockout' | 'adjust-plan'
  costMXN: number
  incrementalCapacityCases?: number
  salesLostMXN?: number
  revenueLostMXN?: number
  serviceImpact: string
  feasibility: string
  tradeoff: string
}

type ProductionCapacity = {
  period: string
  lines: ProductionLine[]
  gapAnalysis: {
    lineId: string
    skuAffected: string
    gapCases: number
    demandCases: number
    capacityCases: number
    options: GapOption[]   // always 3 — A/B/C
  }
}
```

### Saved Scenarios (localStorage — v0.5.0)

```typescript
type SavedScenario = {
  id: string              // uuid
  name: string
  savedAt: string         // ISO date
  horizon: number         // 1 | 3 | 6 | 12 months
  params: ScenarioInputs  // 4 levers
  metrics: {
    avgFillRate: number
    avgWC: number
    totalRevenueAtRisk: number
    totalCogsDelta: number
    avgProductionEfficiency: number
  }
  forExecutiveSession: boolean
}
```

### KPIs (dashboard + executive session)

```typescript
type MonthlyKPI = {
  period: string
  label: string
  fillRate: number | null
  forecastAccuracy: number | null
  daysOfCover: number | null
  workingCapitalMXN: number | null
  revenue: number
  cogs: number
}

type Alert = {
  id: string
  severity: 'high' | 'medium' | 'low'
  type: 'supply' | 'forecast' | 'inventory' | 'price'
  title: string
  description: string
  skusAffected: string[]
  financialImpactMXN: number
}
```

## Application Components

```
app/
├── page.tsx                    # Home / role selector (4 roles)
├── dashboard/page.tsx          # Continuous monitoring
├── sesion-ejecutiva/page.tsx   # Monthly decision view (v0.5)
├── sop/page.tsx                # 5-step stepper (Pronóstico → Colaboración → Inventarios → Producción → Distribución)
└── simulator/page.tsx          # What-if + saved scenarios

components/
├── dashboard/                  # KPICard, AlertBanner, charts
├── sop/                        # Step1Forecast, Step2Collaboration, Step4Inventory, Step4Production, Step5Distribution
│                               # (Step3Quality, Step5Finance preserved — migrated into Sesión Ejecutiva)
└── layout/                     # Sidebar, Navbar, SidebarLayout, TourGuide

lib/
├── calculations.ts             # MAPE, accuracy, bias, simulateScenario (with productionEfficiency)
├── scenarios.ts                # localStorage persistence for saved scenarios
└── formatters.ts               # Currency, pct, number formatters
```

## Integrations (V1 — lectura solamente)

From proposal (Propuesta-diseno-full-Pinsa.md):

| Source | Module | What |
|--------|--------|------|
| SAP SD | Sales & Distribution | Ventas históricas SKU × canal × cliente |
| SAP MM/WM | Materials Management | Inventario por ubicación (planta + CEDIS) |
| SAP PP | Production Planning | Órdenes de producción, capacidad por línea |
| SAP LE/TM | Logistics Execution | Despacho y entregas |
| Manual templates | Excel/CSV | Aportaciones comerciales, promotoría (campos fijos) |

V1 is read-only. Write-back to SAP is deferred to v2.

## Layer Architecture (from proposal)

```
┌─── Capa 3 — UI (Next.js React) ────────────────────────┐
│  /sesion-ejecutiva · /dashboard · /sop · /simulator    │
│  Ejecutiva (Director Ops) vs Operativa (Planeador)     │
├─── Capa 2 — Motor de planeación ────────────────────────┤
│  Forecast → Colaboración → Inventarios → Producción    │
│  → Distribución · FVA engine · Gap analysis            │
├─── Capa 1 — Datos (hoy: JSON · v1: SAP API) ────────────┤
│  Tabla de hechos SKU × canal × semana                  │
└──────────────────────────────────────────────────────────┘
```
