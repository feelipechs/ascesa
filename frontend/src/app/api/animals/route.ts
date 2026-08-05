import { NextRequest, NextResponse } from 'next/server'
import { AnimalService } from '@/services/animal.service'
import { apiHandler, protectedApiHandler, validationError } from '@/lib/api-handler'
import { createAnimalSchema } from '@/schemas/animal.schema'
import { animalFiltersSchema } from '@/schemas/animal.filters.schema'

export async function GET(req: NextRequest) {
  return apiHandler(async () => {
    const { searchParams } = new URL(req.url)
    const query = Object.fromEntries(searchParams.entries())
    const parsed = animalFiltersSchema.safeParse(query)
    if (!parsed.success) return validationError(parsed.error)
    const result = await AnimalService.findAll(parsed.data)
    return NextResponse.json(result)
  })
}

export async function POST(req: NextRequest) {
  return protectedApiHandler(async () => {
    const body = await req.json()
    const parsed = createAnimalSchema.safeParse(body)
    if (!parsed.success) return validationError(parsed.error)
    const { birthDate, coverMediaId, ...rest } = parsed.data
    const animal = await AnimalService.create({
      ...rest,
      ...(birthDate ? { birthDate: new Date(birthDate) } : {}),
      ...(coverMediaId ? { coverMedia: { connect: { id: coverMediaId } } } : {}),
    })
    return NextResponse.json(animal, { status: 201 })
  })
}
