# 00 — Principles & Constraints (IMMUTABLE)

> This file is immutable. Do not edit unless FerDi explicitly requests it.

## Core Principles

1. **Demo-first, not production-first** — The primary goal is to convince a prospect, not to run a live operation. Visual clarity and narrative flow always win over technical completeness.

2. **"Don't make me think"** — Every screen must be instantly understandable. No training required. If a user needs to ask "what does this mean?", it failed.

3. **Credibility through realism** — Fictitious data must look like real PINSA data. Industry-accurate SKUs, volumes, prices, seasonality patterns.

4. **Evolvable foundation** — Even as a demo, architecture decisions must not block a future path to: real database, external API integrations, multi-tenant SaaS. No shortcuts that create dead ends.

5. **MVP discipline** — No feature that isn't in the approved scope. Complexity is the enemy of a good demo.

6. **Visual excellence is non-negotiable** — Modern, professional, beautiful. This is a sales tool. It must impress.

## Hard Constraints

- Deploy: Railway free tier
- No real user data, no PII
- No external API calls in runtime (all data is local)
- Must run on a single Railway service (no separate DB service in V0)
- Stack: Next.js + TypeScript + Tailwind + Recharts

## Non-Negotiable UX Rules

- Every role (planner, sales, finance, executive) has its own clear entry point
- All simulations must provide instant visual feedback (no loading spinners for calculations)
- Color palette: professional blues and teals with accent colors for alerts
- Mobile-responsive is nice-to-have, desktop is the priority
