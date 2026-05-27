import type { SiteSettings } from '@/types'

export const SettingsApi = {
  async find(): Promise<SiteSettings> {
    const res = await fetch('/api/settings')
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Falha ao carregar configurações')
    }
    return res.json()
  },

  async update(data: unknown): Promise<SiteSettings> {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Falha ao atualizar configurações')
    }
    return res.json()
  },
}
