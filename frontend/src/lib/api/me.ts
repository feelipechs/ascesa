import type { UpdateMeInput } from '@/schemas/me.schema'

export const MeApi = {
  async getProfile() {
    const res = await fetch('/api/me')
    if (!res.ok) throw new Error('Falha ao carregar perfil')
    return res.json()
  },

  async update(data: UpdateMeInput) {
    const res = await fetch('/api/me', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error?.message || 'Erro ao salvar perfil')
    }
    return res.json()
  },
}
