import type { GalleryImage, GalleryImageFilters } from '@/types'

export const GalleryImagesApi = {
  async findAll(filters?: GalleryImageFilters): Promise<GalleryImage[]> {
    const params = new URLSearchParams()
    if (filters?.context) params.set('context', filters.context)
    if (filters?.projectId) params.set('projectId', filters.projectId)
    const query = params.toString()
    const res = await fetch(`/api/gallery-images${query ? `?${query}` : ''}`)
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Falha ao carregar imagens')
    }
    const json = await res.json()
    return json.data
  },

  async findById(id: string): Promise<GalleryImage> {
    const res = await fetch(`/api/gallery-images/${id}`)
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Falha ao carregar imagem')
    }
    return res.json()
  },

  async create(data: unknown): Promise<GalleryImage> {
    const res = await fetch('/api/gallery-images', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Falha ao criar imagem')
    }
    return res.json()
  },

  async update(id: string, data: unknown): Promise<GalleryImage> {
    const res = await fetch(`/api/gallery-images/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Falha ao atualizar imagem')
    }
    return res.json()
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`/api/gallery-images/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Falha ao remover imagem')
    }
  },
}
