import { NextRequest, NextResponse } from 'next/server'
import { getTeamMembers, createTeamMember } from '@/services/team-member.service'
import { apiHandler, protectedApiHandler, validationError } from '@/lib/api-handler'
import { createTeamMemberSchema } from '@/schemas/team-member.schema'

export async function GET() {
  return apiHandler(async () => {
    const members = await getTeamMembers()
    return NextResponse.json({ data: members })
  })
}

export async function POST(req: NextRequest) {
  return protectedApiHandler(async () => {
    const body = await req.json()
    const parsed = createTeamMemberSchema.safeParse(body)
    if (!parsed.success) {
      return validationError(parsed.error)
    }
    const member = await createTeamMember(parsed.data)
    return NextResponse.json(member, { status: 201 })
  })
}
