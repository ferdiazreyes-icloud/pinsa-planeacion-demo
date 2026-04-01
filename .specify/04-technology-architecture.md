# 04 — Technology Architecture

## Stack

| Layer | Technology | Rationale |
|---|---|---|
| Framework | Next.js 14 (App Router) | SSR + client components in one; Railway deploys easily |
| Language | TypeScript | Type safety; easier to evolve to real data contracts |
| Styling | Tailwind CSS | Rapid, consistent, professional styling |
| UI Components | shadcn/ui (selective) | Accessible, unstyled base components |
| Charts | Recharts | Declarative, React-native, good defaults |
| Icons | lucide-react | Clean, consistent icon set |
| Data | JSON files in /data | Zero infrastructure for V0; clear migration path |
| Deploy | Railway | Free tier; simple git-based deploys |

## Folder Structure

```
pinsa-torre-planeacion-demo/
├── app/
│   ├── globals.css
│   ├── layout.tsx           ← Root layout (nav, fonts)
│   ├── page.tsx             ← Home / role selector
│   ├── dashboard/
│   │   └── page.tsx
│   ├── sop/
│   │   └── page.tsx
│   └── simulator/
│       └── page.tsx
├── components/
│   ├── layout/
│   ├── dashboard/
│   ├── sop/
│   └── simulator/
├── data/
│   ├── skus.json
│   ├── forecast.json
│   ├── inventory.json
│   ├── rawMaterials.json
│   ├── financial.json
│   └── index.ts
├── lib/
│   ├── calculations.ts
│   └── formatters.ts
├── public/
│   └── pinsa-logo.svg       ← placeholder
├── .specify/
├── .env.example
├── .gitignore
├── CLAUDE.md
├── next.config.ts
├── package.json
├── tailwind.config.ts
├── tsconfig.json
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

## Performance Targets

- First Contentful Paint: < 1.5s
- All chart interactions: < 100ms (client-side calculations only)
- Build size: < 5MB
