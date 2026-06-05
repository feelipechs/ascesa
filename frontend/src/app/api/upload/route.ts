import { NextRequest, NextResponse } from 'next/server'
import { protectedApiHandler } from '@/lib/api-handler'
import { uploadToR2, deleteFromR2 } from '@/lib/r2'
import { MediaService } from '@/services/media.service'

export async function POST(req: NextRequest) {
  return protectedApiHandler(async () => {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 })
    }

    const prefix = (formData.get('prefix') as string) || 'uploads'

    try {
      const result = await uploadToR2(file, prefix)

      const media = await MediaService.upsert(result.key, {
        hash: result.hash,
        url: result.url,
        mimeType: result.mimeType,
        size: result.size,
        originalName: result.originalName,
        width: result.width,
        height: result.height,
      })

      return NextResponse.json({ mediaId: media.id, url: media.url, key: media.key })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro no upload'
      return NextResponse.json({ error: message }, { status: 400 })
    }
  })
}

export async function DELETE(req: NextRequest) {
  return protectedApiHandler(async () => {
    const { searchParams } = new URL(req.url)
    const url = searchParams.get('url')

    if (!url) {
      return NextResponse.json({ error: 'URL não informada' }, { status: 400 })
    }

    try {
      await deleteFromR2(url)
      return new NextResponse(null, { status: 204 })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao deletar arquivo'
      return NextResponse.json({ error: message }, { status: 400 })
    }
  })
}
