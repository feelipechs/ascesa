import { test, expect } from '@playwright/test'

test.describe('Admin Usuários', () => {
  test('carrega página de usuários', async ({ page }) => {
    await page.goto('/admin/users')
    await expect(page.getByText(/usuários/i).first()).toBeVisible()
  })

  test('abre formulário de novo usuário', async ({ page }) => {
    await page.goto('/admin/users')
    await page.getByRole('button', { name: /novo usuário/i }).click()
    await expect(page.getByRole('heading', { name: 'Novo usuário' })).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/senha/i)).toBeVisible()
  })

  test('valida campos obrigatórios', async ({ page }) => {
    await page.goto('/admin/users')
    await page.getByRole('button', { name: /novo usuário/i }).click()
    await expect(page.getByRole('heading', { name: 'Novo usuário' })).toBeVisible()

    await page.evaluate(() => document.querySelector('form')?.setAttribute('novalidate', ''))
    await page.getByRole('button', { name: /adicionar usuário/i }).click()

    await expect(page.getByText('Email inválido')).toBeVisible({ timeout: 5000 })
    await expect(page.getByText('Mínimo 6 caracteres')).toBeVisible()
  })

  test('cria um novo usuário', async ({ page }) => {
    await page.goto('/admin/users')
    await page.getByRole('button', { name: /novo usuário/i }).click()
    await expect(page.getByRole('heading', { name: 'Novo usuário' })).toBeVisible()

    await page.getByLabel(/email/i).fill('novousuario@teste.com')
    await page.getByLabel(/senha/i).fill('123456')

    await page.getByRole('button', { name: /adicionar usuário/i }).click()

    await expect(page.getByText('Usuário criado').or(page.getByText('criado')).first()).toBeVisible({ timeout: 15000 })
  })

  test('edita usuário existente', async ({ page }) => {
    await page.goto('/admin/users')
    await expect(page.getByText('teste@teste.com').first()).toBeVisible({ timeout: 15000 })

    const editButton = page.locator('tbody tr').first().locator('td:last-child button:first-child')
    await editButton.click()

    await expect(page.getByRole('heading', { name: 'Editar usuário' })).toBeVisible()
    await page.getByLabel(/email/i).clear()
    await page.getByLabel(/email/i).fill('admin.editado@teste.com')

    await page.getByRole('button', { name: /salvar alterações/i }).click()

    await expect(page.getByText('Usuário atualizado').or(page.getByText('atualizado')).first()).toBeVisible({ timeout: 15000 })
  })

  test('deleta usuário via DeleteDialog', async ({ page }) => {
    await page.request.post('/api/users', {
      data: { email: 'paradeletar@teste.com', password: '123456' },
    })

    await page.goto('/admin/users')
    const searchInput = page.getByPlaceholder(/pesquisar/i)
    await expect(searchInput).toBeVisible({ timeout: 5000 })
    await searchInput.fill('paradeletar@teste.com')
    await page.waitForTimeout(500)

    const deleteButton = page.locator('tbody tr').first().locator('td:last-child button.text-destructive')
    await expect(deleteButton).toBeVisible({ timeout: 5000 })
    await deleteButton.click()
    await expect(page.getByRole('heading', { name: /excluir usuário/i })).toBeVisible()
    await page.getByRole('button', { name: /excluir/i }).last().click()
    await expect(page.getByRole('heading', { name: /excluir usuário/i })).not.toBeVisible({ timeout: 10000 })
  })
})
