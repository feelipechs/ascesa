'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useSettings } from '@/hooks/settings/queries'
import { SectionHeading } from '@/components/section-heading'
import { ContactForm } from './contact-form'
import { ContactInfo } from './contact-info'
import { SocialLinks } from './social-links'

export function ContactContent() {
  const { data: settings } = useSettings()

  return (
    <div className="grid gap-12 lg:grid-cols-2">
      <div className="space-y-8">
        <SectionHeading
          title="Informações de Contato"
          description="Escolha a melhor forma de entrar em contato conosco."
        />
        <ContactInfo email={settings?.email} phone={settings?.phone} address={settings?.address} />
        <div className="pt-6 border-t border-border">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">
            Siga-nos nas redes sociais
          </h3>
          <SocialLinks
            facebook={settings?.socialFacebook}
            instagram={settings?.socialInstagram}
            youtube={settings?.socialYoutube}
            whatsapp={settings?.socialWhatsapp}
            linkedin={settings?.socialLinkedin}
          />
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Envie uma mensagem</CardTitle>
          <CardDescription>
            Preencha o formulário e entraremos em contato o mais breve possível.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ContactForm />
        </CardContent>
      </Card>
    </div>
  )
}
