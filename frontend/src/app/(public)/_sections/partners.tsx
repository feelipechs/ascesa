'use client'
import Image from 'next/image'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AdminActions } from '@/components/admin/admin-actions'
import type { Partner } from '@/types'

type PartnersProps = {
  partners: Partner[]
  isAuthenticated?: boolean
  onAdd?: () => void
  onEdit?: (partner: Partner) => void
  onDelete?: (partner: Partner) => void
}

export function Partners({ partners, isAuthenticated, onAdd, onEdit, onDelete }: PartnersProps) {
  return (
    <section className="border-t border-border py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 grid grid-cols-3 items-center">
          <div />
          <div className="space-y-3 text-center">
            <h2 className="text-2xl font-semibold md:text-3xl lg:text-4xl">Parceiros</h2>
            <p className="text-muted-foreground text-xl">Quem apoia a Ascesa.</p>
          </div>
          <div className="flex justify-end">
            {isAuthenticated && onAdd && (
              <Button size="sm" onClick={onAdd}>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar
              </Button>
            )}
          </div>
        </div>
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
                src={partner.logoUrl}
                alt={partner.name}
                width={120}
                height={48}
                unoptimized
                className="h-12 w-auto object-contain transition-all duration-300 group-hover:scale-105 dark:brightness-200"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
