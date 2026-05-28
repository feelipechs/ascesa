import { cn } from '@/lib/utils'

interface PageSectionProps {
  children: React.ReactNode
  padding?: 'default' | 'compact'
  width?: 'default' | 'wide'
  borderTop?: boolean
  className?: string
}

export function PageSection({
  children,
  padding = 'default',
  width = 'default',
  borderTop = false,
  className,
}: PageSectionProps) {
  return (
    <section
      className={cn(
        padding === 'default' ? 'py-12 sm:py-16 md:py-24' : 'py-8 sm:py-12 md:py-16',
        borderTop && 'border-t border-border'
      )}
    >
      <div
        className={cn(
          'mx-auto px-4 sm:px-6 lg:px-8',
          width === 'default' ? 'max-w-6xl' : 'max-w-7xl',
          className
        )}
      >
        {children}
      </div>
    </section>
  )
}
