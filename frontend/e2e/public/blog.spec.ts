import { test, expect } from '@playwright/test'

test.describe('Blog', () => {
  test('carrega a página do blog', async ({ page }) => {
    await page.goto('/blog')
    await expect(page).toHaveTitle(/Ascesa/)
  })

  test('exibe post de exemplo', async ({ page }) => {
    await page.goto('/blog')
    await expect(page.getByText('Como preparar sua casa').first()).toBeVisible({ timeout: 15000 })
  })

  test('busca por texto no blog', async ({ page }) => {
    await page.goto('/blog')
    await expect(page.getByText('Como preparar sua casa').first()).toBeVisible({ timeout: 15000 })
    const searchInput = page.getByPlaceholder(/buscar|pesquisar/i)
    if (await searchInput.isVisible({ timeout: 5000 })) {
      await searchInput.fill('pet')
      await page.waitForTimeout(500)
      await expect(page.getByText('pet').first()).toBeVisible({ timeout: 10000 })
    }
  })

  test('navega para detalhe do post', async ({ page }) => {
    await page.goto('/blog')
    await expect(page.getByText('Como preparar sua casa').first()).toBeVisible({ timeout: 15000 })
    await page.getByText('Como preparar sua casa').first().click()
    await expect(page).toHaveURL(/\/blog\/[a-z]/)
  })

  test('não exibe botão Adicionar para visitante', async ({ page }) => {
    await page.goto('/blog')
    await expect(page.getByRole('button', { name: /adicionar/i })).not.toBeVisible()
  })
})
