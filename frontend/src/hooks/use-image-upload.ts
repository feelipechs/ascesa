import { useCallback, useEffect, useRef, useState } from 'react'

interface UseImageUploadProps {
  onUpload?: (mediaId: string, url: string) => void
}

export function useImageUpload({ onUpload }: UseImageUploadProps = {}) {
  const previewRef = useRef<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const uploadFile = async (file: File, localUrl: string): Promise<{ mediaId: string; url: string }> => {
    try {
      setUploading(true)
      setError(null)

      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || 'Falha no upload')
      }

      const data = await res.json()
      return { mediaId: data.mediaId, url: data.url }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Falha no upload'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setUploading(false)
    }
  }

  const handleThumbnailClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file) {
        setFileName(file.name)
        const localUrl = URL.createObjectURL(file)
        setPreviewUrl(localUrl)
        previewRef.current = localUrl

        try {
          const { mediaId, url } = await uploadFile(file, localUrl)
          onUpload?.(mediaId, url)
        } catch (err) {
          URL.revokeObjectURL(localUrl)
          setPreviewUrl(null)
          setFileName(null)
          return console.error(err)
        }
      }
    },
    [onUpload]
  )

  const handleRemove = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setPreviewUrl(null)
    setFileName(null)
    previewRef.current = null
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    setError(null)
  }, [previewUrl])

  useEffect(() => {
    return () => {
      if (previewRef.current) {
        URL.revokeObjectURL(previewRef.current)
      }
    }
  }, [])

  return {
    previewUrl,
    fileName,
    fileInputRef,
    handleThumbnailClick,
    handleFileChange,
    handleRemove,
    uploading,
    error,
  }
}
