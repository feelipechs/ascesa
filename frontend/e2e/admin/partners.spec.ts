import { test, expect } from '@playwright/test'

test.describe('Admin Parceiros', () => {
  test('GET /api/partners retorna lista', async ({ request }) => {
    const resp = await request.get('/api/partners')
    expect(resp.ok()).toBeTruthy()
    const body = await resp.json()
    expect(body.data).toBeInstanceOf(Array)
  })

  test('contém parceiro do seed', async ({ request }) => {
    const resp = await request.get('/api/partners')
    const body = await resp.json()
    const partners = body.data as Array<{ name: string }>
    expect(partners.some((p) => p.name.includes('Clínica'))).toBeTruthy()
  })

  test('POST /api/partners cria novo parceiro', async ({ request }) => {
    const resp = await request.post('/api/partners', {
      data: {
        name: 'PetShop Amigo Bicho',
        logoUrl: 'https://placehold.co/200x80?text=PetShop',
        websiteUrl: 'https://petshop.example.com',
      },
    })
    expect(resp.ok()).toBeTruthy()
    const partner = await resp.json()
    expect(partner.name).toBe('PetShop Amigo Bicho')
    expect(partner.id).toBeTruthy()
  })

  test('GET /api/partners/:id retorna parceiro específico', async ({ request }) => {
    const list = await request.get('/api/partners')
    const body = await list.json()
    const id = (body.data as Array<{ id: string }>)[0]?.id
    expect(id).toBeTruthy()

    const resp = await request.get(`/api/partners/${id}`)
    expect(resp.ok()).toBeTruthy()
    const partner = await resp.json()
    expect(partner.id).toBe(id)
  })

  test('PUT /api/partners/:id atualiza parceiro', async ({ request }) => {
    const list = await request.get('/api/partners')
    const body = await list.json()
    const id = (body.data as Array<{ id: string }>)[0]?.id
    expect(id).toBeTruthy()

    const resp = await request.put(`/api/partners/${id}`, {
      data: { name: 'Clínica Patinhas Editada' },
    })
    expect(resp.ok()).toBeTruthy()
    const updated = await resp.json()
    expect(updated.name).toBe('Clínica Patinhas Editada')
  })

  test('DELETE /api/partners/:id remove parceiro', async ({ request }) => {
    const create = await request.post('/api/partners', {
      data: {
        name: 'Parceiro para Deletar',
        logoUrl: 'https://placehold.co/200x80?text=Delete',
      },
    })
    const partner = await create.json()
    expect(partner.id).toBeTruthy()

    const del = await request.delete(`/api/partners/${partner.id}`)
    expect(del.ok()).toBeTruthy()

    const get = await request.get(`/api/partners/${partner.id}`)
    expect(get.status()).toBe(404)
  })

  test('valida logoUrl obrigatório no POST', async ({ request }) => {
    const resp = await request.post('/api/partners', {
      data: { name: 'Sem Logo' },
    })
    expect(resp.ok()).toBeFalsy()
    expect(resp.status()).toBe(400)
  })
})
