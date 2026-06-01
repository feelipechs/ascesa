import { test, expect } from '@playwright/test'

test.describe('Doações', () => {
  test('carrega a página de doações', async ({ page }) => {
    await page.goto('/doacoes')
    await expect(page).toHaveTitle(/Ascesa/)
  })

  test('exibe seção de doação', async ({ page }) => {
    await page.goto('/doacoes')
    await expect(page.getByText(/doação/i).first()).toBeVisible()
  })
})
