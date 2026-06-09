'use client'

import { Copy, Check, Heart, QrCode } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AdminActions } from '@/components/admin/admin-actions'
import { routes } from '@/lib/routes'

const typeIcons: Record<string, typeof Heart> = {
  PIX: Copy,
  BANK_TRANSFER: Heart,
  CASH: Heart,
}

const typeLabels: Record<string, string> = {
  PIX: 'PIX',
  BANK_TRANSFER: 'Transferência Bancária',
  CASH: 'Doação em Dinheiro',
}

type MethodItem = {
  id: string
  type: string
  label: string
  instructions: string | null
  pixConfig: { key: string; receiverName: string; receiverCity: string } | null
  bankConfig: { bankName: string; agency: string; account: string; accountType: string | null } | null
}

type PaymentMethodCardProps = {
  method: MethodItem
  isAuthenticated?: boolean
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onShowQrCode: (key: string) => void
}

export function PaymentMethodCard({ method, isAuthenticated, onEdit, onDelete, onShowQrCode }: PaymentMethodCardProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  function handleCopy(key: string) {
    navigator.clipboard.writeText(key)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const Icon = typeIcons[method.type] ?? Heart

  return (
    <Card className="flex flex-col relative">
      {isAuthenticated && (
        <div className="absolute top-3 right-3 z-10">
          <AdminActions
            onEdit={() => onEdit(method.id)}
            onDelete={() => onDelete(method.id)}
          />
        </div>
      )}
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
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => handleCopy(method.pixConfig!.key)}
              >
                {copiedKey === method.pixConfig.key ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar chave
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onShowQrCode(method.pixConfig!.key)}
              >
                <QrCode className="h-4 w-4 mr-2" />
                QR Code
              </Button>
            </div>
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
            <a href={routes.contact}>Fale Conosco</a>
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

export type { MethodItem }
