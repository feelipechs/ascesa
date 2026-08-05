import { NextRequest, NextResponse } from 'next/server'
import { FiscalNoteService } from '@/services/fiscal-note.service'
import { apiHandler, protectedApiHandler, validationError } from '@/lib/api-handler'
import { createFiscalNoteSchema } from '@/schemas/fiscal-note.schema'
import { paginationSchema } from '@/schemas/pagination.schema'

export async function GET(req: NextRequest) {
  return protectedApiHandler(async () => {
    const { searchParams } = new URL(req.url)
    const query = Object.fromEntries(searchParams.entries())
    const parsed = paginationSchema.safeParse(query)
    if (!parsed.success) return validationError(parsed.error)
    const result = await FiscalNoteService.findAll(parsed.data)
    return NextResponse.json(result)
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
