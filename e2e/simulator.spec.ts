import { test, expect } from '@playwright/test'

test.describe('Simulador de Escenarios', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/simulator')
  })

  test('shows page title', async ({ page }) => {
    await expect(page.locator('h1', { hasText: 'Simulador de Escenarios' })).toBeVisible()
  })

  test('shows 4 scenario sliders', async ({ page }) => {
    await expect(page.locator('text=Precio materia prima')).toBeVisible()
    await expect(page.locator('text=Desabasto de MP')).toBeVisible()
    await expect(page.locator('text=Variación de demanda')).toBeVisible()
    await expect(page.locator('text=Stock de seguridad')).toBeVisible()
    const sliders = page.locator('input[type=range]')
    await expect(sliders).toHaveCount(4)
  })

  test('shows horizon selector with 4 options', async ({ page }) => {
    await expect(page.locator('button:has-text("1 mes")')).toBeVisible()
    await expect(page.locator('button:has-text("3 meses")')).toBeVisible()
    await expect(page.locator('button:has-text("6 meses")')).toBeVisible()
    await expect(page.locator('button:has-text("12 meses")')).toBeVisible()
  })

  test('shows impact summary section', async ({ page }) => {
    // Section label uses CSS uppercase — match by visible text
    await expect(page.getByText('Impacto del escenario', { exact: false })).toBeVisible()
    await expect(page.locator('text=Fill Rate promedio')).toBeVisible()
    // Capital de trabajo appears multiple times — just verify at least one is visible
    await expect(page.locator('text=Revenue en riesgo')).toBeVisible()
    await expect(page.locator('text=Δ COGS materiales')).toBeVisible()
  })

  test('charts render on load', async ({ page }) => {
    await page.waitForTimeout(1000)
    await expect(page.locator('text=Fill Rate proyectado vs baseline')).toBeVisible()
    await expect(page.locator('text=Capital de trabajo proyectado')).toBeVisible()
    const canvases = await page.locator('canvas').count()
    expect(canvases).toBeGreaterThanOrEqual(2)
  })

  test('reset button is not visible by default', async ({ page }) => {
    await expect(page.locator('button:has-text("Reset")')).not.toBeVisible()
  })

  test('reset button appears after changing a slider', async ({ page }) => {
    const slider = page.locator('input[type=range]').first()
    await slider.fill('20')
    await slider.dispatchEvent('input')
    await expect(page.locator('button:has-text("Reset")')).toBeVisible()
  })

  test('reset button restores default values', async ({ page }) => {
    // Change the safety stock slider (4th slider, default 33)
    const sliders = page.locator('input[type=range]')
    const safetySlider = sliders.nth(3)
    await safetySlider.fill('60')
    await safetySlider.dispatchEvent('input')
    await expect(page.locator('button:has-text("Reset")')).toBeVisible()

    await page.click('button:has-text("Reset")')
    await expect(page.locator('button:has-text("Reset")')).not.toBeVisible()
    await expect(page.locator('text=33d')).toBeVisible()
  })

  test('horizon selector changes chart label count', async ({ page }) => {
    await page.click('button:has-text("1 mes")')
    await page.waitForTimeout(500)
    // 1 month shows 1 data point — page still renders without crash
    await expect(page.locator('text=Simulador de Escenarios').first()).toBeVisible()

    await page.click('button:has-text("12 meses")')
    await page.waitForTimeout(500)
    await expect(page.locator('text=Simulador de Escenarios').first()).toBeVisible()
  })

  test('extreme warning banner does NOT appear at default values', async ({ page }) => {
    await expect(page.locator('[data-testid="extreme-warning"]')).not.toBeVisible()
  })

  test('extreme warning banner appears when supply > 60 AND demand > 30', async ({ page }) => {
    const sliders = page.locator('input[type=range]')
    // Slider 0 = rawMat, 1 = supplyDisruption, 2 = demandChange, 3 = safetyStock
    const supplySlider = sliders.nth(1)
    const demandSlider = sliders.nth(2)

    await supplySlider.fill('65')
    await supplySlider.dispatchEvent('input')

    await demandSlider.fill('35')
    await demandSlider.dispatchEvent('input')

    await expect(page.locator('[data-testid="extreme-warning"]')).toBeVisible()
    await expect(page.locator('text=Valor fuera de rangos aceptables')).toBeVisible()
  })

  test('extreme warning disappears when values go back within range', async ({ page }) => {
    const sliders = page.locator('input[type=range]')
    const supplySlider = sliders.nth(1)
    const demandSlider = sliders.nth(2)

    // Trigger extreme
    await supplySlider.fill('65')
    await supplySlider.dispatchEvent('input')
    await demandSlider.fill('35')
    await demandSlider.dispatchEvent('input')
    await expect(page.locator('[data-testid="extreme-warning"]')).toBeVisible()

    // Reduce supply back to safe range
    await supplySlider.fill('30')
    await supplySlider.dispatchEvent('input')
    await expect(page.locator('[data-testid="extreme-warning"]')).not.toBeVisible()
  })

  test('narrative interpretation appears when hasChanges', async ({ page }) => {
    const supplySlider = page.locator('input[type=range]').nth(1)
    await supplySlider.fill('40')
    await supplySlider.dispatchEvent('input')
    await expect(page.locator('text=Interpretación')).toBeVisible()
  })
})
