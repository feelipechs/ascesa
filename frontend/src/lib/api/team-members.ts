import type { TeamMember, TeamMemberWithAreas } from '@/types'

export const TeamMembersApi = {
  async findAll(): Promise<TeamMemberWithAreas[]> {
    const res = await fetch('/api/team-members')
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Falha ao carregar membros')
    }
    const json = await res.json()
    return json.data
  },

  async findById(id: string): Promise<TeamMemberWithAreas> {
    const res = await fetch(`/api/team-members/${id}`)
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Falha ao carregar membro')
    }
    return res.json()
  },

  async create(data: unknown): Promise<TeamMemberWithAreas> {
    const res = await fetch('/api/team-members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Falha ao criar membro')
    }
    return res.json()
  },

  async update(id: string, data: unknown): Promise<TeamMemberWithAreas> {
    const res = await fetch(`/api/team-members/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Falha ao atualizar membro')
    }
    return res.json()
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`/api/team-members/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Falha ao remover membro')
    }
  },
}
