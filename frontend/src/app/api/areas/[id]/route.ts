import { NextRequest, NextResponse } from 'next/server'
import { getAreaById, updateArea, deleteArea } from '@/services/area.service'
import { apiHandler, protectedApiHandler, validationError } from '@/lib/api-handler'
import { updateAreaSchema } from '@/schemas/area.schema'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  return apiHandler(async () => {
    const { id } = await params
    const area = await getAreaById(id)
    if (!area) return NextResponse.json({ error: 'Área não encontrada' }, { status: 404 })
    return NextResponse.json(area)
  })
}

export async function PUT(req: NextRequest, { params }: Params) {
  return protectedApiHandler(async () => {
    const { id } = await params
    const body = await req.json()
    const parsed = updateAreaSchema.safeParse(body)
    if (!parsed.success) {
      return validationError(parsed.error)
    }
    const area = await updateArea(id, parsed.data)
    return NextResponse.json(area)
  })
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  return protectedApiHandler(async () => {
    const { id } = await params
    await deleteArea(id)
    return new NextResponse(null, { status: 204 })
  })
}
