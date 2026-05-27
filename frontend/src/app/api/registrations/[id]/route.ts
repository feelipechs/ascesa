import { NextRequest, NextResponse } from 'next/server'
import { RegistrationService } from '@/services/registration.service'
import { protectedApiHandler, validationError } from '@/lib/api-handler'
import { updateRegistrationSchema } from '@/schemas/registration.schema'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  return protectedApiHandler(async () => {
    const { id } = await params
    const registration = await RegistrationService.findById(id)
    if (!registration) return NextResponse.json({ error: 'Inscrição não encontrada' }, { status: 404 })
    return NextResponse.json(registration)
  })
}

export async function PUT(req: NextRequest, { params }: Params) {
  return protectedApiHandler(async () => {
    const { id } = await params
    const body = await req.json()
    const parsed = updateRegistrationSchema.safeParse(body)
    if (!parsed.success) return validationError(parsed.error)
    const registration = await RegistrationService.updateStatus(id, parsed.data)
    return NextResponse.json(registration)
  })
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  return protectedApiHandler(async () => {
    const { id } = await params
    await RegistrationService.delete(id)
    return new NextResponse(null, { status: 204 })
  })
}
