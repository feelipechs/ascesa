import { NextRequest, NextResponse } from 'next/server'
import { getTestimonialById, updateTestimonial, deleteTestimonial } from '@/services/testimonial.service'
import { apiHandler, protectedApiHandler, validationError } from '@/lib/api-handler'
import { updateTestimonialSchema } from '@/schemas/testimonial.schema'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  return apiHandler(async () => {
    const { id } = await params
    const testimonial = await getTestimonialById(id)
    if (!testimonial) return NextResponse.json({ error: 'Depoimento não encontrado' }, { status: 404 })
    return NextResponse.json(testimonial)
  })
}

export async function PUT(req: NextRequest, { params }: Params) {
  return protectedApiHandler(async () => {
    const { id } = await params
    const body = await req.json()
    const parsed = updateTestimonialSchema.safeParse(body)
    if (!parsed.success) {
      return validationError(parsed.error)
    }
    const { publishedAt, ...rest } = parsed.data
    const testimonial = await updateTestimonial(id, {
      ...rest,
      publishedAt: publishedAt ? new Date(publishedAt) : null,
    })
    return NextResponse.json(testimonial)
  })
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  return protectedApiHandler(async () => {
    const { id } = await params
    await deleteTestimonial(id)
    return new NextResponse(null, { status: 204 })
  })
}
