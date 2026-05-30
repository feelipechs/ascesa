import { NextResponse } from 'next/server'
import { getProjectsWithVolunteers } from '@/services/project.service'
import { protectedApiHandler } from '@/lib/api-handler'

export async function GET() {
  return protectedApiHandler(async () => {
    const projects = await getProjectsWithVolunteers()
    return NextResponse.json({ data: projects })
  })
}
