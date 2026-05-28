import { NextRequest, NextResponse } from 'next/server'
import { PaymentMethodService } from '@/services/payment-method.service'
import { apiHandler, protectedApiHandler, validationError } from '@/lib/api-handler'
import { createPaymentMethodSchema } from '@/schemas/payment-method.schema'

export async function GET(req: NextRequest) {
  return apiHandler(async () => {
    const { searchParams } = new URL(req.url)
    const activeOnly = searchParams.get('active') === 'true'
    const methods = await PaymentMethodService.findAll(activeOnly)
    return NextResponse.json({ data: methods })
  })
}

export async function POST(req: NextRequest) {
  return protectedApiHandler(async () => {
    const body = await req.json()
    const parsed = createPaymentMethodSchema.safeParse(body)
    if (!parsed.success) return validationError(parsed.error)
    const method = await PaymentMethodService.create(parsed.data as never)
    return NextResponse.json(method, { status: 201 })
  })
}
