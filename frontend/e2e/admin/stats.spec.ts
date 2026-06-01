import { test, expect } from '@playwright/test'

test.describe('Admin Estatísticas', () => {
  test('GET /api/stats retorna lista', async ({ request }) => {
    const resp = await request.get('/api/stats')
    expect(resp.ok()).toBeTruthy()
    const body = await resp.json()
    expect(body).toBeInstanceOf(Array)
  })

  test('contém estatísticas do seed', async ({ request }) => {
    const resp = await request.get('/api/stats')
    const stats = (await resp.json()) as Array<{ label: string }>
    expect(stats.some((s) => s.label === 'Animais Resgatados')).toBeTruthy()
  })

  test('POST /api/stats cria nova estatística', async ({ request }) => {
    const resp = await request.post('/api/stats', {
      data: { label: 'Teste E2E', value: '42', order: 99 },
    })
    expect(resp.ok()).toBeTruthy()
    const stat = await resp.json()
    expect(stat.label).toBe('Teste E2E')
    expect(stat.value).toBe('42')
    expect(stat.id).toBeTruthy()
  })

  test('GET /api/stats/:id retorna estatística específica', async ({ request }) => {
    const list = await request.get('/api/stats')
    const stats = (await list.json()) as Array<{ id: string }>
    const id = stats[0]?.id
    expect(id).toBeTruthy()

    const resp = await request.get(`/api/stats/${id}`)
    expect(resp.ok()).toBeTruthy()
    const stat = await resp.json()
    expect(stat.id).toBe(id)
  })

  test('PUT /api/stats/:id atualiza estatística', async ({ request }) => {
    const list = await request.get('/api/stats')
    const stats = (await list.json()) as Array<{ id: string }>
    const id = stats[0]?.id
    expect(id).toBeTruthy()

    const resp = await request.put(`/api/stats/${id}`, {
      data: { value: '999+' },
    })
    expect(resp.ok()).toBeTruthy()
    const updated = await resp.json()
    expect(updated.value).toBe('999+')
  })

  test('DELETE /api/stats/:id remove estatística', async ({ request }) => {
    const create = await request.post('/api/stats', {
      data: { label: 'Stat para Deletar', value: '0' },
    })
    const stat = await create.json()
    expect(stat.id).toBeTruthy()

    const del = await request.delete(`/api/stats/${stat.id}`)
    expect(del.ok()).toBeTruthy()

    const get = await request.get(`/api/stats/${stat.id}`)
    expect(get.status()).toBe(404)
  })

  test('valida label obrigatório no POST', async ({ request }) => {
    const resp = await request.post('/api/stats', {
      data: { value: '123' },
    })
    expect(resp.ok()).toBeFalsy()
    expect(resp.status()).toBe(400)
  })
})
