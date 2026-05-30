import { NextResponse } from 'next/server'
import { apiHandler } from '@/lib/api-handler'
import { getAnimalSpecies } from '@/services/animal-species.service'
import { getAnimalSizes } from '@/services/animal-size.service'
import { getAnimalAgeRanges } from '@/services/animal-age-range.service'

export async function GET() {
  return apiHandler(async () => {
    const [species, sizes, ageRanges] = await Promise.all([
      getAnimalSpecies(),
      getAnimalSizes(),
      getAnimalAgeRanges(),
    ])

    return NextResponse.json({ data: { species, sizes, ageRanges } })
  })
}
