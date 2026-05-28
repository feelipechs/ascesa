import { cn } from '@/lib/utils'
import { ImageOff } from 'lucide-react'

interface ImagePlaceholderProps {
  className?: string
}

export function ImagePlaceholder({ className }: ImagePlaceholderProps) {
  return (
    <div className={cn('flex items-center justify-center bg-muted', className)}>
      <ImageOff className="h-8 w-8 text-muted-foreground/40" />
    </div>
  )
}
