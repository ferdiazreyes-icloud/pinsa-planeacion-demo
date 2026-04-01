# 01 — Architecture Vision

## Problem Statement

PINSA (Productores de Insumos de la Nueva Sociedad Alimentaria) operates in the Mexican CPG tuna market. Despite being a market leader, they face:

- **Excess working capital** tied up in inventory to buffer against supply volatility (tuna catch seasonality, raw material price swings)
- **Low forecast accuracy** — statistical models are not enriched with commercial intelligence from the sales team
- **Disconnected planning** — demand, inventory, and procurement plans are managed in silos (Excel, email, WhatsApp)
- **Reactive decision-making** — supply disruptions are discovered late, leaving no time for proactive response

## Vision

A unified S&OP/IBP control tower that orchestrates the full planning value chain:

```
Demand Sensing → Demand Collaboration → Inventory Planning → Supply Planning → Financial Validation
```

This demo shows PINSA what that world looks like and makes the ROI tangible.

## Stakeholders

| Stakeholder | Role in Demo |
|---|---|
| PINSA Executive | Sees the dashboard — KPIs, alerts, financial impact |
| Demand Planner | Runs statistical forecast, reviews collaboration quality |
| Sales Rep | Collaborates demand (adjusts forecast by customer/channel) |
| Inventory Planner | Sets safety stock, simulates replenishment scenarios |
| Finance | Validates financial projections of the plan |
| Vendaval Sales Team | Presents the demo to PINSA decision-makers |

## Scope — V0 Demo

**In scope:**
- Executive dashboard with KPIs snapshot
- Monthly S&OP cycle flow (role-by-role walkthrough)
- Scenario simulator (price, supply disruption, seasonality)
- Fictitious but credible PINSA data

**Out of scope (V0):**
- Real data integration
- User authentication
- Database persistence
- Multi-company support
- Mobile app

## Value Proposition

> "Reduce working capital by 15–20% while improving service levels from 87% to 95%+ — by replacing disconnected spreadsheets with a unified planning platform."
