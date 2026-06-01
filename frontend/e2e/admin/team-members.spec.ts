import { test, expect } from '@playwright/test'

test.describe('Admin Equipe', () => {
  test('GET /api/team-members retorna lista', async ({ request }) => {
    const resp = await request.get('/api/team-members')
    expect(resp.ok()).toBeTruthy()
    const body = await resp.json()
    expect(body.data).toBeInstanceOf(Array)
  })

  test('POST /api/team-members cria novo membro', async ({ request }) => {
    const resp = await request.post('/api/team-members', {
      data: {
        name: 'Maria Souza',
        role: 'Veterinária',
        bio: 'Médica veterinária voluntária.',
      },
    })
    expect(resp.ok()).toBeTruthy()
    const member = await resp.json()
    expect(member.name).toBe('Maria Souza')
    expect(member.role).toBe('Veterinária')
    expect(member.id).toBeTruthy()
  })

  test('cria membro com áreas vinculadas', async ({ request }) => {
    const areasResp = await request.get('/api/areas')
    const areasBody = await areasResp.json()
    const areaId = (areasBody.data as Array<{ id: string }>)[0]?.id
    expect(areaId).toBeTruthy()

    const resp = await request.post('/api/team-members', {
      data: {
        name: 'Carlos Lima',
        role: 'Coordenador',
        areaIds: [areaId],
      },
    })
    expect(resp.ok()).toBeTruthy()
    const member = await resp.json()
    expect(member.name).toBe('Carlos Lima')
  })

  test('GET /api/team-members/:id retorna membro específico', async ({ request }) => {
    const list = await request.get('/api/team-members')
    const body = await list.json()
    const id = (body.data as Array<{ id: string }>)[0]?.id
    expect(id).toBeTruthy()

    const resp = await request.get(`/api/team-members/${id}`)
    expect(resp.ok()).toBeTruthy()
    const member = await resp.json()
    expect(member.id).toBe(id)
  })

  test('PUT /api/team-members/:id atualiza membro', async ({ request }) => {
    const list = await request.get('/api/team-members')
    const body = await list.json()
    const id = (body.data as Array<{ id: string }>)[0]?.id
    expect(id).toBeTruthy()

    const resp = await request.put(`/api/team-members/${id}`, {
      data: { name: 'Maria Souza Editada' },
    })
    expect(resp.ok()).toBeTruthy()
    const updated = await resp.json()
    expect(updated.name).toBe('Maria Souza Editada')
  })

  test('DELETE /api/team-members/:id remove membro', async ({ request }) => {
    const create = await request.post('/api/team-members', {
      data: { name: 'Membro para Deletar', role: 'Teste' },
    })
    const member = await create.json()
    expect(member.id).toBeTruthy()

    const del = await request.delete(`/api/team-members/${member.id}`)
    expect(del.ok()).toBeTruthy()

    const get = await request.get(`/api/team-members/${member.id}`)
    expect(get.status()).toBe(404)
  })

  test('valida role obrigatório no POST', async ({ request }) => {
    const resp = await request.post('/api/team-members', {
      data: { name: 'Sem Cargo' },
    })
    expect(resp.ok()).toBeFalsy()
    expect(resp.status()).toBe(400)
  })
})
