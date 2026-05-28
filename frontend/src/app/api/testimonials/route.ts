import { NextRequest, NextResponse } from 'next/server'
import { getTestimonials, createTestimonial } from '@/services/testimonial.service'
import { apiHandler, protectedApiHandler, validationError } from '@/lib/api-handler'
import { createTestimonialSchema } from '@/schemas/testimonial.schema'

export async function GET(req: NextRequest) {
  return apiHandler(async () => {
    const { searchParams } = new URL(req.url)
    const featured = searchParams.get('featured')

    const testimonials = await getTestimonials({
      featuredOnly: featured !== null ? featured === 'true' : undefined,
    })
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
    const data = {
      ...parsed.data,
      publishedAt: parsed.data.publishedAt ? new Date(parsed.data.publishedAt) : new Date(),
    }
    const testimonial = await createTestimonial(data)
    return NextResponse.json(testimonial, { status: 201 })
  })
}
