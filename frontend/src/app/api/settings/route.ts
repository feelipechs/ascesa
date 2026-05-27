import { NextRequest, NextResponse } from 'next/server'
import { getSettings, upsertSettings } from '@/services/site-settings.service'
import { apiHandler, protectedApiHandler, validationError } from '@/lib/api-handler'
import { updateSiteSettingsSchema } from '@/schemas/site-settings.schema'

export async function GET() {
  return apiHandler(async () => {
    const settings = await getSettings()
    return NextResponse.json(settings)
  })
}

export async function PUT(req: NextRequest) {
  return protectedApiHandler(async () => {
    const body = await req.json()
    const parsed = updateSiteSettingsSchema.safeParse(body)
    if (!parsed.success) {
      return validationError(parsed.error)
    }
    const settings = await upsertSettings(parsed.data)
    return NextResponse.json(settings)
  })
}
