'use client'

import { Copy, Check, Heart, Dog, PawPrint, Syringe, Bone, ClipboardList } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PageSection } from '@/components/page-section'
import { EmptyState } from '@/components/empty-state'
import { usePaymentMethods } from '@/hooks/payment-methods/queries'
import { Skeleton } from '@/components/ui/skeleton'

const typeIcons: Record<string, typeof Heart> = {
  PIX: Copy,
  BANK_TRANSFER: Heart,
  CASH: Dog,
}

const typeLabels: Record<string, string> = {
  PIX: 'PIX',
  BANK_TRANSFER: 'Transferência Bancária',
  CASH: 'Doação em Dinheiro',
}

export function DonationsContent() {
  const { data: methodsData, isLoading } = usePaymentMethods(true)
  const methods = methodsData?.data ?? []
  const [copiedId, setCopiedId] = useState<string | null>(null)

  function handleCopy(key: string) {
    navigator.clipboard.writeText(key)
    setCopiedId(key)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const neededItems = [
    { icon: Bone, label: 'Ração seca e úmida' },
    { icon: Syringe, label: 'Medicamentos veterinários' },
    { icon: ClipboardList, label: 'Cobertores e toalhas' },
    { icon: Dog, label: 'Produtos de higiene' },
  ]

  return (
    <PageSection>
      {isLoading ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-12 w-12 rounded-lg mb-3" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
          {methods.map(
            (method: {
              id: string
              type: string
              label: string
              instructions: string | null
              pixConfig: { key: string } | null
              bankConfig: {
                bankName: string
                agency: string
                account: string
                accountType: string | null
              } | null
            }) => {
              const Icon = typeIcons[method.type] ?? Heart
              return (
                <Card key={method.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-3">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{method.label}</CardTitle>
                    <CardDescription>{typeLabels[method.type] ?? method.type}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-between gap-4">
                    {method.instructions && (
                      <p className="text-sm text-muted-foreground">{method.instructions}</p>
                    )}

                    {method.type === 'PIX' && method.pixConfig && (
                      <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                        <p className="text-xs text-muted-foreground">Chave PIX</p>
                        <p className="font-mono text-sm break-all">{method.pixConfig.key}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => handleCopy(method.pixConfig!.key)}
                        >
                          {copiedId === method.pixConfig.key ? (
                            <>
                              <Check className="h-4 w-4 mr-2" /> Copiado!
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4 mr-2" /> Copiar chave
                            </>
                          )}
                        </Button>
                      </div>
                    )}

                    {method.type === 'BANK_TRANSFER' && method.bankConfig && (
                      <div className="bg-muted/50 rounded-lg p-3 space-y-1 text-sm">
                        <p>
                          <span className="text-muted-foreground">Banco:</span>{' '}
                          {method.bankConfig.bankName}
                        </p>
                        <p>
                          <span className="text-muted-foreground">Agência:</span>{' '}
                          {method.bankConfig.agency}
                        </p>
                        <p>
                          <span className="text-muted-foreground">Conta:</span>{' '}
                          {method.bankConfig.account}
                        </p>
                        {method.bankConfig.accountType && (
                          <p>
                            <span className="text-muted-foreground">Tipo:</span>{' '}
                            {method.bankConfig.accountType}
                          </p>
                        )}
                      </div>
                    )}

                    {method.type === 'CASH' && (
                      <Button variant="outline" className="w-full" asChild>
                        <a href="/contato">Fale Conosco</a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )
            }
          )}
        </div>
      )}

      {!isLoading && methods.length === 0 && (
        <EmptyState title="Nenhuma forma de doação disponível no momento." />
      )}

      <Card className="bg-accent/10 border-accent/20">
        <CardContent className="pt-6">
          <div className="grid gap-8 md:grid-cols-2 items-center">
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-4">Itens que precisamos</h2>
              <p className="text-muted-foreground mb-6">
                Além de doações em dinheiro, aceitamos doações de materiais. Entre em contato para
                combinar a entrega.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {neededItems.map((item) => (
                  <div key={item.label} className="flex items-center gap-2 text-sm">
                    <item.icon className="h-4 w-4 text-primary shrink-0" />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-4 bg-background rounded-xl p-6 border">
              <h3 className="font-semibold text-lg">Dúvidas?</h3>
              <p className="text-sm text-muted-foreground">
                Entre em contato conosco para mais informações sobre como ajudar.
              </p>
              <Button asChild>
                <a href="/contato">Fale Conosco</a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageSection>
  )
}
