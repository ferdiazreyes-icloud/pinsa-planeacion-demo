import { test, expect } from '@playwright/test'

test.describe('Home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('loads and shows PINSA branding', async ({ page }) => {
    // Home page shows PINSA in the demo tag and "Orquesta tu cadena" headline
    await expect(page.locator('text=Demo PINSA 2026')).toBeVisible()
    await expect(page.locator('text=S&OP / IBP Control Tower')).toBeVisible()
  })

  test('shows the main headline', async ({ page }) => {
    await expect(page.locator('text=Orquesta tu cadena')).toBeVisible()
    await expect(page.locator('text=de valor completa')).toBeVisible()
  })

  test('shows exactly 4 role cards', async ({ page }) => {
    const cards = page.locator('a[href="/dashboard"], a[href="/sop"], a[href="/sop?step=2"], a[href="/simulator"]')
    await expect(cards).toHaveCount(4)
  })

  test('shows all role names', async ({ page }) => {
    await expect(page.locator('text=Directivo')).toBeVisible()
    await expect(page.locator('text=Planeador de Demanda')).toBeVisible()
    await expect(page.locator('text=Ventas / Colaboración')).toBeVisible()
    await expect(page.locator('text=Planeador de Inventarios')).toBeVisible()
  })

  test('shows KPI strip with 4 metrics', async ({ page }) => {
    await expect(page.locator('text=Fill Rate')).toBeVisible()
    await expect(page.locator('text=Asertividad')).toBeVisible()
    await expect(page.locator('text=Capital trabajo')).toBeVisible()
    await expect(page.locator('text=Días cobertura')).toBeVisible()
  })

  test('clicking Directivo card navigates to /dashboard', async ({ page }) => {
    await page.click('a[href="/dashboard"]')
    await expect(page).toHaveURL('/dashboard')
    await expect(page.locator('text=Dashboard Ejecutivo')).toBeVisible()
  })

  test('clicking Planeador de Demanda card navigates to /sop', async ({ page }) => {
    await page.click('a[href="/sop"]:not([href="/sop?step=2"])')
    await expect(page).toHaveURL('/sop')
    await expect(page.locator('text=Ciclo S&OP Mensual')).toBeVisible()
  })

  test('clicking Simulador card navigates to /simulator', async ({ page }) => {
    await page.click('a[href="/simulator"]')
    await expect(page).toHaveURL('/simulator')
    await expect(page.locator('text=Simulador de Escenarios')).toBeVisible()
  })
})
