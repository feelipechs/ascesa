import { NextRequest, NextResponse } from 'next/server'
import { AnimalService } from '@/services/animal.service'
import { apiHandler, protectedApiHandler, validationError } from '@/lib/api-handler'
import { createAnimalSchema } from '@/schemas/animal.schema'

export async function GET(req: NextRequest) {
  return apiHandler(async () => {
    const { searchParams } = new URL(req.url)
    const filters = {
      species: searchParams.get('species') ?? undefined,
      size: searchParams.get('size') ?? undefined,
      ageRange: searchParams.get('ageRange') ?? undefined,
      gender: searchParams.get('gender') ?? undefined,
      status: searchParams.get('status') ?? undefined,
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
    const { birthDate, coverMediaId, ...rest } = parsed.data
    const animal = await AnimalService.create({
      ...rest,
      ...(birthDate ? { birthDate: new Date(birthDate) } : {}),
      ...(coverMediaId ? { coverMedia: { connect: { id: coverMediaId } } } : {}),
    })
    return NextResponse.json(animal, { status: 201 })
  })
}
