import type { Post, PostFilters } from '@/types'

export const PostsApi = {
  async findAll(filters?: PostFilters): Promise<Post[]> {
    const params = new URLSearchParams()
    if (filters?.search) params.set('search', filters.search)
    const query = params.toString()
    const res = await fetch(`/api/posts${query ? `?${query}` : ''}`)
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Falha ao carregar posts')
    }
    return res.json()
  },

  async findById(id: string): Promise<Post> {
    const res = await fetch(`/api/posts/${id}`)
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Falha ao carregar post')
    }
    return res.json()
  },

  async create(data: unknown): Promise<Post> {
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Falha ao criar post')
    }
    return res.json()
  },

  async update(id: string, data: unknown): Promise<Post> {
    const res = await fetch(`/api/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Falha ao atualizar post')
    }
    return res.json()
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Falha ao remover post')
    }
  },
}
