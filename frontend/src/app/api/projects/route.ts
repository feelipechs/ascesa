import { NextRequest, NextResponse } from 'next/server'
import { getProjects, createProject } from '@/services/project.service'
import { apiHandler, protectedApiHandler, validationError } from '@/lib/api-handler'
import { createProjectSchema } from '@/schemas/project.schema'
import { projectFiltersSchema } from '@/schemas/project.filters.schema'

export async function GET(req: NextRequest) {
  return apiHandler(async () => {
    const { searchParams } = new URL(req.url)
    const query = Object.fromEntries(searchParams.entries())
    const parsed = projectFiltersSchema.safeParse(query)
    if (!parsed.success) return validationError(parsed.error)
    const { areas, ...rest } = parsed.data
    const result = await getProjects({
      ...rest,
      areas: areas ? areas.split(',') : [],
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

    const { areaId, coverMediaId, eventDate, ...rest } = parsed.data
    const project = await createProject({
      ...rest,
      area: { connect: { id: areaId } },
      ...(coverMediaId ? { coverMedia: { connect: { id: coverMediaId } } } : {}),
      eventDate: eventDate ? new Date(eventDate) : undefined,
    })

    return NextResponse.json(project, { status: 201 })
  })
}
