import { NextRequest, NextResponse } from 'next/server'
import { reorderTeamMembers } from '@/services/team-member.service'
import { protectedApiHandler, validationError } from '@/lib/api-handler'
import { reorderTeamMemberSchema } from '@/schemas/team-member.schema'

export async function PATCH(req: NextRequest) {
  return protectedApiHandler(async () => {
    const body = await req.json()
    const parsed = reorderTeamMemberSchema.safeParse(body)
    if (!parsed.success) return validationError(parsed.error)
    const result = await reorderTeamMembers(parsed.data.items)
    return NextResponse.json({ data: result })
  })
}
