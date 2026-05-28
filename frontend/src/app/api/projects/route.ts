import { NextRequest, NextResponse } from 'next/server'
import { getProjects, createProject } from '@/services/project.service'
import { apiHandler, protectedApiHandler, validationError } from '@/lib/api-handler'
import { createProjectSchema } from '@/schemas/project.schema'

export async function GET(req: NextRequest) {
  return apiHandler(async () => {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') ?? ''
    const areas = searchParams.get('areas') ?? ''
    const featured = searchParams.get('featured')
    const page = Number(searchParams.get('page') ?? '1')
    const limit = Number(searchParams.get('limit') ?? '8')

    const result = await getProjects({
      search,
      areas: areas ? areas.split(',') : [],
      featured: featured !== null ? featured === 'true' : undefined,
      page,
      limit,
    })

    return NextResponse.json(result)
  })
}

export async function POST(req: NextRequest) {
  return protectedApiHandler(async () => {
    const body = await req.json()
    const parsed = createProjectSchema.safeParse(body)

    if (!parsed.success) {
      return validationError(parsed.error)
    }

    const { areaId, publishedAt, eventDate, ...rest } = parsed.data
    const project = await createProject({
      ...rest,
      area: { connect: { id: areaId } },
      publishedAt: publishedAt ? new Date(publishedAt) : undefined,
      eventDate: eventDate ? new Date(eventDate) : undefined,
    })

    return NextResponse.json(project, { status: 201 })
  })
}
