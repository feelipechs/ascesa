export const PaymentMethodsApi = {
  async findAll(activeOnly?: boolean) {
    const query = activeOnly ? '?active=true' : ''
    const res = await fetch(`/api/payment-methods${query}`)
    if (!res.ok) throw new Error('Falha ao carregar métodos de pagamento')
    return res.json()
  },

  async findById(id: string) {
    const res = await fetch(`/api/payment-methods/${id}`)
    if (!res.ok) throw new Error('Falha ao carregar método de pagamento')
    return res.json()
  },

  async create(data: unknown) {
    const res = await fetch('/api/payment-methods', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Falha ao criar método de pagamento')
    return res.json()
  },

  async update(id: string, data: unknown) {
    const res = await fetch(`/api/payment-methods/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Falha ao atualizar método de pagamento')
    return res.json()
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`/api/payment-methods/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Falha ao remover método de pagamento')
  },

  async reorder(items: { id: string; displayOrder: number }[]): Promise<void> {
    const res = await fetch('/api/payment-methods/reorder', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    })
    if (!res.ok) throw new Error('Falha ao reordenar métodos de pagamento')
  },
}
