import { NextRequest, NextResponse } from 'next/server'
import { getAnimalSizeById, updateAnimalSize, deleteAnimalSize } from '@/services/animal-size.service'
import { apiHandler, protectedApiHandler, validationError } from '@/lib/api-handler'
import { updateAnimalSizeSchema } from '@/schemas/animal-size.schema'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  return apiHandler(async () => {
    const { id } = await params
    const size = await getAnimalSizeById(id)
    if (!size) return NextResponse.json({ error: 'Porte não encontrado' }, { status: 404 })
    return NextResponse.json(size)
  })
}

export async function PUT(req: NextRequest, { params }: Params) {
  return protectedApiHandler(async () => {
    const { id } = await params
    const body = await req.json()
    const parsed = updateAnimalSizeSchema.safeParse(body)
    if (!parsed.success) return validationError(parsed.error)
    const size = await updateAnimalSize(id, parsed.data)
    return NextResponse.json(size)
  })
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  return protectedApiHandler(async () => {
    const { id } = await params
    await deleteAnimalSize(id)
    return new NextResponse(null, { status: 204 })
  })
}
