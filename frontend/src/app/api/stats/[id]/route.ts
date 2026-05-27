import { NextRequest, NextResponse } from 'next/server'
import { StatService } from '@/services/stat.service'
import { apiHandler, protectedApiHandler, validationError } from '@/lib/api-handler'
import { updateStatSchema } from '@/schemas/stat.schema'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  return apiHandler(async () => {
    const { id } = await params
    const stat = await StatService.findById(id)
    if (!stat) return NextResponse.json({ error: 'Métrica não encontrada' }, { status: 404 })
    return NextResponse.json(stat)
  })
}

export async function PUT(req: NextRequest, { params }: Params) {
  return protectedApiHandler(async () => {
    const { id } = await params
    const body = await req.json()
    const parsed = updateStatSchema.safeParse(body)
    if (!parsed.success) return validationError(parsed.error)
    const stat = await StatService.update(id, parsed.data)
    return NextResponse.json(stat)
  })
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  return protectedApiHandler(async () => {
    const { id } = await params
    await StatService.delete(id)
    return new NextResponse(null, { status: 204 })
  })
}
