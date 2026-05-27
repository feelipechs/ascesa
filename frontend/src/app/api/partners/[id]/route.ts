import { NextRequest, NextResponse } from 'next/server'
import { getPartnerById, updatePartner, deletePartner } from '@/services/partner.service'
import { apiHandler, protectedApiHandler, validationError } from '@/lib/api-handler'
import { updatePartnerSchema } from '@/schemas/partner.schema'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  return apiHandler(async () => {
    const { id } = await params
    const partner = await getPartnerById(id)
    if (!partner) return NextResponse.json({ error: 'Parceiro não encontrado' }, { status: 404 })
    return NextResponse.json(partner)
  })
}

export async function PUT(req: NextRequest, { params }: Params) {
  return protectedApiHandler(async () => {
    const { id } = await params
    const body = await req.json()
    const parsed = updatePartnerSchema.safeParse(body)
    if (!parsed.success) {
      return validationError(parsed.error)
    }
    const { publishedAt, ...rest } = parsed.data
    const partner = await updatePartner(id, {
      ...rest,
      publishedAt: publishedAt === null ? null : publishedAt ? new Date(publishedAt) : undefined,
    })
    return NextResponse.json(partner)
  })
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  return protectedApiHandler(async () => {
    const { id } = await params
    await deletePartner(id)
    return new NextResponse(null, { status: 204 })
  })
}
