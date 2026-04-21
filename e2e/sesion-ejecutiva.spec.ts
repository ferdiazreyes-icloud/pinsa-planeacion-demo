import { test, expect } from '@playwright/test'

test.describe('Sesión Ejecutiva', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('pinsa-tour-sesion-ejecutiva', '1')
    })
    await page.goto('/sesion-ejecutiva')
  })

  test('shows page title and subtitle', async ({ page }) => {
    await expect(page.locator('h1', { hasText: 'Sesión Ejecutiva S&OP' })).toBeVisible()
    await expect(page.locator('text=Decidir, no reportar')).toBeVisible()
  })

  test('shows 4 executive KPIs', async ({ page }) => {
    await expect(page.locator('text=Fill Rate OTIF')).toBeVisible()
    await expect(page.locator('text=Forecast Accuracy').first()).toBeVisible()
    await expect(page.locator('text=Días Inventario')).toBeVisible()
    await expect(page.locator('text=Brechas Abiertas')).toBeVisible()
  })

  test('clicking a KPI opens drill-down', async ({ page }) => {
    await page.click('text=Fill Rate OTIF')
    await expect(page.locator('text=Causa raíz — Fill Rate')).toBeVisible()
    await expect(page.locator('text=POR-POUCH-ACE').first()).toBeVisible()
  })

  test('shows production gap section with 3 options', async ({ page }) => {
    await expect(page.locator('text=Brecha que requiere decisión')).toBeVisible()
    await expect(page.locator('text=Ampliar turno nocturno Línea 5')).toBeVisible()
    await expect(page.locator('text=Aceptar quiebre controlado en OXXO')).toBeVisible()
  })

  test('choosing a gap option marks it as decided', async ({ page }) => {
    await page.click('button:has-text("Elegir esta opción")')
    await expect(page.locator('text=Decidida').first()).toBeVisible()
    await expect(page.locator('text=Decisión registrada')).toBeVisible()
  })

  test('shows P&L financial summary', async ({ page }) => {
    await expect(page.locator('text=P&L proyectado Abril 2026')).toBeVisible()
    await expect(page.locator('text=Ventas netas')).toBeVisible()
    await expect(page.locator('text=Margen bruto')).toBeVisible()
  })

  test('approve cycle button works', async ({ page }) => {
    await page.click('button:has-text("Aprobar plan Abr 2026")')
    await expect(page.locator('text=Ciclo Abril 2026 aprobado')).toBeVisible()
  })

  test('reject cycle button works', async ({ page }) => {
    await page.click('button:has-text("Devolver con observaciones")')
    await expect(page.locator('text=Ciclo devuelto a planeación')).toBeVisible()
  })

  test('sidebar has link to Sesión Ejecutiva', async ({ page }) => {
    await expect(page.locator('a[href="/sesion-ejecutiva"]').first()).toBeVisible()
  })
})
