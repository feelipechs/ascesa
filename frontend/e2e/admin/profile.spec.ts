import { test, expect } from '@playwright/test'

test.describe('Admin Perfil', () => {
  test('carrega página de perfil', async ({ page }) => {
    await page.goto('/admin/profile')
    await expect(page.getByText('Meu Perfil')).toBeVisible()
  })

  test('edita nome do perfil', async ({ page }) => {
    // Update name via API directly
    const resp = await page.request.put('/api/me', { data: { name: 'Admin Teste Editado' } })
    expect(resp.ok()).toBeTruthy()
    const body = await resp.json()
    expect(body.name).toBe('Admin Teste Editado')

    await page.goto('/admin/profile')
    await expect(page.getByText('Meu Perfil')).toBeVisible()
  })

  test('altera senha com sucesso', async ({ page }) => {
    await page.goto('/admin/profile')
    await expect(page.getByText('Meu Perfil')).toBeVisible()

    await page.getByRole('button', { name: /alterar senha/i }).click()
    await page.getByLabel(/senha atual/i).fill('123456')
    await page.getByLabel(/nova senha/i).fill('654321')
    await page.getByLabel(/confirmar nova senha/i).fill('654321')
    await page.getByRole('button', { name: /salvar alterações/i }).click()

    await expect(page.getByText('Senha atualizada!')).toBeVisible()

    const resp = await page.request.post('/api/auth/change-password', {
      data: { currentPassword: '654321', newPassword: '123456' },
    })
    expect(resp.ok()).toBeTruthy()
  })

  test('cancela edição do perfil', async ({ page }) => {
    await page.goto('/admin/profile')
    await page.getByRole('button', { name: /editar/i }).first().click()

    const nomeInput = page.getByLabel(/nome/i)
    await nomeInput.clear()
    await nomeInput.fill('Nome Descartado')

    await page.getByRole('button', { name: /cancelar/i }).click()

    await expect(page.getByText('Meu Perfil')).toBeVisible()
  })
})
