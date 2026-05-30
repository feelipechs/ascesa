import { NextRequest, NextResponse } from 'next/server'
import { reorderGalleryImages } from '@/services/gallery-image.service'
import { protectedApiHandler, validationError } from '@/lib/api-handler'
import { reorderGalleryImageSchema } from '@/schemas/gallery-image.schema'

export async function PATCH(req: NextRequest) {
  return protectedApiHandler(async () => {
    const body = await req.json()
    const parsed = reorderGalleryImageSchema.safeParse(body)
    if (!parsed.success) return validationError(parsed.error)
    const result = await reorderGalleryImages(parsed.data.items)
    return NextResponse.json({ data: result })
  })
}
