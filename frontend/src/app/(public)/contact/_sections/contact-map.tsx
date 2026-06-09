import { prisma } from '@/lib/prisma'
import { PageSection } from '@/components/page-section'
import { SectionHeading } from '@/components/section-heading'

export async function ContactMap() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 'main' } })
  const mapUrl = (settings as Record<string, string | null> | null)?.googleMapsEmbedUrl

  return (
    <PageSection borderTop padding="compact">
      <SectionHeading
        title="Nossa Localização"
        description="Venha nos visitar ou encontre a melhor rota até nosso endereço."
      />
      <div className="overflow-hidden rounded-lg border border-border">
        <iframe
          src={mapUrl}
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Localização no Google Maps"
          className="w-full"
        ></iframe>
      </div>
    </PageSection>
  )
}
