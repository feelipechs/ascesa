import { NextRequest, NextResponse } from 'next/server'
import { PaymentMethodService } from '@/services/payment-method.service'
import { apiHandler, protectedApiHandler, validationError } from '@/lib/api-handler'
import { createPaymentMethodSchema } from '@/schemas/payment-method.schema'

export async function GET() {
  return apiHandler(async () => {
    const methods = await PaymentMethodService.findAll()
    return NextResponse.json({ data: methods })
  })
}

export async function POST(req: NextRequest) {
  return protectedApiHandler(async () => {
    const body = await req.json()
    const parsed = createPaymentMethodSchema.safeParse(body)
    if (!parsed.success) return validationError(parsed.error)
    const method = await PaymentMethodService.create(parsed.data)
    return NextResponse.json(method, { status: 201 })
  })
}
