import {
  FacebookIcon,
  InstagramIcon,
  YoutubeIcon,
  WhatsAppIcon,
  LinkedInIcon,
} from '@/components/icons/social'

type SocialLinksProps = {
  facebook?: string | null
  instagram?: string | null
  youtube?: string | null
  whatsapp?: string | null
  linkedin?: string | null
}

export function SocialLinks({ facebook, instagram, youtube, whatsapp, linkedin }: SocialLinksProps) {
  const links = [
    facebook && { href: facebook, label: 'Facebook', Icon: FacebookIcon },
    instagram && { href: instagram, label: 'Instagram', Icon: InstagramIcon },
    youtube && { href: youtube, label: 'YouTube', Icon: YoutubeIcon },
    whatsapp && { href: `https://wa.me/${whatsapp}`, label: 'WhatsApp', Icon: WhatsAppIcon },
    linkedin && { href: linkedin, label: 'LinkedIn', Icon: LinkedInIcon },
  ].filter(Boolean) as { href: string; label: string; Icon: typeof FacebookIcon }[]

  if (links.length === 0) return null

  return (
    <nav className="flex gap-4" aria-label="Redes sociais">
      {links.map(({ href, label, Icon }) => (
        <a
          key={label}
          href={href}
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
          aria-label={label}
        >
          <Icon size={20} />
        </a>
      ))}
    </nav>
  )
}
