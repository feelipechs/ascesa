import { test, expect } from '@playwright/test'

test.describe('Contato', () => {
  test('carrega a página de contato', async ({ page }) => {
    await page.goto('/contato')
    await expect(page).toHaveTitle(/Ascesa/)
  })

  test('exibe informações de contato', async ({ page }) => {
    await page.goto('/contato')
    await expect(page.getByText(/contato@ascesa\.org|Rua das Flores/i).first()).toBeVisible()
  })
})
