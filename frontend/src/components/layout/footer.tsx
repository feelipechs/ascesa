import { format } from 'date-fns'
import { MapPinIcon, MailIcon, PhoneIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import {
  FacebookIcon,
  InstagramIcon,
  YoutubeIcon,
  WhatsAppIcon,
  LinkedInIcon,
} from '@/components/icons/social'

const institucionalLinks = [
  { label: 'Sobre nós', href: '/sobre' },
  { label: 'Projetos', href: '/projetos' },
  { label: 'Áreas de atuação', href: '/areas' },
  { label: 'Transparência', href: '/transparencia' },
  { label: 'Doações', href: '/doacoes' },
]

export async function Footer() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 'main' } })
  const areas = await prisma.area.findMany({
    select: { title: true, slug: true },
    orderBy: { title: 'asc' },
  })

  const socialLinks = [
    settings?.socialFacebook && { href: settings.socialFacebook, icon: FacebookIcon },
    settings?.socialInstagram && { href: settings.socialInstagram, icon: InstagramIcon },
    settings?.socialYoutube && { href: settings.socialYoutube, icon: YoutubeIcon },
    settings?.socialWhatsapp && {
      href: `https://wa.me/${settings.socialWhatsapp}`,
      icon: WhatsAppIcon,
    },
    settings?.socialLinkedin && { href: settings.socialLinkedin, icon: LinkedInIcon },
  ].filter(Boolean) as { href: string; icon: typeof FacebookIcon }[]

  return (
    <footer className="bg-background border-t">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo e descrição */}
          <div className="flex flex-col gap-4">
            <Link href="/">
              <Image src="/logo.png" alt="Ascesa" width={120} height={40} />
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Amor e cuidado por cada animal. Resgate, castração solidária, adoção responsável e
              apoio veterinário.
            </p>
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-4">
                {socialLinks.map(({ href, icon: Icon }) => (
                  <a
                    key={href}
                    href={href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Icon className="size-5" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Links institucionais */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold">Institucional</h3>
            <div className="flex flex-col gap-2">
              {institucionalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Áreas de atuação */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold">Áreas de Atuação</h3>
            <div className="flex flex-col gap-2">
              {areas.map((area) => (
                <Link
                  key={area.slug}
                  href={`/areas/${area.slug}`}
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  {area.title}
                </Link>
              ))}
            </div>
          </div>

          {/* Contato */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold">Contato</h3>
            <div className="flex flex-col gap-3">
              {settings?.address && (
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPinIcon className="size-4 mt-0.5 shrink-0" />
                  <span>{settings.address}</span>
                </div>
              )}
              {settings?.email && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MailIcon className="size-4 shrink-0" />
                  <a
                    href={`mailto:${settings.email}`}
                    className="hover:text-foreground transition-colors"
                  >
                    {settings.email}
                  </a>
                </div>
              )}
              {settings?.phone && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <PhoneIcon className="size-4 shrink-0" />
                  <span>{settings.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 sm:flex-row sm:px-6">
        <p className="text-muted-foreground text-sm">
          © {format(new Date(), 'yyyy')} Ascesa. Todos os direitos reservados.
        </p>
        {settings?.cnpj && <p className="text-muted-foreground text-sm">CNPJ: {settings.cnpj}</p>}
      </div>
    </footer>
  )
}
