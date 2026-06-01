import { test, expect } from '@playwright/test'

test.describe('Admin Áreas', () => {
  test('GET /api/areas retorna lista', async ({ request }) => {
    const resp = await request.get('/api/areas')
    expect(resp.ok()).toBeTruthy()
    const body = await resp.json()
    expect(body.data).toBeInstanceOf(Array)
  })

  test('contém área do seed', async ({ request }) => {
    const resp = await request.get('/api/areas')
    const body = await resp.json()
    const areas = body.data as Array<{ title: string; slug: string }>
    expect(areas.some((a) => a.slug === 'resgate-acolhimento')).toBeTruthy()
  })

  test('POST /api/areas cria nova área', async ({ request }) => {
    const resp = await request.post('/api/areas', {
      data: { title: 'Castração Solidária', slug: 'castracao-solidaria' },
    })
    expect(resp.ok()).toBeTruthy()
    const area = await resp.json()
    expect(area.title).toBe('Castração Solidária')
    expect(area.slug).toBe('castracao-solidaria')
    expect(area.id).toBeTruthy()
  })

  test('GET /api/areas/:id retorna área específica', async ({ request }) => {
    const list = await request.get('/api/areas')
    const body = await list.json()
    const id = (body.data as Array<{ id: string }>)[0]?.id
    expect(id).toBeTruthy()

    const resp = await request.get(`/api/areas/${id}`)
    expect(resp.ok()).toBeTruthy()
    const area = await resp.json()
    expect(area.id).toBe(id)
  })

  test('PUT /api/areas/:id atualiza área', async ({ request }) => {
    const list = await request.get('/api/areas')
    const body = await list.json()
    const id = (body.data as Array<{ id: string }>)[0]?.id
    expect(id).toBeTruthy()

    const resp = await request.put(`/api/areas/${id}`, {
      data: { title: 'Resgate e Acolhimento Editado' },
    })
    expect(resp.ok()).toBeTruthy()
    const updated = await resp.json()
    expect(updated.title).toBe('Resgate e Acolhimento Editado')
  })

  test('DELETE /api/areas/:id remove área', async ({ request }) => {
    const create = await request.post('/api/areas', {
      data: { title: 'Área para Deletar', slug: 'area-deletar' },
    })
    const area = await create.json()
    expect(area.id).toBeTruthy()

    const del = await request.delete(`/api/areas/${area.id}`)
    expect(del.ok()).toBeTruthy()

    const get = await request.get(`/api/areas/${area.id}`)
    expect(get.status()).toBe(404)
  })

  test('valida slug obrigatório no POST', async ({ request }) => {
    const resp = await request.post('/api/areas', {
      data: { title: 'Sem Slug' },
    })
    expect(resp.ok()).toBeFalsy()
    expect(resp.status()).toBe(400)
  })
})
