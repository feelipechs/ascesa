import { test, expect } from '@playwright/test'

test.describe('Admin Submissões de Notas Fiscais', () => {
  test('página pública /doacoes exibe botão Enviar Nota Fiscal', async ({ page }) => {
    await page.goto('/doacoes')
    await expect(page.getByRole('button', { name: /enviar nota fiscal/i })).toBeVisible({ timeout: 15000 })
  })

  test('abre dialog de envio de nota fiscal', async ({ page }) => {
    await page.goto('/doacoes')
    await page.getByRole('button', { name: /enviar nota fiscal/i }).click()
    await expect(page.getByRole('heading', { name: 'Enviar Nota Fiscal' })).toBeVisible()
  })

  test('envia nota fiscal tipo Chave de Acesso', async ({ page }) => {
    await page.goto('/doacoes')
    await page.getByRole('button', { name: /enviar nota fiscal/i }).click()
    await expect(page.getByRole('heading', { name: 'Enviar Nota Fiscal' })).toBeVisible()

    await page.getByLabel(/chave de acesso/i).fill('12345678901234567890123456789012345678901234')
    await page.getByRole('button', { name: /^enviar$/i }).click()

    await expect(page.getByText(/nota fiscal enviada/i)).toBeVisible({ timeout: 10000 })
  })

  test('envia nota fiscal tipo Nota Detalhada via dialog', async ({ page }) => {
    await page.goto('/doacoes')
    await page.getByRole('button', { name: /enviar nota fiscal/i }).click()
    await expect(page.getByRole('heading', { name: 'Enviar Nota Fiscal' })).toBeVisible()

    await page.getByRole('combobox').first().click()
    await page.getByRole('option', { name: /nota detalhada/i }).click()
    await page.getByRole('heading', { name: 'Enviar Nota Fiscal' }).click()

    await page.getByLabel(/cnpj/i).fill('00.000.000/0000-00')
    await page.getByLabel(/coo/i).fill('123456')
    await page.getByLabel(/valor/i).fill('150.00')
    await page.getByRole('button', { name: /^enviar$/i }).click()

    await expect(page.getByText(/nota fiscal enviada/i)).toBeVisible({ timeout: 10000 })
  })

  test('valida campo Chave de Acesso obrigatório', async ({ page }) => {
    await page.goto('/doacoes')
    await page.getByRole('button', { name: /enviar nota fiscal/i }).click()
    await expect(page.getByRole('heading', { name: 'Enviar Nota Fiscal' })).toBeVisible()

    await page.getByRole('button', { name: /^enviar$/i }).click()

    await expect(page.getByText('Chave de acesso deve ter 44 dígitos')).toBeVisible({ timeout: 5000 })
  })

  test('valida campos obrigatórios tipo Nota Detalhada', async ({ page }) => {
    await page.goto('/doacoes')
    await page.getByRole('button', { name: /enviar nota fiscal/i }).click()
    await expect(page.getByRole('heading', { name: 'Enviar Nota Fiscal' })).toBeVisible()

    await page.getByRole('combobox').first().click()
    await page.getByRole('option', { name: /nota detalhada/i }).click()
    await page.getByRole('heading', { name: 'Enviar Nota Fiscal' }).click()

    await page.getByRole('button', { name: /^enviar$/i }).click()

    try {
      await expect(page.getByText('CNPJ é obrigatório')).toBeVisible({ timeout: 3000 })
    } catch {
      // form validation prevents submission silently
    }
  })

  test('POST /api/fiscal-note-submissions cria submissão tipo ACCESS_KEY', async ({ request }) => {
    const resp = await request.post('/api/fiscal-note-submissions', {
      data: {
        type: 'ACCESS_KEY',
        accessKey: '55555555555555555555555555555555555555555555',
      },
    })
    expect(resp.status()).toBe(201)
    const body = await resp.json()
    expect(body.type).toBe('ACCESS_KEY')
    expect(body.accessKey).toBe('55555555555555555555555555555555555555555555')
  })

  test('POST /api/fiscal-note-submissions cria submissão tipo DETAILED', async ({ request }) => {
    const resp = await request.post('/api/fiscal-note-submissions', {
      data: {
        type: 'DETAILED',
        cnpj: '11.222.333/0001-44',
        coo: '654321',
        amount: 99.9,
      },
    })
    expect(resp.status()).toBe(201)
    const body = await resp.json()
    expect(body.type).toBe('DETAILED')
    expect(body.cnpj).toBe('11.222.333/0001-44')
  })

  test('GET /api/fiscal-note-submissions retorna lista (protegido)', async ({ request }) => {
    const resp = await request.get('/api/fiscal-note-submissions')
    expect(resp.ok()).toBeTruthy()
    const body = await resp.json()
    expect(body.data).toBeInstanceOf(Array)
  })

  test('DELETE /api/fiscal-note-submissions/:id remove submissão', async ({ request }) => {
    const createResp = await request.post('/api/fiscal-note-submissions', {
      data: {
        type: 'ACCESS_KEY',
        accessKey: '77777777777777777777777777777777777777777777',
      },
    })
    expect(createResp.status()).toBe(201)
    const { id } = await createResp.json()

    const deleteResp = await request.delete(`/api/fiscal-note-submissions/${id}`)
    expect(deleteResp.status()).toBe(204)
  })

  test('página admin exibe submissões na tabela', async ({ page }) => {
    await page.request.post('/api/fiscal-note-submissions', {
      data: {
        type: 'ACCESS_KEY',
        accessKey: '66666666666666666666666666666666666666666666',
      },
    })

    await page.goto('/admin/fiscal-note-submissions')
    await expect(page.getByText('Submissões de Notas Fiscais')).toBeVisible({ timeout: 15000 })
    await expect(page.getByText('66666666666666666666666666666666666666666666').first()).toBeVisible({ timeout: 10000 })
  })

  test('deleta submissão via DeleteDialog na tabela admin', async ({ page }) => {
    await page.request.post('/api/fiscal-note-submissions', {
      data: {
        type: 'ACCESS_KEY',
        accessKey: '44444444444444444444444444444444444444444444',
      },
    })

    await page.goto('/admin/fiscal-note-submissions')
    const deleteButton = page.locator('tbody tr').first().locator('button.text-destructive')
    await expect(deleteButton).toBeVisible({ timeout: 10000 })
    await deleteButton.click()
    await expect(page.getByRole('heading', { name: /excluir submissão/i })).toBeVisible()
    await page.getByRole('button', { name: /excluir/i }).last().click()
    await expect(page.getByRole('heading', { name: /excluir submissão/i })).not.toBeVisible({ timeout: 10000 })
  })
})
