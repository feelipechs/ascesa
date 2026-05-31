'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { cn } from '@/lib/utils'

type NumberTickerProps = {
  value: number
  direction?: 'up' | 'down'
  delay?: number
  duration?: number
  decimals?: number
  className?: string
}

export function NumberTicker({
  value,
  direction = 'up',
  delay = 0,
  duration = 2,
  decimals = 0,
  className,
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })
  const [displayValue, setDisplayValue] = useState(value)
  const animationStarted = useRef(false)

  useEffect(() => {
    if (!isInView || animationStarted.current) return
    animationStarted.current = true

    const startTime = Date.now() + delay * 1000
    const startValue = direction === 'down' ? value : 0
    const endValue = value

    function animate() {
      const now = Date.now()
      if (now < startTime) {
        requestAnimationFrame(animate)
        return
      }

      const elapsed = (now - startTime) / 1000
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)

      const current = startValue + (endValue - startValue) * eased
      setDisplayValue(current)

      if (progress < 1) requestAnimationFrame(animate)
    }

    requestAnimationFrame(animate)
  }, [isInView, value, direction, delay, duration])

  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      {displayValue.toFixed(decimals)}
    </span>
  )
}
