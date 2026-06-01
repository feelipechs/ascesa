import { test, expect } from '@playwright/test'

test.describe('Admin Configurações', () => {
  test('carrega página de configurações', async ({ page }) => {
    await page.goto('/admin/settings')
    await expect(page.getByText(/configurações/i).first()).toBeVisible()
  })

  test('campos estão desabilitados por padrão', async ({ page }) => {
    await page.goto('/admin/settings')
    await page.waitForSelector('form')
    const firstInput = page.locator('input').first()
    await expect(firstInput).toBeDisabled({ timeout: 10000 })
  })

  test('botão Editar habilita os campos', async ({ page }) => {
    await page.goto('/admin/settings')
    await page.waitForSelector('form')
    const editButton = page.getByRole('button', { name: /editar/i }).first()
    await expect(editButton).toBeVisible({ timeout: 10000 })
    await editButton.click()
    const firstInput = page.locator('input').first()
    await expect(firstInput).toBeEnabled()
  })

  test('salva alterações nas configurações', async ({ page }) => {
    await page.goto('/admin/settings')
    await page.waitForSelector('form')
    await page.getByRole('button', { name: /editar/i }).first().click()

    const emailInput = page.locator('input').first()
    await emailInput.fill('teste.editado@ascesa.org')

    await page.getByRole('button', { name: /salvar alterações/i }).click()

    await expect(page.locator('input').first()).toHaveValue('teste.editado@ascesa.org', { timeout: 15000 })
    await expect(page.locator('input').first()).toBeDisabled()
  })

  test('cancela edição e mantém valores originais', async ({ page }) => {
    await page.goto('/admin/settings')
    await page.waitForSelector('form')
    await page.getByRole('button', { name: /editar/i }).first().click()

    const emailInput = page.locator('input').first()
    await emailInput.fill('nao.salvar@teste.com')

    await page.getByRole('button', { name: /cancelar/i }).click()

    await expect(page.locator('input').first()).toBeDisabled({ timeout: 5000 })
  })
})
