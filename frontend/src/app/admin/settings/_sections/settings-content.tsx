'use client'

import { SiteSettingsForm } from '@/components/admin/forms/site-settings-form'

export function SettingsContent() {
  return (
    <div className="px-4 lg:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Configurações do Site</h1>
        <p className="text-muted-foreground">Gerencie as informações exibidas em todo o site.</p>
      </div>
      <SiteSettingsForm />
    </div>
  )
}
