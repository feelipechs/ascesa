import { test, expect } from '@playwright/test'

test.describe('Sobre', () => {
  test('carrega a página sobre', async ({ page }) => {
    await page.goto('/sobre')
    await expect(page).toHaveTitle(/Ascesa/)
  })

  test('exibe missão da ONG', async ({ page }) => {
    await page.goto('/sobre')
    await expect(page.getByText('Resgatar, cuidar e encontrar lares para animais')).toBeVisible({ timeout: 15000 })
  })
})
