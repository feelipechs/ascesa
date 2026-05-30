import type { Testimonial } from '@/types'

export const TestimonialsApi = {
  async findAll(): Promise<Testimonial[]> {
    const res = await fetch('/api/testimonials')
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Falha ao carregar depoimentos')
    }
    const json = await res.json()
    return json.data
  },

  async findById(id: string): Promise<Testimonial> {
    const res = await fetch(`/api/testimonials/${id}`)
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Falha ao carregar depoimento')
    }
    return res.json()
  },

  async create(data: unknown): Promise<Testimonial> {
    const res = await fetch('/api/testimonials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Falha ao criar depoimento')
    }
    return res.json()
  },

  async update(id: string, data: unknown): Promise<Testimonial> {
    const res = await fetch(`/api/testimonials/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Falha ao atualizar depoimento')
    }
    return res.json()
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`/api/testimonials/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Falha ao remover depoimento')
    }
  },
}
