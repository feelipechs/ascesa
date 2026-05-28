import { NextRequest, NextResponse } from 'next/server'
import { getAnimalSpecies, createAnimalSpecies } from '@/services/animal-species.service'
import { apiHandler, protectedApiHandler, validationError } from '@/lib/api-handler'
import { createAnimalSpeciesSchema } from '@/schemas/animal-species.schema'

export async function GET() {
  return apiHandler(async () => {
    const species = await getAnimalSpecies()
    return NextResponse.json({ data: species })
  })
}

export async function POST(req: NextRequest) {
  return protectedApiHandler(async () => {
    const body = await req.json()
    const parsed = createAnimalSpeciesSchema.safeParse(body)
    if (!parsed.success) return validationError(parsed.error)
    const species = await createAnimalSpecies(parsed.data)
    return NextResponse.json(species, { status: 201 })
  })
}
