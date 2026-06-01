import { test, expect } from '@playwright/test'

test.describe('Admin Galeria', () => {
  test('GET /api/gallery-images retorna lista', async ({ request }) => {
    const resp = await request.get('/api/gallery-images')
    expect(resp.ok()).toBeTruthy()
    const body = await resp.json()
    expect(body.data).toBeInstanceOf(Array)
  })

  test('contém imagens do seed', async ({ request }) => {
    const resp = await request.get('/api/gallery-images')
    const body = await resp.json()
    const images = body.data as Array<{ caption: string }>
    expect(images.length).toBeGreaterThanOrEqual(3)
    expect(images.some((i) => i.caption === 'Resgate em ação')).toBeTruthy()
  })

  test('POST /api/gallery-images cria imagem HOME', async ({ request }) => {
    const resp = await request.post('/api/gallery-images', {
      data: {
        url: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=1200',
        caption: 'Imagem de teste E2E',
        context: 'HOME',
      },
    })
    expect(resp.ok()).toBeTruthy()
    const image = await resp.json()
    expect(image.caption).toBe('Imagem de teste E2E')
    expect(image.context).toBe('HOME')
    expect(image.id).toBeTruthy()
  })

  test('GET /api/gallery-images/:id retorna imagem específica', async ({ request }) => {
    const list = await request.get('/api/gallery-images')
    const body = await list.json()
    const id = (body.data as Array<{ id: string }>)[0]?.id
    expect(id).toBeTruthy()

    const resp = await request.get(`/api/gallery-images/${id}`)
    expect(resp.ok()).toBeTruthy()
    const image = await resp.json()
    expect(image.id).toBe(id)
  })

  test('PUT /api/gallery-images/:id atualiza imagem', async ({ request }) => {
    const list = await request.get('/api/gallery-images')
    const body = await list.json()
    const id = (body.data as Array<{ id: string }>)[0]?.id
    expect(id).toBeTruthy()

    const resp = await request.put(`/api/gallery-images/${id}`, {
      data: { caption: 'Legenda editada E2E' },
    })
    expect(resp.ok()).toBeTruthy()
    const updated = await resp.json()
    expect(updated.caption).toBe('Legenda editada E2E')
  })

  test('DELETE /api/gallery-images/:id remove imagem', async ({ request }) => {
    const create = await request.post('/api/gallery-images', {
      data: {
        url: 'https://placehold.co/800x600',
        caption: 'Imagem para Deletar',
        context: 'HOME',
      },
    })
    const image = await create.json()
    expect(image.id).toBeTruthy()

    const del = await request.delete(`/api/gallery-images/${image.id}`)
    expect(del.ok()).toBeTruthy()

    const get = await request.get(`/api/gallery-images/${image.id}`)
    expect(get.status()).toBe(404)
  })

  test('valida url obrigatório no POST', async ({ request }) => {
    const resp = await request.post('/api/gallery-images', {
      data: { caption: 'Sem URL' },
    })
    expect(resp.ok()).toBeFalsy()
    expect(resp.status()).toBe(400)
  })
})
