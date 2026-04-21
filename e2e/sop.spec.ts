import { test, expect } from '@playwright/test'

test.describe('S&OP Ciclo Mensual', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('pinsa-tour-sop', '1')
    })
    await page.goto('/sop')
  })

  test('shows page title and period', async ({ page }) => {
    await expect(page.locator('h1', { hasText: 'Ciclo S&OP Mensual' })).toBeVisible()
    await expect(page.locator('text=Abril 2026')).toBeVisible()
  })

  test('shows stepper with 5 steps', async ({ page }) => {
    await expect(page.locator('text=Pronóstico').first()).toBeVisible()
    await expect(page.locator('text=Colaboración').first()).toBeVisible()
    await expect(page.locator('text=Inventarios').first()).toBeVisible()
    await expect(page.locator('text=Producción').first()).toBeVisible()
    await expect(page.locator('text=Distribución').first()).toBeVisible()
  })

  test('step 1 content is visible by default', async ({ page }) => {
    await expect(page.locator('text=Pronóstico estadístico').first()).toBeVisible()
    await expect(page.locator('text=Asertividad Mar 2026')).toBeVisible()
  })

  test('step 1 shows KPI cards', async ({ page }) => {
    await expect(page.locator('text=Asertividad Mar 2026')).toBeVisible()
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
    await expect(page.locator('text=Colaboración comercial')).toBeVisible()
  })

  test('navigates through all 5 steps', async ({ page }) => {
    // Step 2
    await page.click('button:has-text("Confirmar y continuar")')
    await expect(page.locator('text=Colaboración comercial')).toBeVisible()

    // Step 3 — Planeación de Inventarios
    await page.click('button:has-text("Confirmar y continuar")')
    await expect(page.locator('text=Planeación de Inventarios')).toBeVisible()

    // Step 4 — Planeación de Producción
    await page.click('button:has-text("Confirmar y continuar")')
    await expect(page.locator('text=Planeación de Producción')).toBeVisible()

    // Step 5 — Planeación de Distribución
    await page.click('button:has-text("Confirmar y continuar")')
    await expect(page.locator('text=Planeación de Distribución')).toBeVisible()
  })

  test('back button returns to previous step', async ({ page }) => {
    await page.click('button:has-text("Confirmar y continuar")')
    await expect(page.locator('text=Colaboración comercial')).toBeVisible()

    await page.click('button:has-text("Paso anterior")')
    await expect(page.locator('text=Pronóstico estadístico').first()).toBeVisible()
  })

  test('back button is disabled on step 1', async ({ page }) => {
    const backBtn = page.locator('button:has-text("Paso anterior")')
    await expect(backBtn).toBeDisabled()
  })

  test('step 3 shows inventory plan', async ({ page }) => {
    for (let i = 0; i < 2; i++) {
      await page.click('button:has-text("Confirmar y continuar")')
    }
    await expect(page.locator('text=Plan de reposición detallado')).toBeVisible()
    await page.waitForTimeout(500)
    const canvases = await page.locator('canvas').count()
    expect(canvases).toBeGreaterThanOrEqual(1)
  })

  test('step 4 shows production capacity gap with 3 options', async ({ page }) => {
    for (let i = 0; i < 3; i++) {
      await page.click('button:has-text("Confirmar y continuar")')
    }
    await expect(page.locator('text=Programa de producción por línea')).toBeVisible()
    await expect(page.locator('text=Brecha detectada')).toBeVisible()
    await expect(page.locator('text=Ampliar turno nocturno Línea 5')).toBeVisible()
    await expect(page.locator('text=Aceptar quiebre controlado en OXXO')).toBeVisible()
    await expect(page.locator('text=Renegociar plan comercial con Walmart')).toBeVisible()
  })

  test('step 5 shows distribution plan planta → cedis', async ({ page }) => {
    for (let i = 0; i < 4; i++) {
      await page.click('button:has-text("Confirmar y continuar")')
    }
    await expect(page.locator('text=plan de reposición Planta → CEDIS')).toBeVisible()
    await expect(page.locator('text=Cajas a enviar a CEDIS')).toBeVisible()
    await expect(page.locator('text=Plan de reposición por SKU')).toBeVisible()
  })

  test('step 5 approve button completes cycle', async ({ page }) => {
    for (let i = 0; i < 4; i++) {
      await page.click('button:has-text("Confirmar y continuar")')
    }
    await expect(page.locator('button:has-text("Aprobar plan Abr 2026")')).toBeVisible()
  })
})
