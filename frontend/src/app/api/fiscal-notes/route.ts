import { NextRequest, NextResponse } from 'next/server'
import { FiscalNoteService } from '@/services/fiscal-note.service'
import { apiHandler, protectedApiHandler, validationError } from '@/lib/api-handler'
import { createFiscalNoteSchema } from '@/schemas/fiscal-note.schema'

export async function GET() {
  return protectedApiHandler(async () => {
    const notes = await FiscalNoteService.findAll()
    return NextResponse.json({ data: notes })
  })
}

export async function POST(req: NextRequest) {
  return apiHandler(async () => {
    const body = await req.json()
    const parsed = createFiscalNoteSchema.safeParse(body)
    if (!parsed.success) return validationError(parsed.error)
    const note = await FiscalNoteService.create(parsed.data)
    return NextResponse.json(note, { status: 201 })
  })
}
