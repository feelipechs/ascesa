import { test, expect } from '@playwright/test'

test.describe('Animais', () => {
  test('carrega a página de animais', async ({ page }) => {
    await page.goto('/animais')
    await expect(page).toHaveTitle(/Ascesa/)
  })

  test('exibe animal de exemplo', async ({ page }) => {
    await page.goto('/animais')
    await expect(page.getByText('Thor')).toBeVisible()
  })
})
