'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { PageSection } from '@/components/page-section'
import { SectionHeading } from '@/components/section-heading'

export function ImpactBanner() {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['-50%', '50%'])

  return (
    <section ref={ref} className="relative overflow-hidden min-h-[420px]">
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

      <PageSection className="relative z-10 text-center text-primary-foreground">
        <p className="text-chart-2 mb-4 text-sm font-medium uppercase tracking-widest">
          Nosso propósito
        </p>
        <SectionHeading
          title={
            <>
              Cada resgate é uma nova chance.
              <br />
              <span className="text-chart-2">Cada adoção, uma vida transformada.</span>
            </>
          }
        />
        <p className="mx-auto max-w-2xl text-xl leading-relaxed opacity-70">
          Unimos cuidado, amor e responsabilidade para oferecer aos animais um futuro com mais
          dignidade e esperança.
        </p>
      </PageSection>
    </section>
  )
}
