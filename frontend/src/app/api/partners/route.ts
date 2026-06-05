import { NextRequest, NextResponse } from 'next/server'
import { getPartners, createPartner } from '@/services/partner.service'
import { apiHandler, protectedApiHandler, validationError } from '@/lib/api-handler'
import { createPartnerSchema } from '@/schemas/partner.schema'

export async function GET() {
  return apiHandler(async () => {
    const partners = await getPartners()
    return NextResponse.json({ data: partners })
  })
}

export async function POST(req: NextRequest) {
  return protectedApiHandler(async () => {
    const body = await req.json()
    const parsed = createPartnerSchema.safeParse(body)
    if (!parsed.success) {
      return validationError(parsed.error)
    }
    const partner = await createPartner(parsed.data)
    return NextResponse.json(partner, { status: 201 })
  })
}
