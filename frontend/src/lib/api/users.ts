import type { UserListItem } from '@/types'

export const UsersApi = {
  async findAll(): Promise<UserListItem[]> {
    const res = await fetch('/api/users')
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Falha ao carregar usuários')
    }
    const json = await res.json()
    return json.data
  },

  async findById(id: string): Promise<UserListItem> {
    const res = await fetch(`/api/users/${id}`)
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Falha ao carregar usuário')
    }
    return res.json()
  },

  async create(data: unknown): Promise<UserListItem> {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Falha ao criar usuário')
    }
    return res.json()
  },

  async update(id: string, data: unknown): Promise<UserListItem> {
    const res = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Falha ao atualizar usuário')
    }
    return res.json()
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`/api/users/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Falha ao remover usuário')
    }
  },

  async updatePassword(id: string, data: { currentPassword: string; newPassword: string }): Promise<void> {
    const res = await fetch(`/api/users/${id}/password`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Falha ao alterar senha')
    }
  },
}
