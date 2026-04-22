# 04 — Technology Architecture

## Stack

| Layer | Technology | Rationale |
|---|---|---|
| Framework | Next.js 14 (App Router) | SSR + client components in one; Railway deploys easily |
| Language | TypeScript | Type safety; easier to evolve to real data contracts |
| Styling | Tailwind CSS | Rapid, consistent, professional styling |
| UI Components | shadcn/ui (selective) | Accessible, unstyled base components |
| Charts | Apache ECharts (via echarts-for-react) | Richer interactions (band charts, markers, tooltips) — migrated from Recharts in v0.2 |
| Icons | lucide-react | Clean, consistent icon set |
| Data | JSON files in /data | Zero infrastructure for V0; clear migration path |
| Deploy | Railway | Free tier; simple git-based deploys |

## Folder Structure (v0.5.0)

```
pinsa-torre-planeacion-demo/
├── app/
│   ├── layout.tsx              ← Root layout (sidebar)
│   ├── globals.css
│   ├── page.tsx                ← Home / role selector
│   ├── dashboard/page.tsx      ← Continuous monitoring
│   ├── sesion-ejecutiva/       ← Monthly decision view (v0.5)
│   │   └── page.tsx
│   ├── sop/page.tsx            ← 5-step S&OP stepper
│   └── simulator/page.tsx      ← What-if + saved scenarios
├── components/
│   ├── layout/                 ← Sidebar, Navbar, SidebarLayout, TourGuide
│   ├── dashboard/              ← KPICard, AlertBanner, charts
│   └── sop/                    ← Step1Forecast, Step2Collaboration, Step4Inventory,
│                                  Step4Production, Step5Distribution
│                                  (Step3Quality, Step5Finance preserved as archive)
├── data/
│   ├── skus.json               ← 10 SKUs — 4 marcas reales
│   ├── forecast.json           ← 14 mo + forecastLow/High confidence band
│   ├── inventory.json          ← multi-node: byNode.planta + byNode.cedis
│   ├── productionCapacity.json ← 14 lines + gap analysis + 3 options
│   ├── rawMaterials.json       ← 4 raw materials
│   ├── kpis.json               ← monthly + alerts
│   └── index.ts                ← typed exports (SKUs, Forecast, Inventory, etc.)
├── lib/
│   ├── calculations.ts         ← MAPE, accuracy, simulateScenario, productionEfficiency
│   ├── scenarios.ts            ← localStorage CRUD for SavedScenario
│   └── formatters.ts
├── __tests__/                  ← 103 unit tests (Vitest)
├── e2e/                        ← 57 E2E tests (Playwright)
├── docs/                       ← GUIA_DEMO, RESUMEN_SISTEMA, UAT_DATOS_DEMO
├── .specify/                   ← TOGAF ADM artifacts (this file)
└── README.md
```

## Infrastructure — V0

```
GitHub repo
    ↓ (git push)
Railway (auto-deploy)
    ↓
Next.js standalone server
    (no DB, no Redis, no external services)
```

## Infrastructure — V1 Evolution

```
GitHub repo
    ↓ (git push)
Railway
    ├── Next.js service
    └── PostgreSQL service (Railway add-on)
```

## Environment Variables

```bash
# V0 — no required env vars
# V1 — add:
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=...
```

## Testing Stack (v0.3+)

| Layer | Tool | Scope |
|-------|------|-------|
| Unit | Vitest + React Testing Library | `lib/` functions, component rendering |
| E2E | Playwright (Chromium) | Full user flows across 5 modules |

Scripts:
```bash
npm run test         # Vitest unit tests (~1.5s, 103 tests)
npm run test:e2e     # Playwright E2E (~25s, 57 tests, requires :3001)
npm run test:e2e:ui  # Playwright interactive
```

## Performance Targets

- First Contentful Paint: < 1.5s
- All chart interactions: < 100ms (client-side calculations only)
- Build size: < 5MB

## Client-side State

- `useState` for all interactive UI (no global store needed at V0).
- `localStorage` for:
  - Tour guide dismissal (`pinsa-tour-{module}`)
  - Saved scenarios (`pinsa-scenarios`)
