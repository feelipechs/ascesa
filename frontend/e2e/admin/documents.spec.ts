import { test, expect } from '@playwright/test'

test.describe('Admin Documentos', () => {
  test('GET /api/documents retorna lista', async ({ request }) => {
    const resp = await request.get('/api/documents')
    expect(resp.ok()).toBeTruthy()
    const body = await resp.json()
    expect(body.data).toBeInstanceOf(Array)
  })

  test('contém documento do seed', async ({ request }) => {
    const resp = await request.get('/api/documents')
    const body = await resp.json()
    const docs = body.data as Array<{ title: string }>
    expect(docs.some((d) => d.title === 'Estatuto Social')).toBeTruthy()
  })

  test('POST /api/documents cria novo documento', async ({ request }) => {
    const catsResp = await request.get('/api/document-categories')
    const catsBody = await catsResp.json()
    const catId = (catsBody.data as Array<{ id: string }>)[0]?.id
    expect(catId).toBeTruthy()

    const resp = await request.post('/api/documents', {
      data: {
        title: 'Relatório Anual 2025',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        year: 2025,
        categoryId: catId,
      },
    })
    expect(resp.ok()).toBeTruthy()
    const doc = await resp.json()
    expect(doc.title).toBe('Relatório Anual 2025')
    expect(doc.id).toBeTruthy()
  })

  test('GET /api/documents/:id retorna documento específico', async ({ request }) => {
    const list = await request.get('/api/documents')
    const body = await list.json()
    const docs = body.data as Array<{ id: string }>
    const id = docs[0]?.id
    expect(id).toBeTruthy()

    const resp = await request.get(`/api/documents/${id}`)
    expect(resp.ok()).toBeTruthy()
    const doc = await resp.json()
    expect(doc.id).toBe(id)
  })

  test('PUT /api/documents/:id atualiza documento', async ({ request }) => {
    const list = await request.get('/api/documents')
    const body = await list.json()
    const docs = body.data as Array<{ id: string }>
    const id = docs[0]?.id
    expect(id).toBeTruthy()

    const resp = await request.put(`/api/documents/${id}`, {
      data: { title: 'Estatuto Social Editado' },
    })
    expect(resp.ok()).toBeTruthy()
    const updated = await resp.json()
    expect(updated.title).toBe('Estatuto Social Editado')
  })

  test('DELETE /api/documents/:id remove documento', async ({ request }) => {
    const catsResp = await request.get('/api/document-categories')
    const catsBody = await catsResp.json()
    const catId = (catsBody.data as Array<{ id: string }>)[0]?.id

    const create = await request.post('/api/documents', {
      data: {
        title: 'Documento para Deletar',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        categoryId: catId,
      },
    })
    const doc = await create.json()
    expect(doc.id).toBeTruthy()

    const del = await request.delete(`/api/documents/${doc.id}`)
    expect(del.ok()).toBeTruthy()

    const get = await request.get(`/api/documents/${doc.id}`)
    expect(get.status()).toBe(404)
  })

  test('valida categoryId obrigatório no POST', async ({ request }) => {
    const resp = await request.post('/api/documents', {
      data: {
        title: 'Sem Categoria',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      },
    })
    expect(resp.ok()).toBeFalsy()
    expect(resp.status()).toBe(400)
  })
})
