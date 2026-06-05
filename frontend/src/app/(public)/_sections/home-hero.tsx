'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { AuroraText } from '@/components/ui/aurora-text'
import { MorphingText } from '@/components/ui/morphing-text'
import Image from 'next/image'
import Link from 'next/link'
import { routes } from '@/lib/routes'

export function Hero() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="relative w-full min-h-dvh bg-background text-foreground flex flex-col overflow-hidden">
      <div className="relative z-10 flex-1 flex items-center px-4 min-h-0">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={mounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="flex flex-col gap-7"
          >
            <h1 className="text-5xl md:text-6xl xl:text-7xl font-black leading-[1.08] tracking-tight">
              <span className="block text-foreground">Todo animal</span>
              <span className="block">
                <AuroraText colors={['#941b00', '#d60c0c', '#fe7f16', '#f6b30d']}>merece</AuroraText>{' '}
              </span>
              <span className="text-foreground">um lar</span>
              <br />
              <MorphingText
                texts={['com amor.', 'seguro.', 'feliz.', 'para sempre.']}
                className="text-primary italic"
              />
            </h1>

            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-md font-light">
              Conectamos animais abandonados a famílias amorosas — com cuidado, transparência e{' '}
              <span className="text-foreground font-medium">muito carinho</span> em cada adoção.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                asChild
                size="lg"
                className="group px-8 py-6 text-base font-semibold rounded-xl shadow-[0_4px_24px_color-mix(in_oklch,var(--primary)_30%,transparent)] hover:shadow-[0_6px_32px_color-mix(in_oklch,var(--primary)_45%,transparent)] transition-all duration-300 hover:-translate-y-0.5"
              >
                <Link href={routes.animals}>
                  <span className="flex items-center gap-2">
                    Quero adotar
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="px-8 py-6 text-base font-medium rounded-xl transition-all duration-300 hover:-translate-y-0.5"
              >
                <Link href={routes.about}>Conhecer a ONG</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={mounted ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 28, scale: 0.97 }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
            className="relative hidden lg:flex items-center justify-center"
          >
            <div className="relative w-full">
              <Image
                src="/images/pets-test.png"
                alt="Animais para adoção"
                width={600}
                height={400}
                className="w-full h-auto object-cover object-top"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="relative z-10 flex justify-center py-5 flex-shrink-0">
        <div className="flex flex-col items-center gap-1.5 text-border animate-bounce">
          <span className="text-[10px] uppercase tracking-widest">descubra mais</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
    </section>
  )
}
