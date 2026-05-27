'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export function ImpactBanner() {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['-50%', '50%'])

  return (
    <div ref={ref} style={{ position: 'relative', overflow: 'hidden', minHeight: '420px' }}>
      <motion.div
        style={{
          backgroundImage: 'url(/images/impact-bg.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'absolute',
          top: '-50%',
          left: 0,
          right: 0,
          bottom: '-50%',
          y,
        }}
      />

      <div className="absolute inset-0 bg-foreground/65" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-24 text-center text-primary-foreground sm:px-6 lg:px-8">
        <p className="text-chart-2 mb-4 text-sm font-medium uppercase tracking-widest">
          Nosso propósito
        </p>
        <h2 className="mb-6 text-3xl font-semibold leading-tight md:text-4xl lg:text-5xl">
          Cada resgate é uma nova chance.
          <br />
          <span className="text-chart-2">Cada adoção, uma vida transformada.</span>
        </h2>
        <p className="text-primary-foreground/70 mx-auto max-w-2xl text-xl leading-relaxed">
          Unimos cuidado, amor e responsabilidade para oferecer aos animais um futuro com mais
          dignidade e esperança.
        </p>
      </div>
    </div>
  )
}
