import { test, expect } from '@playwright/test'

test.describe('Áreas', () => {
  test('carrega a página de áreas', async ({ page }) => {
    await page.goto('/areas')
    await expect(page).toHaveTitle(/Ascesa/)
  })

  test('exibe área de resgate', async ({ page }) => {
    await page.goto('/areas')
    await expect(page.getByText('Resgate e Acolhimento')).toBeVisible()
  })
})
