import { test, expect } from '@playwright/test'

test.describe('Transparência', () => {
  test('carrega a página de transparência', async ({ page }) => {
    await page.goto('/transparencia')
    await expect(page).toHaveTitle(/Ascesa/)
  })

  test('exibe documentos', async ({ page }) => {
    await page.goto('/transparencia')
    await expect(page.getByText('Estatuto Social', { exact: true })).toBeVisible({ timeout: 15000 })
  })
})
