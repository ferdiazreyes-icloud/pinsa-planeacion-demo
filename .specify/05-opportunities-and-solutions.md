# 05 — Opportunities & Solutions

## Technology Decisions

### Why Next.js over plain React + Express?

- Single deployable unit → fits Railway free tier (one service)
- App Router enables clean separation of server/client components
- Built-in TypeScript support
- Zero config for Railway deployment (`next start`)

**Rejected:** Vite + React SPA → requires separate static hosting; less flexible for future API routes

### Why JSON files over a database?

- Zero infrastructure cost in V0
- Readable, editable by FerDi without code changes
- Git-versioned data (reproducible demos)
- Clear migration path: replace `import data from '@/data/forecast.json'` with `fetch('/api/forecast')`

**Rejected:** SQLite → adds complexity for no benefit in V0

### Why Recharts over Chart.js / D3?

- React-native (no imperative DOM manipulation)
- Responsive by default
- Good enough for demo needs
- Smaller bundle than Chart.js

**Rejected:** D3 → too complex for demo timeline; Chart.js → not React-native

### Why Tailwind over CSS Modules?

- Faster iteration
- Consistent spacing/color system
- No context switching between .tsx and .css files

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Railway free tier goes down mid-demo | Low | High | Export static build as fallback |
| Demo data looks unrealistic | Medium | High | Base data on real PINSA public info (annual reports) |
| Charts too slow on low-end laptop | Low | Medium | All calcs client-side; no network calls |
| Scope creep during build | Medium | Medium | Strict tasks.md approval before each feature |
