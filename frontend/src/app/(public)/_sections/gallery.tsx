import { cn } from '@/lib/utils'
import { GalleryImageCard } from './gallery-image-card'

type GalleryImage = {
  id: string
  src: string
  alt: string
}

type GalleryBlock = {
  layout: 'left-featured' | 'right-featured' | 'grid-4' | 'grid-3' | 'grid-2' | 'single'
  images: GalleryImage[]
}

type GalleryProps = {
  sections: GalleryBlock[]
  isAuthenticated?: boolean
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

function FeaturedBlock({
  images,
  layout,
  isAuthenticated,
  onEdit,
  onDelete,
}: {
  images: GalleryImage[]
  layout: 'left' | 'right'
  isAuthenticated?: boolean
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}) {
  if (layout === 'left') {
    const [featured, ...smalls] = images
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="col-span-2 row-span-2 relative min-h-[250px] sm:min-h-[400px] overflow-hidden rounded-lg">
          <GalleryImageCard
            src={featured.src}
            alt={featured.alt}
            isAuthenticated={isAuthenticated}
            onEdit={() => onEdit?.(featured.id)}
            onDelete={() => onDelete?.(featured.id)}
          />
        </div>
        {smalls.map((img) => (
          <div key={img.id} className="aspect-square relative overflow-hidden rounded-lg">
            <GalleryImageCard
              src={img.src}
              alt={img.alt}
              isAuthenticated={isAuthenticated}
              onEdit={() => onEdit?.(img.id)}
              onDelete={() => onDelete?.(img.id)}
            />
          </div>
        ))}
      </div>
    )
  }

  const smalls = images.slice(0, 4)
  const featured = images[4]
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      <div className="col-span-2 row-span-2 relative min-h-[250px] sm:min-h-[400px] sm:col-start-3 sm:row-start-1 overflow-hidden rounded-lg">
        <GalleryImageCard
          src={featured.src}
          alt={featured.alt}
          isAuthenticated={isAuthenticated}
          onEdit={() => onEdit?.(featured.id)}
          onDelete={() => onDelete?.(featured.id)}
        />
      </div>
      {smalls.map((img) => (
        <div key={img.id} className="aspect-square relative overflow-hidden rounded-lg">
          <GalleryImageCard
            src={img.src}
            alt={img.alt}
            isAuthenticated={isAuthenticated}
            onEdit={() => onEdit?.(img.id)}
            onDelete={() => onDelete?.(img.id)}
          />
        </div>
      ))}
    </div>
  )
}

export function Gallery({ sections, isAuthenticated, onEdit, onDelete }: GalleryProps) {
  return (
    <div className="space-y-6 sm:space-y-8">
      {sections.map((block, i) => {
        if (block.layout === 'left-featured' || block.layout === 'right-featured') {
          return (
            <FeaturedBlock
              key={i}
              images={block.images}
              layout={block.layout === 'left-featured' ? 'left' : 'right'}
              isAuthenticated={isAuthenticated}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          )
        }

        if (block.layout === 'grid-4') {
          return (
            <div key={i} className="grid grid-cols-2 gap-3 sm:gap-4">
              {block.images.map((img) => (
                <div key={img.id} className="aspect-square relative overflow-hidden rounded-lg">
                  <GalleryImageCard
                    src={img.src}
                    alt={img.alt}
                    isAuthenticated={isAuthenticated}
                    onEdit={() => onEdit?.(img.id)}
                    onDelete={() => onDelete?.(img.id)}
                  />
                </div>
              ))}
            </div>
          )
        }

        if (block.layout === 'grid-3') {
          return (
            <div key={i} className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {block.images.map((img, j) => (
                <div
                  key={img.id}
                  className={cn(
                    'aspect-square relative overflow-hidden rounded-lg',
                    j === 2 && 'col-span-2 sm:col-span-1'
                  )}
                >
                  <GalleryImageCard
                    src={img.src}
                    alt={img.alt}
                    isAuthenticated={isAuthenticated}
                    onEdit={() => onEdit?.(img.id)}
                    onDelete={() => onDelete?.(img.id)}
                  />
                </div>
              ))}
            </div>
          )
        }

        if (block.layout === 'grid-2') {
          return (
            <div key={i} className="grid grid-cols-2 gap-3 sm:gap-4">
              {block.images.map((img) => (
                <div key={img.id} className="aspect-square relative overflow-hidden rounded-lg">
                  <GalleryImageCard
                    src={img.src}
                    alt={img.alt}
                    isAuthenticated={isAuthenticated}
                    onEdit={() => onEdit?.(img.id)}
                    onDelete={() => onDelete?.(img.id)}
                  />
                </div>
              ))}
            </div>
          )
        }

        const img = block.images[0]
        return (
          <div key={i} className="max-w-3xl mx-auto">
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <GalleryImageCard
                src={img.src}
                alt={img.alt}
                isAuthenticated={isAuthenticated}
                onEdit={() => onEdit?.(img.id)}
                onDelete={() => onDelete?.(img.id)}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
