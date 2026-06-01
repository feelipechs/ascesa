import { test, expect } from '@playwright/test'

test.describe('Admin Dashboard', () => {
  test('carrega dashboard com cards de estatísticas', async ({ page }) => {
    await page.goto('/admin')
    await expect(page.getByText('Voluntários', { exact: true }).first()).toBeVisible({ timeout: 10000 })
  })

  test('exibe card de Projetos no dashboard', async ({ page }) => {
    await page.goto('/admin')
    await expect(page.getByText('Projetos', { exact: true }).first()).toBeVisible({ timeout: 10000 })
  })

  test('exibe card de Blog no dashboard', async ({ page }) => {
    await page.goto('/admin')
    await expect(page.getByText('Blog', { exact: true }).first()).toBeVisible({ timeout: 10000 })
  })

  test('sidebar navega para projetos', async ({ page }) => {
    await page.goto('/admin')
    await page.getByRole('link', { name: /projetos/i }).click()
    await expect(page).toHaveURL(/\/admin\/projects/)
  })

  test('sidebar navega para voluntários', async ({ page }) => {
    await page.goto('/admin')
    await page.getByRole('link', { name: /voluntários/i }).click()
    await expect(page).toHaveURL(/\/admin\/volunteers/)
  })
})
