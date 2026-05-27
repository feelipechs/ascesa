type MarqueeProps = {
  items: string[]
}

export function Marquee({ items }: MarqueeProps) {
  const repeated = [...items, ...items, ...items]

  return (
    <div className="overflow-hidden border-t border-border/50 bg-muted/80 py-4 backdrop-blur-md">
      <div className="flex">
        {[0, 1].map((dup) => (
          <div key={dup} className="flex animate-marquee whitespace-nowrap">
            {repeated.map((item, index) => (
              <span key={`${dup}-${index}`} className="flex items-center gap-8 px-4 text-muted-foreground/40">
                {item}
                <span className="text-muted-foreground/30">•</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
