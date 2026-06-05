import { NextRequest, NextResponse } from 'next/server'
import { getTeamMemberById, updateTeamMember, deleteTeamMember } from '@/services/team-member.service'
import { apiHandler, protectedApiHandler, validationError } from '@/lib/api-handler'
import { updateTeamMemberSchema } from '@/schemas/team-member.schema'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  return apiHandler(async () => {
    const { id } = await params
    const member = await getTeamMemberById(id)
    if (!member) return NextResponse.json({ error: 'Membro não encontrado' }, { status: 404 })
    return NextResponse.json(member)
  })
}

export async function PUT(req: NextRequest, { params }: Params) {
  return protectedApiHandler(async () => {
    const { id } = await params
    const body = await req.json()
    const parsed = updateTeamMemberSchema.safeParse(body)
    if (!parsed.success) {
      return validationError(parsed.error)
    }
    const member = await updateTeamMember(id, parsed.data)
    return NextResponse.json(member)
  })
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  return protectedApiHandler(async () => {
    const { id } = await params
    await deleteTeamMember(id)
    return new NextResponse(null, { status: 204 })
  })
}
