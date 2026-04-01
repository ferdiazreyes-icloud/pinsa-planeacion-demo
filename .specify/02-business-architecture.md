# 02 — Business Architecture

## User Flows

### Flow A: Executive Dashboard
1. Executive lands on home → sees KPI snapshot (fill rate, inventory value, forecast accuracy, working capital)
2. Sees trend charts for last 12 months
3. Sees active alerts / risks
4. Can drill into any module

### Flow B: Monthly S&OP Cycle (linear walkthrough)

```
Step 1: Demand Planner
  → Views statistical forecast for next 3 months by SKU
  → Reviews last month's forecast accuracy (MAPE, bias)
  → Locks statistical baseline

Step 2: Sales Collaboration
  → Sales rep sees baseline forecast by customer/channel
  → Adjusts volume up/down with justification
  → Submits collaborated forecast

Step 3: Collaboration Quality Review
  → Demand Planner reviews adjustments
  → Sees accuracy improvement vs statistical baseline
  → Accepts or rejects adjustments

Step 4: Inventory Planning
  → Inventory Planner sees projected demand
  → Reviews safety stock coverage
  → Defines replenishment orders

Step 5: Financial Validation
  → Finance sees projected revenue, COGS, working capital
  → Approves or flags the plan
  → Plan is locked for execution
```

### Flow C: Scenario Simulator
1. User selects time horizon (1 month / 1 quarter / 1 year)
2. User adjusts levers:
   - Raw material price change (tuna, soybean oil, cans) → impact on COGS
   - Supply disruption % → impact on fill rate and lost sales
   - Demand uplift/decline % → seasonal or promotional event
   - Safety stock policy (days of coverage)
3. Charts update in real-time showing:
   - Projected fill rate
   - Inventory value
   - Working capital requirement
   - Revenue at risk

## Business Processes (S&OP Calendar)

| Week | Activity |
|---|---|
| Week 1 | Statistical forecast generation + demand review |
| Week 2 | Sales collaboration window |
| Week 3 | Supply review + inventory planning |
| Week 4 | Executive S&OP meeting + plan lock |

## KPIs Tracked

| KPI | Target | Alert Threshold |
|---|---|---|
| Fill Rate (OTIF) | ≥ 95% | < 90% |
| Forecast Accuracy (1-MAPE) | ≥ 75% | < 65% |
| Inventory Days of Cover | 30–45 days | > 60 or < 20 |
| Working Capital (MXN M) | ≤ $280M | > $320M |
| Collaboration Rate | ≥ 80% SKUs adjusted | < 60% |
