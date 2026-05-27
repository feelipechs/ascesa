import { Mail, Phone, MapPin } from 'lucide-react'

type ContactInfoProps = {
  email?: string | null
  phone?: string | null
  address?: string | null
}

export function ContactInfo({ email, phone, address }: ContactInfoProps) {
  const details = [
    email && { icon: Mail, label: 'Email', value: email, href: `mailto:${email}` },
    phone && { icon: Phone, label: 'Telefone', value: phone, href: `tel:${phone}` },
    address && { icon: MapPin, label: 'Endereço', value: address, href: null },
  ].filter(Boolean) as { icon: typeof Mail; label: string; value: string; href: string | null }[]

  return (
    <div className="space-y-6">
      {details.map((item) => (
        <div key={item.label} className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <item.icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
            {item.href ? (
              <a href={item.href} className="text-foreground hover:text-primary transition-colors">
                {item.value}
              </a>
            ) : (
              <p className="text-foreground">{item.value}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
