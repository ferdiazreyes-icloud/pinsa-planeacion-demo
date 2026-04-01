# 03 — Information Systems Architecture

## Data Model

### SKUs (Products)

```typescript
type SKU = {
  id: string              // e.g. "DOLORES-170-ACE"
  name: string            // e.g. "Dolores Atún en Aceite 170g"
  brand: string           // Dolores | Guardamar | La Sirena
  category: string        // Atún | Sardina | Mariscos
  presentation: string    // 170g | 280g | 1kg
  packType: string        // Lata | Pouch
  channel: string[]       // Autoservicio | Mayoreo | Foodservice | Export
  unitPrice: number       // MXN per case
  cogsCurrent: number     // MXN per case
}
```

### Forecast

```typescript
type ForecastRecord = {
  skuId: string
  period: string          // "2025-01" format
  statisticalForecast: number  // cases
  collaboratedForecast: number | null
  actualSales: number | null
  forecastAdjustmentReason: string | null
}
```

### Inventory

```typescript
type InventoryRecord = {
  skuId: string
  period: string
  openingStock: number    // cases
  closingStock: number    // cases
  daysOfCover: number
  safetyStockDays: number
  replenishmentOrder: number
}
```

### Raw Materials

```typescript
type RawMaterial = {
  id: string
  name: string            // Atún entero | Aceite de soya | Hojalata
  unit: string            // Tonelada | Litro | Kg
  currentPrice: number    // MXN
  priceHistory: { period: string; price: number }[]
}
```

### Financial Plan

```typescript
type FinancialRecord = {
  period: string
  revenue: number         // MXN
  cogs: number
  grossMargin: number
  workingCapital: number
  inventoryValue: number
}
```

## Application Components

```
app/
├── page.tsx                    → Landing / role selector
├── dashboard/
│   └── page.tsx                → Executive Dashboard
├── sop/
│   └── page.tsx                → S&OP Monthly Cycle (stepper)
├── simulator/
│   └── page.tsx                → Scenario Simulator

components/
├── layout/
│   ├── Navbar.tsx
│   └── Sidebar.tsx
├── dashboard/
│   ├── KPICard.tsx
│   ├── FillRateChart.tsx
│   ├── ForecastAccuracyChart.tsx
│   ├── InventoryChart.tsx
│   └── AlertBanner.tsx
├── sop/
│   ├── StepperNav.tsx
│   ├── ForecastTable.tsx
│   ├── CollaborationPanel.tsx
│   ├── QualityReview.tsx
│   ├── InventoryPlan.tsx
│   └── FinancialReview.tsx
├── simulator/
│   ├── ScenarioControls.tsx
│   └── ScenarioCharts.tsx

data/
├── skus.json
├── forecast.json
├── inventory.json
├── rawMaterials.json
├── financial.json
└── index.ts               → typed exports

lib/
├── calculations.ts        → fill rate, MAPE, working capital formulas
└── formatters.ts          → currency, percentage, number formatters
```

## Data Flow

```
JSON files (data/)
    ↓
lib/calculations.ts
    ↓
Page components (app/)
    ↓
UI Components (components/)
    ↓
User sees charts + tables
```

**V1 evolution path:** Replace `data/*.json` with API routes (`app/api/`) backed by a PostgreSQL database on Railway. No component changes required.
