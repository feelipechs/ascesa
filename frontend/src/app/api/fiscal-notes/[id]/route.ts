import { NextRequest, NextResponse } from 'next/server'
import { FiscalNoteService } from '@/services/fiscal-note.service'
import { protectedApiHandler } from '@/lib/api-handler'

type Params = { params: Promise<{ id: string }> }

export async function DELETE(_req: NextRequest, { params }: Params) {
  return protectedApiHandler(async () => {
    const { id } = await params
    await FiscalNoteService.delete(id)
    return new NextResponse(null, { status: 204 })
  })
}
