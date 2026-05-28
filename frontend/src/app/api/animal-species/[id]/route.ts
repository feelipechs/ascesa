import { NextRequest, NextResponse } from 'next/server'
import { getAnimalSpeciesById, updateAnimalSpecies, deleteAnimalSpecies } from '@/services/animal-species.service'
import { apiHandler, protectedApiHandler, validationError } from '@/lib/api-handler'
import { updateAnimalSpeciesSchema } from '@/schemas/animal-species.schema'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  return apiHandler(async () => {
    const { id } = await params
    const species = await getAnimalSpeciesById(id)
    if (!species) return NextResponse.json({ error: 'Espécie não encontrada' }, { status: 404 })
    return NextResponse.json(species)
  })
}

export async function PUT(req: NextRequest, { params }: Params) {
  return protectedApiHandler(async () => {
    const { id } = await params
    const body = await req.json()
    const parsed = updateAnimalSpeciesSchema.safeParse(body)
    if (!parsed.success) return validationError(parsed.error)
    const species = await updateAnimalSpecies(id, parsed.data)
    return NextResponse.json(species)
  })
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  return protectedApiHandler(async () => {
    const { id } = await params
    await deleteAnimalSpecies(id)
    return new NextResponse(null, { status: 204 })
  })
}
