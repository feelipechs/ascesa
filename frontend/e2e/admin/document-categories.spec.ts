import { test, expect } from '@playwright/test'

test.describe('Admin Categorias de Documentos', () => {
  test('GET /api/document-categories retorna lista', async ({ request }) => {
    const resp = await request.get('/api/document-categories')
    expect(resp.ok()).toBeTruthy()
    const body = await resp.json()
    expect(body.data).toBeInstanceOf(Array)
  })

  test('contém categoria do seed', async ({ request }) => {
    const resp = await request.get('/api/document-categories')
    const body = await resp.json()
    const cats = body.data as Array<{ name: string; slug: string }>
    expect(cats.some((c) => c.slug === 'institucionais')).toBeTruthy()
  })

  test('POST /api/document-categories cria nova categoria', async ({ request }) => {
    const resp = await request.post('/api/document-categories', {
      data: { name: 'Prestação de Contas', slug: 'prestacao-contas' },
    })
    expect(resp.ok()).toBeTruthy()
    const cat = await resp.json()
    expect(cat.name).toBe('Prestação de Contas')
    expect(cat.slug).toBe('prestacao-contas')
    expect(cat.id).toBeTruthy()
  })

  test('GET /api/document-categories/:id retorna categoria específica', async ({ request }) => {
    const list = await request.get('/api/document-categories')
    const body = await list.json()
    const id = (body.data as Array<{ id: string }>)[0]?.id
    expect(id).toBeTruthy()

    const resp = await request.get(`/api/document-categories/${id}`)
    expect(resp.ok()).toBeTruthy()
    const cat = await resp.json()
    expect(cat.id).toBe(id)
  })

  test('PUT /api/document-categories/:id atualiza categoria', async ({ request }) => {
    const list = await request.get('/api/document-categories')
    const body = await list.json()
    const id = (body.data as Array<{ id: string }>)[0]?.id
    expect(id).toBeTruthy()

    const resp = await request.put(`/api/document-categories/${id}`, {
      data: { name: 'Institucionais Editado' },
    })
    expect(resp.ok()).toBeTruthy()
    const updated = await resp.json()
    expect(updated.name).toBe('Institucionais Editado')
  })

  test('DELETE /api/document-categories/:id remove categoria', async ({ request }) => {
    const create = await request.post('/api/document-categories', {
      data: { name: 'Categoria para Deletar', slug: 'cat-deletar' },
    })
    const cat = await create.json()
    expect(cat.id).toBeTruthy()

    const del = await request.delete(`/api/document-categories/${cat.id}`)
    expect(del.ok()).toBeTruthy()

    const get = await request.get(`/api/document-categories/${cat.id}`)
    expect(get.status()).toBe(404)
  })

  test('valida slug obrigatório no POST', async ({ request }) => {
    const resp = await request.post('/api/document-categories', {
      data: { name: 'Sem Slug' },
    })
    expect(resp.ok()).toBeFalsy()
    expect(resp.status()).toBe(400)
  })
})
