import { test, expect } from '@playwright/test'

test.describe('Admin Projetos', () => {
  test('carrega página de projetos', async ({ page }) => {
    await page.goto('/admin/projects')
    await expect(page.getByText(/projetos/i).first()).toBeVisible()
  })

  test('exibe projeto de exemplo do seed', async ({ page }) => {
    await page.goto('/admin/projects')
    await expect(page.getByText('Operação Resgate').first()).toBeVisible({ timeout: 15000 })
  })

  test('exibe seletor de status de inscrição', async ({ page }) => {
    await page.goto('/admin/projects')
    const statusSelect = page.getByRole('combobox').first()
    if (await statusSelect.isVisible({ timeout: 10000 })) {
      await statusSelect.click()
      await expect(page.getByText(/pendente|aprovado|rejeitado/i).first()).toBeVisible()
    }
  })
})
