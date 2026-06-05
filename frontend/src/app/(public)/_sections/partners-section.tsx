'use client'
import Image from 'next/image'
import { AdminActions } from '@/components/admin/admin-actions'
import type { Partner } from '@/types'

type PartnersProps = {
  partners: Partner[]
  isAuthenticated?: boolean
  onEdit?: (partner: Partner) => void
  onDelete?: (partner: Partner) => void
}

export function Partners({ partners, isAuthenticated, onEdit, onDelete }: PartnersProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 animate-in fade-in-0 duration-500">
      {partners.map((partner) => (
        <div
          key={partner.id}
          className="group relative flex h-24 items-center justify-center rounded-xl border border-border/50 bg-card px-4 py-4 transition-all duration-300 hover:border-primary/30 hover:shadow-md"
        >
          {isAuthenticated && onEdit && onDelete && (
            <div className="absolute -top-2 -right-2 z-10">
              <AdminActions onEdit={() => onEdit(partner)} onDelete={() => onDelete(partner)} />
            </div>
          )}
        <Image
          src={partner.logoMedia?.url ?? ''}
            alt={partner.name}
            width={120}
            height={48}
            unoptimized
            className="h-12 w-auto object-contain transition-all duration-300 group-hover:scale-105 dark:brightness-200"
          />
        </div>
      ))}
    </div>
  )
}
