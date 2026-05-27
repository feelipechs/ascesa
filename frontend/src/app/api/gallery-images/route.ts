import { NextRequest, NextResponse } from 'next/server'
import { getGalleryImages, createGalleryImage } from '@/services/gallery-image.service'
import { apiHandler, protectedApiHandler, validationError } from '@/lib/api-handler'
import { createGalleryImageSchema } from '@/schemas/gallery-image.schema'

export async function GET(req: NextRequest) {
  return apiHandler(async () => {
    const { searchParams } = new URL(req.url)
    const context = searchParams.get('context') ?? undefined
    const projectId = searchParams.get('projectId') ?? undefined

    const images = await getGalleryImages({ context, projectId })
    return NextResponse.json({ data: images })
  })
}

export async function POST(req: NextRequest) {
  return protectedApiHandler(async () => {
    const body = await req.json()
    const parsed = createGalleryImageSchema.safeParse(body)
    if (!parsed.success) {
      return validationError(parsed.error)
    }
    const image = await createGalleryImage(parsed.data)
    return NextResponse.json(image, { status: 201 })
  })
}
