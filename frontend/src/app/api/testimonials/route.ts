import { NextRequest, NextResponse } from 'next/server'
import { getTestimonials, createTestimonial } from '@/services/testimonial.service'
import { apiHandler, protectedApiHandler, validationError } from '@/lib/api-handler'
import { createTestimonialSchema } from '@/schemas/testimonial.schema'

export async function GET(req: NextRequest) {
  return apiHandler(async () => {
    const { searchParams } = new URL(req.url)
    const projectId = searchParams.get('projectId') ?? ''

    const testimonials = await getTestimonials({ projectId })
    return NextResponse.json({ data: testimonials })
  })
}

export async function POST(req: NextRequest) {
  return protectedApiHandler(async () => {
    const body = await req.json()
    const parsed = createTestimonialSchema.safeParse(body)
    if (!parsed.success) {
      return validationError(parsed.error)
    }
    const testimonial = await createTestimonial(parsed.data)
    return NextResponse.json(testimonial, { status: 201 })
  })
}
