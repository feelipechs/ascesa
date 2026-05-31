import { NextRequest, NextResponse } from 'next/server'
import { protectedApiHandler } from '@/lib/api-handler'
import { uploadToR2 } from '@/lib/r2'

export async function POST(req: NextRequest) {
  return protectedApiHandler(async () => {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 })
    }

    const prefix = (formData.get('prefix') as string) || 'uploads'

    try {
      const url = await uploadToR2(file, prefix)
      return NextResponse.json({ url })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro no upload'
      return NextResponse.json({ error: message }, { status: 400 })
    }
  })
}
