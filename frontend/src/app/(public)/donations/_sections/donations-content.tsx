'use client'

import { Syringe, Bone, ClipboardList, FileText, Key, HelpCircle, Dog } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PageSection } from '@/components/page-section'
import { SectionHeading } from '@/components/section-heading'
import { DonationsPaymentMethods } from './donations-payment-methods'
import { FiscalNoteDialog } from './fiscal-note-dialog'
import { routes } from '@/lib/routes'

const neededItems = [
  { icon: Bone, label: 'Ração seca e úmida' },
  { icon: Syringe, label: 'Medicamentos veterinários' },
  { icon: ClipboardList, label: 'Cobertores e toalhas' },
  { icon: Dog, label: 'Produtos de higiene' },
]

export function DonationsContent({ isAuthenticated }: { isAuthenticated?: boolean }) {
  const [fiscalModalOpen, setFiscalModalOpen] = useState(false)

  return (
    <PageSection>
      <DonationsPaymentMethods isAuthenticated={isAuthenticated} />

      <div className="space-y-8 mb-8 md:mb-12 lg:mb-16">
        <Card className="border-accent/20">
          <CardContent className="pt-6">
            <div className="grid gap-6 md:grid-cols-5">
              <div className="md:col-span-3">
                <SectionHeading
                  title="Itens que precisamos"
                  description="Além de doações em dinheiro, aceitamos doações de materiais. Entre em contato para combinar a entrega."
                />
                <div className="grid grid-cols-2 gap-3">
                  {neededItems.map((item) => (
                    <div key={item.label} className="flex items-center gap-3 bg-muted/50 rounded-lg p-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-sm font-medium leading-tight">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="md:col-span-2 flex flex-col justify-center gap-4 bg-muted/30 rounded-xl p-6 border">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 shrink-0">
                    <HelpCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Dúvidas?</h3>
                    <p className="text-sm text-muted-foreground">
                      Entre em contato para mais informações
                    </p>
                  </div>
                </div>
        <Button asChild>
          <Link href={routes.contact}>Fale Conosco</Link>
        </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <SectionHeading
                  title="Nota Fiscal Paulista"
                  description="Ajude a Ascesa destinando suas notas fiscais! Você pode contribuir de duas formas:"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 mb-6">
              <div className="bg-muted/50 rounded-lg p-4 border">
                <div className="flex items-center gap-2 mb-2">
                  <Key className="h-4 w-4 text-primary" />
                  <span className="font-medium text-sm">Chave de Acesso</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Informe apenas a chave de 44 dígitos da nota
                </p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 border">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="font-medium text-sm">Nota Detalhada</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Informe CNPJ, valor, COO e data de emissão
                </p>
              </div>
            </div>

            <Button onClick={() => setFiscalModalOpen(true)}>
              <FileText className="h-4 w-4 mr-2" /> Enviar Nota Fiscal
            </Button>
          </CardContent>
        </Card>
      </div>

      <FiscalNoteDialog open={fiscalModalOpen} onOpenChange={setFiscalModalOpen} />
    </PageSection>
  )
}
