import { test, expect } from '@playwright/test'

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard')
  })

  test('shows page title', async ({ page }) => {
    await expect(page.locator('h1', { hasText: 'Dashboard Ejecutivo' })).toBeVisible()
  })

  test('renders 4 KPI cards', async ({ page }) => {
    // KPICards use IntersectionObserver — wait for them to become visible
    await page.waitForTimeout(600)
    await expect(page.locator('text=Fill Rate (OTIF)')).toBeVisible()
    await expect(page.locator('text=Asertividad Pronóstico')).toBeVisible()
    await expect(page.locator('text=Cobertura Inventario')).toBeVisible()
    await expect(page.locator('text=Capital de Trabajo').first()).toBeVisible()
  })

  test('KPI cards show status badges', async ({ page }) => {
    const badges = page.locator('text=En meta, text=Por mejorar, text=Alerta')
    // At least one badge should be present
    const ok       = page.locator('text=En meta')
    const warning  = page.locator('text=Por mejorar')
    const critical = page.locator('text=Alerta')
    const anyBadge = (await ok.count()) + (await warning.count()) + (await critical.count())
    expect(anyBadge).toBeGreaterThanOrEqual(1)
  })

  test('shows alertas activas section', async ({ page }) => {
    await expect(page.locator('text=Alertas activas')).toBeVisible()
  })

  test('shows at least one alert', async ({ page }) => {
    // Severity labels
    const alertCount = await page.locator('text=Alta, text=Media, text=Baja').count()
    const high   = await page.locator('text=Alta').count()
    const medium = await page.locator('text=Media').count()
    const low    = await page.locator('text=Baja').count()
    expect(high + medium + low).toBeGreaterThanOrEqual(1)
  })

  test('shows three chart titles', async ({ page }) => {
    await expect(page.locator('text=Fill Rate — 12 meses')).toBeVisible()
    await expect(page.locator('text=Ventas vs COGS')).toBeVisible()
    await expect(page.locator('text=Capital de trabajo (MXN)')).toBeVisible()
  })

  test('charts render canvas elements (ECharts)', async ({ page }) => {
    await page.waitForTimeout(1000) // allow ECharts to initialize
    const canvases = await page.locator('canvas').count()
    expect(canvases).toBeGreaterThanOrEqual(3)
  })

  test('shows mix de ventas por canal section', async ({ page }) => {
    await expect(page.locator('text=Mix de ventas por canal')).toBeVisible()
    await expect(page.locator('text=Autoservicios').first()).toBeVisible()
    await expect(page.locator('text=Mayoristas').first()).toBeVisible()
    await expect(page.locator('text=Clubes de Precio').first()).toBeVisible()
  })

  test('shows top SKUs table', async ({ page }) => {
    await expect(page.locator('text=Top SKUs por volumen')).toBeVisible()
    await expect(page.locator('text=Dolores Atún Agua 170g')).toBeVisible()
  })

  test('sidebar navigation is visible', async ({ page }) => {
    await expect(page.locator('text=PINSA').first()).toBeVisible()
    await expect(page.locator('a[href="/dashboard"]')).toBeVisible()
    await expect(page.locator('a[href="/sop"]')).toBeVisible()
    await expect(page.locator('a[href="/simulator"]')).toBeVisible()
  })
})
