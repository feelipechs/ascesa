'use client'

import Image from 'next/image'
import { useState, type ComponentProps } from 'react'
import { ImagePlaceholder } from '@/components/shared/image-placeholder'

type SafeImageProps = ComponentProps<typeof Image> & {
  fallback?: React.ReactNode
}

export function SafeImage({ fallback, ...props }: SafeImageProps) {
  const [error, setError] = useState(false)

  if (error) {
    return fallback ?? <ImagePlaceholder className="h-full w-full" />
  }

  return <Image {...props} onError={() => setError(true)} />
}
