import { test, expect } from '@playwright/test'

test.describe('S&OP Ciclo Mensual', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/sop')
  })

  test('shows page title and period', async ({ page }) => {
    await expect(page.locator('h1', { hasText: 'Ciclo S&OP Mensual' })).toBeVisible()
    await expect(page.locator('text=Marzo 2025')).toBeVisible()
  })

  test('shows stepper with 5 steps', async ({ page }) => {
    await expect(page.locator('text=Pronóstico').first()).toBeVisible()
    await expect(page.locator('text=Colaboración').first()).toBeVisible()
    await expect(page.locator('text=Calidad').first()).toBeVisible()
    await expect(page.locator('text=Inventarios').first()).toBeVisible()
    await expect(page.locator('text=Finanzas').first()).toBeVisible()
  })

  test('step 1 content is visible by default', async ({ page }) => {
    await expect(page.locator('text=Pronóstico estadístico').first()).toBeVisible()
    await expect(page.locator('text=Asertividad Feb 2025')).toBeVisible()
  })

  test('step 1 shows KPI cards', async ({ page }) => {
    await expect(page.locator('text=Asertividad Feb 2025')).toBeVisible()
    await expect(page.locator('text=Mejora con colaboración')).toBeVisible()
    await expect(page.locator('text=Sesgo del pronóstico')).toBeVisible()
  })

  test('step 1 chart renders', async ({ page }) => {
    await page.waitForTimeout(1000)
    const canvases = await page.locator('canvas').count()
    expect(canvases).toBeGreaterThanOrEqual(1)
  })

  test('navigates to step 2 on "Confirmar y continuar"', async ({ page }) => {
    await page.click('button:has-text("Confirmar y continuar")')
    await expect(page.locator('text=Colaboración de ventas')).toBeVisible()
  })

  test('navigates through all 5 steps', async ({ page }) => {
    // Step 2
    await page.click('button:has-text("Confirmar y continuar")')
    await expect(page.locator('text=Colaboración de ventas')).toBeVisible()

    // Step 3
    await page.click('button:has-text("Confirmar y continuar")')
    await expect(page.locator('text=Revisión de calidad')).toBeVisible()

    // Step 4
    await page.click('button:has-text("Confirmar y continuar")')
    await expect(page.locator('text=Plan de inventarios')).toBeVisible()

    // Step 5
    await page.click('button:has-text("Confirmar y continuar")')
    await expect(page.locator('text=Validación financiera')).toBeVisible()
  })

  test('back button returns to previous step', async ({ page }) => {
    await page.click('button:has-text("Confirmar y continuar")')
    await expect(page.locator('text=Colaboración de ventas')).toBeVisible()

    await page.click('button:has-text("Paso anterior")')
    await expect(page.locator('text=Pronóstico estadístico').first()).toBeVisible()
  })

  test('back button is disabled on step 1', async ({ page }) => {
    const backBtn = page.locator('button:has-text("Paso anterior")')
    await expect(backBtn).toBeDisabled()
  })

  test('step 5 shows P&L section', async ({ page }) => {
    for (let i = 0; i < 4; i++) {
      await page.click('button:has-text("Confirmar y continuar")')
    }
    await expect(page.locator('text=P&L proyectado')).toBeVisible()
    await expect(page.locator('text=Ventas netas')).toBeVisible()
    await expect(page.locator('text=Margen bruto')).toBeVisible()
  })

  test('step 5 shows risk flags', async ({ page }) => {
    for (let i = 0; i < 4; i++) {
      await page.click('button:has-text("Confirmar y continuar")')
    }
    await expect(page.locator('text=Riesgos financieros identificados')).toBeVisible()
  })

  test('step 5 approve button works', async ({ page }) => {
    for (let i = 0; i < 4; i++) {
      await page.click('button:has-text("Confirmar y continuar")')
    }
    await page.click('button:has-text("Aprobar plan Mar 2025")')
    await expect(page.locator('text=Plan Marzo 2025 aprobado')).toBeVisible()
  })

  test('step 5 reject button works', async ({ page }) => {
    for (let i = 0; i < 4; i++) {
      await page.click('button:has-text("Confirmar y continuar")')
    }
    await page.click('button:has-text("Devolver con observaciones")')
    await expect(page.locator('text=Plan devuelto a revisión')).toBeVisible()
  })

  test('step 4 shows inventory coverage chart', async ({ page }) => {
    for (let i = 0; i < 3; i++) {
      await page.click('button:has-text("Confirmar y continuar")')
    }
    await expect(page.locator('text=Plan de reposición detallado')).toBeVisible()
    await page.waitForTimeout(500)
    const canvases = await page.locator('canvas').count()
    expect(canvases).toBeGreaterThanOrEqual(1)
  })
})
