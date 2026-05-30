import { NextRequest, NextResponse } from 'next/server'
import { PaymentMethodService } from '@/services/payment-method.service'
import { protectedApiHandler, validationError } from '@/lib/api-handler'
import { reorderPaymentMethodSchema } from '@/schemas/payment-method.schema'

export async function PATCH(req: NextRequest) {
  return protectedApiHandler(async () => {
    const body = await req.json()
    const parsed = reorderPaymentMethodSchema.safeParse(body)
    if (!parsed.success) return validationError(parsed.error)
    const result = await PaymentMethodService.reorder(parsed.data.items)
    return NextResponse.json({ data: result })
  })
}
