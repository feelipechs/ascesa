export const FiscalNotesApi = {
  async findAll() {
    const res = await fetch('/api/fiscal-notes')
    if (!res.ok) throw new Error('Falha ao carregar notas fiscais')
    return res.json()
  },

  async create(data: unknown) {
    const res = await fetch('/api/fiscal-notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Falha ao enviar nota fiscal')
    return res.json()
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`/api/fiscal-notes/${id}`, {
      method: 'DELETE',
    })
    if (!res.ok) throw new Error('Falha ao remover nota fiscal')
  },
}
