import { test, expect } from '@playwright/test'

test.describe('Admin Depoimentos', () => {
  test('GET /api/testimonials retorna lista', async ({ request }) => {
    const resp = await request.get('/api/testimonials')
    expect(resp.ok()).toBeTruthy()
    const body = await resp.json()
    expect(body.data).toBeInstanceOf(Array)
  })

  test('contém depoimento do seed', async ({ request }) => {
    const resp = await request.get('/api/testimonials')
    const body = await resp.json()
    const testimonials = body.data as Array<{ name: string }>
    expect(testimonials.some((t) => t.name === 'Carla Mendes')).toBeTruthy()
  })

  test('POST /api/testimonials cria novo depoimento', async ({ request }) => {
    const resp = await request.post('/api/testimonials', {
      data: {
        name: 'João Silva',
        role: 'Adotante',
        message: 'Adotei minha gata pela Ascesa e foi incrível!',
      },
    })
    expect(resp.ok()).toBeTruthy()
    const testimonial = await resp.json()
    expect(testimonial.name).toBe('João Silva')
    expect(testimonial.message).toContain('incrível')
    expect(testimonial.id).toBeTruthy()
  })

  test('GET /api/testimonials/:id retorna depoimento específico', async ({ request }) => {
    const list = await request.get('/api/testimonials')
    const body = await list.json()
    const id = (body.data as Array<{ id: string }>)[0]?.id
    expect(id).toBeTruthy()

    const resp = await request.get(`/api/testimonials/${id}`)
    expect(resp.ok()).toBeTruthy()
    const testimonial = await resp.json()
    expect(testimonial.id).toBe(id)
  })

  test('PUT /api/testimonials/:id atualiza depoimento', async ({ request }) => {
    const list = await request.get('/api/testimonials')
    const body = await list.json()
    const id = (body.data as Array<{ id: string }>)[0]?.id
    expect(id).toBeTruthy()

    const resp = await request.put(`/api/testimonials/${id}`, {
      data: { message: 'Mensagem editada para teste.' },
    })
    expect(resp.ok()).toBeTruthy()
    const updated = await resp.json()
    expect(updated.message).toBe('Mensagem editada para teste.')
  })

  test('DELETE /api/testimonials/:id remove depoimento', async ({ request }) => {
    const create = await request.post('/api/testimonials', {
      data: {
        name: 'Depoimento para Deletar',
        message: 'Será removido.',
      },
    })
    const testimonial = await create.json()
    expect(testimonial.id).toBeTruthy()

    const del = await request.delete(`/api/testimonials/${testimonial.id}`)
    expect(del.ok()).toBeTruthy()

    const get = await request.get(`/api/testimonials/${testimonial.id}`)
    expect(get.status()).toBe(404)
  })

  test('valida message obrigatório no POST', async ({ request }) => {
    const resp = await request.post('/api/testimonials', {
      data: { name: 'Sem Mensagem' },
    })
    expect(resp.ok()).toBeFalsy()
    expect(resp.status()).toBe(400)
  })
})
