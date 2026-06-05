'use client'

import { useImageUpload } from '@/hooks/use-image-upload'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Upload, X, ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface ImageUploadFieldProps {
  mediaId: string | null | undefined
  url: string | null | undefined
  onChange: (mediaId: string, url: string) => void
  onRemove: () => void
  label?: string
  placeholder?: string
}

export function ImageUploadField({ mediaId, url, onChange, onRemove, label, placeholder }: ImageUploadFieldProps) {
  const {
    previewUrl,
    fileInputRef,
    handleFileChange,
    uploading,
    error,
  } = useImageUpload({
    onUpload: (uploadedMediaId, uploadedUrl) => onChange(uploadedMediaId, uploadedUrl),
  })

  const displayUrl = url || previewUrl

  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-sm font-medium">{label}</label>}

      {displayUrl ? (
        <div className="relative group rounded-lg border overflow-hidden">
          <Image
            src={displayUrl}
            alt="Preview"
            width={400}
            height={160}
            className="h-40 w-full object-cover"
            unoptimized={displayUrl.startsWith('blob:')}
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              Trocar
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onRemove}
            >
              <X className="h-4 w-4" />
              Remover
            </Button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 transition-colors hover:bg-accent",
            error && "border-destructive bg-destructive/5"
          )}
        >
          {uploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          ) : (
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
          )}
          <p className="text-sm text-muted-foreground">
            {uploading ? 'Enviando...' : 'Clique para enviar ou arraste uma imagem'}
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <input type="hidden" value={mediaId ?? ''} />

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
