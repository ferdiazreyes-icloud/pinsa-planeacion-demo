# CLAUDE.md — PINSA Torre de Control (Project-Level)

> See global CLAUDE.md at ~/.claude/CLAUDE.md for all session protocols.

## Project Context

Demo interactivo de plataforma S&OP/IBP para PINSA (empresa mexicana de atún/sardinas CPG).
Objetivo: mostrar a PINSA el valor de una torre de control de planeación.

## Modules

| Route | Module | Description |
|---|---|---|
| `/` | Home | Role selector landing page |
| `/dashboard` | Dashboard Directivo | KPIs, alerts, charts |
| `/sop` | Ciclo S&OP | 5-step stepper (forecast → collab → quality → inventory → finance) |
| `/simulator` | Simulador | Scenario simulation with real-time charts |

## Data

All data is in `/data/*.json` — fictitious but credible PINSA data.
- `skus.json` — 10 SKUs (Dolores, Guardamar, La Sirena)
- `forecast.json` — 12 months history + 3 months forward
- `inventory.json` — monthly inventory records per SKU
- `rawMaterials.json` — 4 raw materials with price history
- `kpis.json` — monthly KPIs + active alerts

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Recharts for all charts
- lucide-react for icons
- No database (V0) — JSON files only

## Key Commands

```bash
npm run dev      # local dev
npm run build    # production build
npm run start    # production server
```

## Deploy

Railway — connect GitHub repo, set root directory to `/`, no build command override needed.

## V0 → V1 Evolution

To add a real database later:
1. Replace `import data from '@/data/forecast.json'` with `fetch('/api/forecast')`
2. Add `app/api/` routes
3. Add PostgreSQL Railway add-on
4. No component changes required

## Principles

See `.specify/00-principles.md`
