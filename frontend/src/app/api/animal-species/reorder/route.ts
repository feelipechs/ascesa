import { NextRequest, NextResponse } from 'next/server'
import { reorderAnimalSpecies } from '@/services/animal-species.service'
import { protectedApiHandler, validationError } from '@/lib/api-handler'
import { reorderAnimalSpeciesSchema } from '@/schemas/animal-species.schema'

export async function PATCH(req: NextRequest) {
  return protectedApiHandler(async () => {
    const body = await req.json()
    const parsed = reorderAnimalSpeciesSchema.safeParse(body)
    if (!parsed.success) return validationError(parsed.error)
    const result = await reorderAnimalSpecies(parsed.data.items)
    return NextResponse.json({ data: result })
  })
}
