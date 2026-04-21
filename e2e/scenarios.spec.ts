import { test, expect } from '@playwright/test'

test.describe('Simulator scenarios persistence', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('pinsa-tour-simulator', '1')
      window.localStorage.setItem('pinsa-tour-sesion-ejecutiva', '1')
    })
    await page.goto('/simulator')
  })

  test('save button is disabled when no changes', async ({ page }) => {
    const saveBtn = page.locator('button:has-text("Guardar escenario")')
    await expect(saveBtn).toBeDisabled()
  })

  test('can save a scenario and see it in the list', async ({ page }) => {
    // Move a slider to create changes
    const supplySlider = page.locator('input[type="range"]').nth(1)
    await supplySlider.fill('40')

    // Click save
    await page.click('button:has-text("Guardar escenario")')
    await page.fill('input[placeholder*="Alza"]', 'Escenario test desabasto 40%')
    await page.locator('.fixed button:has-text("Guardar")').click()

    await expect(page.locator('text=Escenarios guardados (1)')).toBeVisible()
    await expect(page.locator('text=Escenario test desabasto 40%')).toBeVisible()
  })

  test('can toggle scenario for executive session', async ({ page }) => {
    const supplySlider = page.locator('input[type="range"]').nth(1)
    await supplySlider.fill('40')
    await page.click('button:has-text("Guardar escenario")')
    await page.fill('input[placeholder*="Alza"]', 'Escenario exec')
    await page.locator('.fixed button:has-text("Guardar")').click()

    // Toggle gavel (Enviar a Sesión Ejecutiva)
    await page.locator('button[title*="Sesión Ejecutiva"]').first().click()

    // Verify the scenario appears in the executive session page
    await page.goto('/sesion-ejecutiva')
    await expect(page.locator('text=Escenario exec')).toBeVisible()
  })

  test('production efficiency KPI is shown', async ({ page }) => {
    await expect(page.locator('text=Eficiencia producción')).toBeVisible()
  })
})
