import { NextRequest, NextResponse } from 'next/server'
import { StatService } from '@/services/stat.service'
import { protectedApiHandler, validationError } from '@/lib/api-handler'
import { reorderStatSchema } from '@/schemas/stat.schema'

export async function PATCH(req: NextRequest) {
  return protectedApiHandler(async () => {
    const body = await req.json()
    const parsed = reorderStatSchema.safeParse(body)
    if (!parsed.success) return validationError(parsed.error)
    const result = await StatService.reorder(parsed.data.items)
    return NextResponse.json({ data: result })
  })
}
