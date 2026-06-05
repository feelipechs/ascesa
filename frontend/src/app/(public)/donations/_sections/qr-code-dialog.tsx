'use client'

import { QRCode } from 'react-qr-code'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

type QrCodeDialogProps = {
  qrcodeKey: string | null
  onOpenChange: (open: boolean) => void
}

export function QrCodeDialog({ qrcodeKey, onOpenChange }: QrCodeDialogProps) {
  return (
    <Dialog open={!!qrcodeKey} onOpenChange={(open) => !open && onOpenChange(false)}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>QR Code PIX</DialogTitle>
        </DialogHeader>
        <figure className="flex justify-center p-4">
          {qrcodeKey && <QRCode value={qrcodeKey} size={256} />}
        </figure>
        <p className="text-sm text-muted-foreground text-center">
          Abra o app do seu banco, escaneie o código e faça a doação.
        </p>
      </DialogContent>
    </Dialog>
  )
}
