import type { ProjectListItem, ProjectWithArea, ProjectFilters, PaginatedResponse } from '@/types'

export const ProjectsApi = {
  async findAll(filters?: ProjectFilters): Promise<PaginatedResponse<ProjectWithArea>> {
    const params = new URLSearchParams()
    if (filters?.search) params.set('search', filters.search)
    if (filters?.areas?.length) params.set('areas', filters.areas.join(','))
    if (filters?.context) params.set('context', filters.context)
    if (filters?.featured !== undefined) params.set('featured', String(filters.featured))
    if (filters?.page) params.set('page', String(filters.page))
    if (filters?.limit) params.set('limit', String(filters.limit))

    const res = await fetch(`/api/projects${params.toString() ? `?${params.toString()}` : ''}`)
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Falha ao carregar lista de projetos')
    }
    return res.json()
  },

  async findById(id: string): Promise<ProjectWithArea> {
    const res = await fetch(`/api/projects/${id}`)
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Falha ao carregar detalhes do projeto')
    }
    return res.json()
  },

  async create(data: unknown): Promise<ProjectWithArea> {
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Falha ao criar projeto')
    }
    return res.json()
  },

  async update(id: string, data: unknown): Promise<ProjectWithArea> {
    const res = await fetch(`/api/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Falha ao atualizar projeto')
    }
    return res.json()
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Falha ao remover projeto')
    }
  },
}
