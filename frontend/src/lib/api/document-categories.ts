import type { DocumentCategory, DocumentCategoryWithCount } from '@/types'

export const DocumentCategoriesApi = {
  async findAll(): Promise<DocumentCategoryWithCount[]> {
    const res = await fetch('/api/document-categories')
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Falha ao carregar categorias')
    }
    const json = await res.json()
    return json.data
  },

  async findById(id: string): Promise<DocumentCategory> {
    const res = await fetch(`/api/document-categories/${id}`)
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Falha ao carregar categoria')
    }
    return res.json()
  },

  async create(data: unknown): Promise<DocumentCategory> {
    const res = await fetch('/api/document-categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Falha ao criar categoria')
    }
    return res.json()
  },

  async update(id: string, data: unknown): Promise<DocumentCategory> {
    const res = await fetch(`/api/document-categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Falha ao atualizar categoria')
    }
    return res.json()
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`/api/document-categories/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Falha ao remover categoria')
    }
  },
}
