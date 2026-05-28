import { NextRequest, NextResponse } from 'next/server'
import { AnimalService } from '@/services/animal.service'
import { apiHandler, protectedApiHandler, validationError } from '@/lib/api-handler'
import { createAnimalSchema } from '@/schemas/animal.schema'
import { AnimalGender, AnimalStatus } from '@/generated/prisma/enums'

export async function GET(req: NextRequest) {
  return apiHandler(async () => {
    const { searchParams } = new URL(req.url)
    const filters = {
      speciesId: searchParams.get('speciesId') ?? undefined,
      sizeId: searchParams.get('sizeId') ?? undefined,
      ageRangeId: searchParams.get('ageRangeId') ?? undefined,
      gender: (searchParams.get('gender') as AnimalGender) ?? undefined,
      status: (searchParams.get('status') as AnimalStatus) ?? undefined,
      search: searchParams.get('search') ?? undefined,
      featured: searchParams.get('featured') === 'true' ? true : undefined,
      page: searchParams.get('page') ? Number(searchParams.get('page')) : undefined,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : undefined,
    }
    const result = await AnimalService.findAll(filters)
    return NextResponse.json(result)
  })
}

export async function POST(req: NextRequest) {
  return protectedApiHandler(async () => {
    const body = await req.json()
    const parsed = createAnimalSchema.safeParse(body)
    if (!parsed.success) return validationError(parsed.error)
    const { publishedAt, birthDate, speciesId, ...rest } = parsed.data
    const animal = await AnimalService.create({
      ...rest,
      species: { connect: { id: speciesId } },
      ...(publishedAt ? { publishedAt: new Date(publishedAt) } : {}),
      ...(birthDate ? { birthDate: new Date(birthDate) } : {}),
    })
    return NextResponse.json(animal, { status: 201 })
  })
}
