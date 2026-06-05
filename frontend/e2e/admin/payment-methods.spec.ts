import { test, expect } from '@playwright/test'

test.describe('Admin Métodos de Pagamento (inline em /doacoes)', () => {
  test('carrega página de doações', async ({ page }) => {
    await page.goto('/doacoes')
    await expect(page.getByText(/doações/i).first()).toBeVisible()
  })

  test('exibe método PIX do seed', async ({ page }) => {
    await page.goto('/doacoes')
    await expect(page.getByText('PIX').first()).toBeVisible({ timeout: 15000 })
  })

  test('exibe botão Adicionar Método quando autenticado', async ({ page }) => {
    await page.goto('/doacoes')
    await expect(page.getByRole('button', { name: /adicionar método/i })).toBeVisible({ timeout: 10000 })
  })

  test('abre formulário de novo método via AdminSheet', async ({ page }) => {
    await page.goto('/doacoes')
    await page.getByRole('button', { name: /adicionar método/i }).click()
    await expect(page.getByRole('heading', { name: 'Novo método' })).toBeVisible({ timeout: 10000 })
    await expect(page.getByLabel(/tipo/i)).toBeVisible()
    await expect(page.getByLabel(/label/i)).toBeVisible()
  })

  test('cria método PIX via API e verifica na página', async ({ request, page }) => {
    const resp = await request.post('/api/payment-methods', {
      data: {
        type: 'PIX',
        label: 'PIX — CPF',
        instructions: 'Use a chave CPF para doar.',
        isActive: true,
        displayOrder: 1,
        key: '123.456.789-00',
        receiverName: 'Ascesa Doação',
        receiverCity: 'São Paulo',
      },
    })
    expect(resp.status()).toBe(201)

    await page.goto('/doacoes')
    await expect(page.getByText('PIX — CPF').first()).toBeVisible({ timeout: 10000 })
  })

  test('cria método Transferência Bancária via API', async ({ request }) => {
    const resp = await request.post('/api/payment-methods', {
      data: {
        type: 'BANK_TRANSFER',
        label: 'Transferência BB',
        instructions: 'Faça a transferência para a conta abaixo.',
        isActive: true,
        displayOrder: 2,
        bankName: 'Banco do Brasil',
        agency: '0001',
        account: '12345-6',
      },
    })
    expect(resp.status()).toBe(201)
    const body = await resp.json()
    expect(body.type).toBe('BANK_TRANSFER')
    expect(body.label).toBe('Transferência BB')
  })

  test('cria método Dinheiro via API', async ({ request }) => {
    const resp = await request.post('/api/payment-methods', {
      data: {
        type: 'CASH',
        label: 'Doação em Dinheiro',
        instructions: 'Entre em contato para combinar.',
        isActive: true,
        displayOrder: 3,
      },
    })
    expect(resp.status()).toBe(201)
    const body = await resp.json()
    expect(body.type).toBe('CASH')
  })

  test('GET /api/payment-methods retorna lista', async ({ request }) => {
    const resp = await request.get('/api/payment-methods')
    expect(resp.ok()).toBeTruthy()
    const body = await resp.json()
    expect(body.data).toBeInstanceOf(Array)
  })

  test('GET /api/payment-methods?active=true filtra ativos', async ({ request }) => {
    const resp = await request.get('/api/payment-methods?active=true')
    expect(resp.ok()).toBeTruthy()
    const body = await resp.json()
    const allActive = body.data.every((m: { isActive: boolean }) => m.isActive)
    expect(allActive).toBeTruthy()
  })

  test('GET /api/payment-methods/:id retorna método específico', async ({ request }) => {
    const list = await request.get('/api/payment-methods')
    const body = await list.json()
    const id = body.data?.[0]?.id
    expect(id).toBeTruthy()

    const resp = await request.get(`/api/payment-methods/${id}`)
    expect(resp.ok()).toBeTruthy()
  })

  test('PUT /api/payment-methods/:id atualiza método', async ({ request }) => {
    const createResp = await request.post('/api/payment-methods', {
      data: {
        type: 'PIX',
        label: 'PIX Para Editar',
        isActive: true,
        displayOrder: 99,
        key: '999.999.999-99',
        receiverName: 'Teste',
        receiverCity: 'Rio',
      },
    })
    expect(createResp.status()).toBe(201)
    const { id } = await createResp.json()

    const updateResp = await request.put(`/api/payment-methods/${id}`, {
      data: { type: 'PIX', label: 'PIX Editado E2E' },
    })
    expect(updateResp.ok()).toBeTruthy()
    const updated = await updateResp.json()
    expect(updated.label).toBe('PIX Editado E2E')
  })

  test('DELETE /api/payment-methods/:id remove método', async ({ request }) => {
    const createResp = await request.post('/api/payment-methods', {
      data: {
        type: 'CASH',
        label: 'Método Para Deletar',
        isActive: true,
        displayOrder: 100,
      },
    })
    expect(createResp.status()).toBe(201)
    const { id } = await createResp.json()

    const deleteResp = await request.delete(`/api/payment-methods/${id}`)
    expect(deleteResp.status()).toBe(204)
  })

  test('PATCH /api/payment-methods/reorder reordena métodos', async ({ request }) => {
    const list = await request.get('/api/payment-methods')
    const body = await list.json()
    const items = body.data?.map((m: { id: string }, i: number) => ({
      id: m.id,
      displayOrder: body.data.length - i,
    }))
    if (items && items.length >= 2) {
      const resp = await request.patch('/api/payment-methods/reorder', { data: { items } })
      expect(resp.ok()).toBeTruthy()
    }
  })

  test('deleta método via DeleteDialog no card', async ({ page }) => {
    await page.request.post('/api/payment-methods', {
      data: {
        type: 'CASH',
        label: 'Dinheiro Para Deletar E2E',
        isActive: true,
        displayOrder: 101,
      },
    })

    await page.goto('/doacoes')
    await expect(page.getByText('Dinheiro Para Deletar E2E').first()).toBeVisible({ timeout: 10000 })

    const card = page.locator('.group, [class*="card"]', { hasText: 'Dinheiro Para Deletar E2E' }).first()
    const deleteBtn = card.locator('button.text-destructive')
    if (await deleteBtn.isVisible({ timeout: 5000 })) {
      await deleteBtn.click()
      await expect(page.getByText(/tem certeza/i).or(page.getByRole('heading', { name: /excluir/i }))).toBeVisible()
      await page.getByRole('button', { name: /excluir/i }).last().click()
      await expect(page.getByText('Dinheiro Para Deletar E2E')).not.toBeVisible({ timeout: 10000 })
    }
  })
})
