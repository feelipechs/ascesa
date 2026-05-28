import { NextRequest, NextResponse } from 'next/server'
import { FiscalNoteService } from '@/services/fiscal-note.service'
import { protectedApiHandler, validationError } from '@/lib/api-handler'
import { updateFiscalNoteSchema } from '@/schemas/fiscal-note.schema'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  return protectedApiHandler(async () => {
    const { id } = await params
    const note = await FiscalNoteService.findById(id)
    if (!note) return NextResponse.json({ error: 'Nota fiscal não encontrada' }, { status: 404 })
    return NextResponse.json(note)
  })
}

export async function PUT(req: NextRequest, { params }: Params) {
  return protectedApiHandler(async () => {
    const { id } = await params
    const body = await req.json()
    const parsed = updateFiscalNoteSchema.safeParse(body)
    if (!parsed.success) return validationError(parsed.error)
    const data: Record<string, unknown> = { ...parsed.data }
    if (data.emissionDate !== undefined) data.emissionDate = data.emissionDate ? new Date(data.emissionDate as string) : null
    if (data.amount !== undefined) data.amount = Number(data.amount)
    const note = await FiscalNoteService.update(id, data)
    return NextResponse.json(note)
  })
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  return protectedApiHandler(async () => {
    const { id } = await params
    await FiscalNoteService.delete(id)
    return new NextResponse(null, { status: 204 })
  })
}
