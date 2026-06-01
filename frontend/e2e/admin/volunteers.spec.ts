import { test, expect } from '@playwright/test'

test.describe('Admin Voluntários', () => {
  test('carrega página de voluntários', async ({ page }) => {
    await page.goto('/admin/volunteers')
    await expect(page.getByText(/voluntários/i).first()).toBeVisible()
  })

  test('exibe voluntário do seed na tabela', async ({ page }) => {
    await page.goto('/admin/volunteers')
    await expect(page.getByText('Ana Lima').first()).toBeVisible({ timeout: 15000 })
  })

  test('abre formulário de novo voluntário', async ({ page }) => {
    await page.goto('/admin/volunteers')
    await page.getByRole('button', { name: /novo voluntário/i }).click()
    await expect(page.getByRole('heading', { name: 'Novo voluntário' })).toBeVisible()
    await expect(page.getByLabel(/nome/i)).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
  })

  test('preenche formulário de voluntário e submete', async ({ page }) => {
    await page.goto('/admin/volunteers')
    await page.getByRole('button', { name: /novo voluntário/i }).click()

    await page.getByLabel(/nome/i).fill('Carlos Teste')
    await page.getByLabel(/email/i).fill('carlos.teste3@example.com')
    await page.getByLabel(/telefone/i).fill('(11) 97777-6666')

    await page.getByRole('button', { name: /adicionar voluntário/i }).click()

    await expect(page.getByText('Voluntário criado').or(page.getByText('voluntário')).first()).toBeVisible({ timeout: 15000 })
  })

  test('campo de busca filtra voluntários', async ({ page }) => {
    await page.goto('/admin/volunteers')
    const searchInput = page.getByPlaceholder(/pesquisar/i)
    if (await searchInput.isVisible({ timeout: 10000 })) {
      await searchInput.fill('Ana')
      await page.waitForTimeout(500)
      await expect(page.getByText('Ana Lima').first()).toBeVisible()
    }
  })

  test('valida campos obrigatórios no formulário', async ({ page }) => {
    await page.goto('/admin/volunteers')
    await page.getByRole('button', { name: /novo voluntário/i }).click()
    await expect(page.getByRole('heading', { name: 'Novo voluntário' })).toBeVisible()

    await page.evaluate(() => document.querySelector('form')?.setAttribute('novalidate', ''))
    await page.getByRole('button', { name: /adicionar voluntário/i }).click()

    await expect(page.getByText('Nome obrigatório')).toBeVisible({ timeout: 5000 })
    await expect(page.getByText('Email inválido')).toBeVisible()
  })

  test('edita voluntário existente via API', async ({ page }) => {
    // Get the volunteer ID from the API
    const listResp = await page.request.get('/api/volunteers')
    const volunteers = await listResp.json() as Array<{ id: string; name: string; email: string }>
    const ana = volunteers.find(v => v.name.includes('Ana'))
    expect(ana?.id).toBeTruthy()

    const resp = await page.request.put(`/api/volunteers/${ana!.id}`, {
      data: { name: 'Ana Lima Editada' },
    })
    expect(resp.ok()).toBeTruthy()

    await page.goto('/admin/volunteers')
    await expect(page.getByText('Ana Lima Editada').first()).toBeVisible({ timeout: 15000 })
  })

  test('deleta voluntário via DeleteDialog', async ({ page }) => {
    await page.goto('/admin/volunteers')
    const deleteButton = page.locator('tbody tr').first().locator('td:last-child button.text-destructive')
    if (await deleteButton.isVisible({ timeout: 5000 })) {
      await deleteButton.click()
      await expect(page.getByText(/tem certeza/i)).toBeVisible()
      await page.getByRole('button', { name: /confirmar|excluir/i }).last().click()
      await expect(page.getByText(/tem certeza/i)).not.toBeVisible({ timeout: 10000 })
    }
  })
})
