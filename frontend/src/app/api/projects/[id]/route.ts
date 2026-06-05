import { NextRequest, NextResponse } from 'next/server'
import { getProjectById, updateProject, deleteProject } from '@/services/project.service'
import { apiHandler, protectedApiHandler, validationError } from '@/lib/api-handler'
import { updateProjectSchema } from '@/schemas/project.schema'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  return apiHandler(async () => {
    const { id } = await params
    const project = await getProjectById(id)
    if (!project) return NextResponse.json({ error: 'Projeto não encontrado' }, { status: 404 })
    return NextResponse.json(project)
  })
}

export async function PUT(req: NextRequest, { params }: Params) {
  return protectedApiHandler(async () => {
    const { id } = await params
    const body = await req.json()
    const parsed = updateProjectSchema.safeParse(body)
    if (!parsed.success) {
      return validationError(parsed.error)
    }
    const { eventDate, areaId, coverMediaId, ...rest } = parsed.data
    const project = await updateProject(id, {
      ...rest,
      ...(areaId ? { area: { connect: { id: areaId } } } : {}),
      ...(coverMediaId !== undefined && {
        coverMedia: coverMediaId ? { connect: { id: coverMediaId } } : { disconnect: true },
      }),
      eventDate: eventDate === null ? null : eventDate ? new Date(eventDate) : undefined,
    })
    return NextResponse.json(project)
  })
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  return protectedApiHandler(async () => {
    const { id } = await params
    await deleteProject(id)
    return new NextResponse(null, { status: 204 })
  })
}
