'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { updateSiteSettingsSchema } from '@/schemas/site-settings.schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useSettings, useUpdateSettings } from '@/hooks/settings/queries'

export function SiteSettingsForm() {
  const { data: settings, isLoading } = useSettings()
  const { mutate: update, isPending } = useUpdateSettings()

  const [isEditing, setIsEditing] = useState(false)

  const form = useForm({
    resolver: zodResolver(updateSiteSettingsSchema),
    defaultValues: {
      email: '',
      phone: '',
      address: '',
      cnpj: '',
      homeTitle: '',
      homeSubtitle: '',
      about: '',
      mission: '',
      vision: '',
      values: '',
      socialInstagram: '',
      socialFacebook: '',
      socialYoutube: '',
      socialWhatsapp: '',
      socialLinkedin: '',
    },
  })

  useEffect(() => {
    if (!settings) return
    form.reset({
      email: settings.email ?? '',
      phone: settings.phone ?? '',
      address: settings.address ?? '',
      cnpj: settings.cnpj ?? '',
      homeTitle: settings.homeTitle ?? '',
      homeSubtitle: settings.homeSubtitle ?? '',
      about: settings.about ?? '',
      mission: settings.mission ?? '',
      vision: settings.vision ?? '',
      values: settings.values ?? '',
      socialInstagram: settings.socialInstagram ?? '',
      socialFacebook: settings.socialFacebook ?? '',
      socialYoutube: settings.socialYoutube ?? '',
      socialWhatsapp: settings.socialWhatsapp ?? '',
      socialLinkedin: settings.socialLinkedin ?? '',
    })
  }, [settings, form])

  function resetForm() {
    if (!settings) return
    form.reset({
      email: settings.email ?? '',
      phone: settings.phone ?? '',
      address: settings.address ?? '',
      cnpj: settings.cnpj ?? '',
      homeTitle: settings.homeTitle ?? '',
      homeSubtitle: settings.homeSubtitle ?? '',
      about: settings.about ?? '',
      mission: settings.mission ?? '',
      vision: settings.vision ?? '',
      values: settings.values ?? '',
      socialInstagram: settings.socialInstagram ?? '',
      socialFacebook: settings.socialFacebook ?? '',
      socialYoutube: settings.socialYoutube ?? '',
      socialWhatsapp: settings.socialWhatsapp ?? '',
      socialLinkedin: settings.socialLinkedin ?? '',
    })
  }

  function handleSubmit(data: Record<string, string>) {
    update(data, { onSuccess: () => setIsEditing(false) })
  }

  if (isLoading) return <p className="text-muted-foreground">Carregando...</p>

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Informações Gerais</CardTitle>
          <CardDescription>Dados de contato e identificação da ONG.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field label="Email" disabled={!isEditing} {...form.register('email')} />
          <Field label="Telefone" disabled={!isEditing} {...form.register('phone')} />
          <Field label="Endereço" disabled={!isEditing} {...form.register('address')} />
          <Field label="CNPJ" disabled={!isEditing} {...form.register('cnpj')} />
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Conteúdo da Home</CardTitle>
          <CardDescription>Título e subtítulo da página inicial.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field label="Título" disabled={!isEditing} {...form.register('homeTitle')} />
          <Field label="Subtítulo" disabled={!isEditing} {...form.register('homeSubtitle')} />
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Sobre a ONG</CardTitle>
          <CardDescription>Missão, visão, valores e história da organização.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <TextareaField label="Sobre (história)" disabled={!isEditing} {...form.register('about')} />
          <Field label="Missão" disabled={!isEditing} {...form.register('mission')} />
          <Field label="Visão" disabled={!isEditing} {...form.register('vision')} />
          <TextareaField label="Valores (separados por vírgula)" disabled={!isEditing} {...form.register('values')} />
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Redes Sociais</CardTitle>
          <CardDescription>Links para as redes sociais (deixe vazio para ocultar).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field label="Instagram" disabled={!isEditing} {...form.register('socialInstagram')} />
          <Field label="Facebook" disabled={!isEditing} {...form.register('socialFacebook')} />
          <Field label="YouTube" disabled={!isEditing} {...form.register('socialYoutube')} />
          <Field label="WhatsApp" disabled={!isEditing} {...form.register('socialWhatsapp')} />
          <Field label="LinkedIn" disabled={!isEditing} {...form.register('socialLinkedin')} />
        </CardContent>
      </Card>

      <div className="flex gap-2">
        {!isEditing ? (
          <Button type="button" onClick={() => setIsEditing(true)}>
            Editar
          </Button>
        ) : (
          <>
            <Button type="button" variant="outline" onClick={() => { setIsEditing(false); resetForm() }}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Salvando...' : 'Salvar alterações'}
            </Button>
          </>
        )}
      </div>
    </form>
  )
}

function Field({ label, disabled, ...inputProps }: { label: string; disabled?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <Input disabled={disabled} {...inputProps} />
    </div>
  )
}

function TextareaField({ label, disabled, ...textareaProps }: { label: string; disabled?: boolean } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <Textarea disabled={disabled} rows={4} {...textareaProps} />
    </div>
  )
}
