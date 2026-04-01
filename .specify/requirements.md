# Requirements (Living Document)

## Functional Requirements

### FR-01: Executive Dashboard
- [ ] Display KPI cards: Fill Rate (OTIF), Forecast Accuracy (1-MAPE), Inventory Days of Cover, Working Capital
- [ ] Show trend sparklines for each KPI (last 12 months)
- [ ] Show active alerts (KPIs below threshold)
- [ ] Charts: fill rate trend, inventory by SKU family, forecast vs actual

### FR-02: S&OP Monthly Cycle
- [ ] Stepper UI showing 5 steps with role labels
- [ ] Step 1 (Demand Planner): Statistical forecast table by SKU + last period accuracy metrics
- [ ] Step 2 (Sales): Editable collaboration overlay on forecast with reason field
- [ ] Step 3 (Quality Review): Side-by-side comparison of statistical vs collaborated; MAPE improvement
- [ ] Step 4 (Inventory Planning): Safety stock calculation, replenishment order suggestion
- [ ] Step 5 (Finance): P&L summary, working capital projection, approve/flag action

### FR-03: Scenario Simulator
- [ ] Time horizon selector: 1 month / 1 quarter / 1 year
- [ ] Lever: Raw material price change (slider -30% to +50%)
- [ ] Lever: Supply disruption (slider 0% to 100% of supply at risk)
- [ ] Lever: Demand change (slider -30% to +50%)
- [ ] Lever: Safety stock policy (days of cover: 15–90)
- [ ] Output charts (update in real-time): Fill Rate projection, Inventory Value, Working Capital, Revenue at Risk
- [ ] Comparison: Base scenario vs modified scenario

### FR-04: Navigation & Home
- [ ] Home screen with role selector (Executive, Demand Planner, Sales, Finance)
- [ ] Each role routes to its primary view
- [ ] Persistent top navigation with module links

## Non-Functional Requirements

### NFR-01: Performance
- All scenario calculations complete < 100ms (no server round-trips)
- Page load < 2s on standard WiFi

### NFR-02: Visual Quality
- Professional color palette (blues, teals, neutral grays)
- No placeholder lorem ipsum text in demo screens
- Charts have proper labels, legends, and units
- Responsive to 1280px+ screens (laptop presentations)

### NFR-03: Data Realism
- SKU names match real PINSA brand portfolio (Dolores, Guardamar, La Sirena)
- Volumes in ranges credible for Mexican CPG tuna market
- Prices in MXN, current market ranges
- Seasonality reflects real patterns (Holy Week, summer, year-end)

### NFR-04: Deployability
- Deploys to Railway with `git push` (no manual steps)
- No required environment variables in V0
- Build succeeds with `npm run build`

## Acceptance Criteria (Demo Ready)

- [ ] E2E walkthrough: Home → Dashboard → S&OP all 5 steps → Simulator → back to Dashboard
- [ ] All charts render with no errors
- [ ] Simulator levers produce visible, logical changes in output charts
- [ ] No console errors during demo flow
- [ ] Deployed URL on Railway works from external browser
