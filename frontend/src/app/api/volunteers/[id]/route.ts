import { NextRequest, NextResponse } from 'next/server'
import { VolunteerService } from '@/services/volunteer.service'
import { protectedApiHandler, validationError } from '@/lib/api-handler'
import { updateVolunteerSchema } from '@/schemas/volunteer.schema'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  return protectedApiHandler(async () => {
    const { id } = await params
    const volunteer = await VolunteerService.findById(id)
    if (!volunteer) return NextResponse.json({ error: 'Voluntário não encontrado' }, { status: 404 })
    return NextResponse.json(volunteer)
  })
}

export async function PUT(req: NextRequest, { params }: Params) {
  return protectedApiHandler(async () => {
    const { id } = await params
    const body = await req.json()
    const parsed = updateVolunteerSchema.safeParse(body)
    if (!parsed.success) return validationError(parsed.error)
    const volunteer = await VolunteerService.update(id, parsed.data)
    return NextResponse.json(volunteer)
  })
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  return protectedApiHandler(async () => {
    const { id } = await params
    await VolunteerService.delete(id)
    return new NextResponse(null, { status: 204 })
  })
}
