import { NextRequest, NextResponse } from 'next/server'
import { getGalleryImageById, updateGalleryImage, deleteGalleryImage } from '@/services/gallery-image.service'
import { apiHandler, protectedApiHandler, validationError } from '@/lib/api-handler'
import { updateGalleryImageSchema } from '@/schemas/gallery-image.schema'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  return apiHandler(async () => {
    const { id } = await params
    const image = await getGalleryImageById(id)
    if (!image) return NextResponse.json({ error: 'Imagem não encontrada' }, { status: 404 })
    return NextResponse.json(image)
  })
}

export async function PUT(req: NextRequest, { params }: Params) {
  return protectedApiHandler(async () => {
    const { id } = await params
    const body = await req.json()
    const parsed = updateGalleryImageSchema.safeParse(body)
    if (!parsed.success) {
      return validationError(parsed.error)
    }
    const image = await updateGalleryImage(id, parsed.data)
    return NextResponse.json(image)
  })
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  return protectedApiHandler(async () => {
    const { id } = await params
    await deleteGalleryImage(id)
    return new NextResponse(null, { status: 204 })
  })
}
