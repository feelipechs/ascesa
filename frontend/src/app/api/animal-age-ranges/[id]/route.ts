import { NextRequest, NextResponse } from 'next/server'
import { getAnimalAgeRangeById, updateAnimalAgeRange, deleteAnimalAgeRange } from '@/services/animal-age-range.service'
import { apiHandler, protectedApiHandler, validationError } from '@/lib/api-handler'
import { updateAnimalAgeRangeSchema } from '@/schemas/animal-age-range.schema'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  return apiHandler(async () => {
    const { id } = await params
    const range = await getAnimalAgeRangeById(id)
    if (!range) return NextResponse.json({ error: 'Faixa etária não encontrada' }, { status: 404 })
    return NextResponse.json(range)
  })
}

export async function PUT(req: NextRequest, { params }: Params) {
  return protectedApiHandler(async () => {
    const { id } = await params
    const body = await req.json()
    const parsed = updateAnimalAgeRangeSchema.safeParse(body)
    if (!parsed.success) return validationError(parsed.error)
    const range = await updateAnimalAgeRange(id, parsed.data)
    return NextResponse.json(range)
  })
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  return protectedApiHandler(async () => {
    const { id } = await params
    await deleteAnimalAgeRange(id)
    return new NextResponse(null, { status: 204 })
  })
}
