import { NextRequest, NextResponse } from 'next/server'
import { AnimalService } from '@/services/animal.service'
import { apiHandler, protectedApiHandler, validationError } from '@/lib/api-handler'
import { updateAnimalSchema } from '@/schemas/animal.schema'

type Params = { params: Promise<{ slug: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  return apiHandler(async () => {
    const { slug } = await params
    const animal = await AnimalService.findBySlug(slug)
    if (!animal) return NextResponse.json({ error: 'Animal não encontrado' }, { status: 404 })
    return NextResponse.json(animal)
  })
}

export async function PUT(req: NextRequest, { params }: Params) {
  return protectedApiHandler(async () => {
    const { slug } = await params
    const body = await req.json()
    const parsed = updateAnimalSchema.safeParse(body)
    if (!parsed.success) return validationError(parsed.error)
    const existing = await AnimalService.findBySlug(slug)
    if (!existing) return NextResponse.json({ error: 'Animal não encontrado' }, { status: 404 })
    const { publishedAt, birthDate, speciesId, ...rest } = parsed.data
    const data: Record<string, unknown> = { ...rest }
    if (speciesId !== undefined) data.species = { connect: { id: speciesId } }
    if (publishedAt !== undefined) data.publishedAt = publishedAt ? new Date(publishedAt) : null
    if (birthDate !== undefined) data.birthDate = birthDate ? new Date(birthDate) : null
    const animal = await AnimalService.update(existing.id, data)
    return NextResponse.json(animal)
  })
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  return protectedApiHandler(async () => {
    const { slug } = await params
    const existing = await AnimalService.findBySlug(slug)
    if (!existing) return NextResponse.json({ error: 'Animal não encontrado' }, { status: 404 })
    await AnimalService.delete(existing.id)
    return new NextResponse(null, { status: 204 })
  })
}
