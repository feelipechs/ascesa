import { test, expect } from '@playwright/test'

test.describe('Projetos', () => {
  test('carrega a página de projetos', async ({ page }) => {
    await page.goto('/projetos')
    await expect(page).toHaveTitle(/Ascesa/)
  })

  test('exibe projeto de exemplo', async ({ page }) => {
    await page.goto('/projetos')
    await expect(page.getByText('Operação Resgate')).toBeVisible({ timeout: 15000 })
  })

  test('navega para detalhe do projeto', async ({ page }) => {
    await page.goto('/projetos')
    const projectLink = page.locator('a[href*="/projects/"]').first()
    await projectLink.waitFor({ timeout: 15000 })
    await projectLink.click()
    await expect(page).toHaveURL(/\/(projetos|projects)\//, { timeout: 10000 })
  })
})
