import { NextRequest, NextResponse } from 'next/server'
import { PaymentMethodService } from '@/services/payment-method.service'
import { apiHandler, protectedApiHandler, validationError } from '@/lib/api-handler'
import { updatePaymentMethodSchema } from '@/schemas/payment-method.schema'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  return apiHandler(async () => {
    const { id } = await params
    const method = await PaymentMethodService.findById(id)
    if (!method) return NextResponse.json({ error: 'Método de pagamento não encontrado' }, { status: 404 })
    return NextResponse.json(method)
  })
}

export async function PUT(req: NextRequest, { params }: Params) {
  return protectedApiHandler(async () => {
    const { id } = await params
    const body = await req.json()
    const parsed = updatePaymentMethodSchema.safeParse(body)
    if (!parsed.success) return validationError(parsed.error)
    const method = await PaymentMethodService.update(id, parsed.data as never)
    return NextResponse.json(method)
  })
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  return protectedApiHandler(async () => {
    const { id } = await params
    await PaymentMethodService.delete(id)
    return new NextResponse(null, { status: 204 })
  })
}
